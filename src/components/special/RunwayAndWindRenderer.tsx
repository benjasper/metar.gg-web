import * as merc from 'mercator-projection'
import { createEffect, createSignal, For, Show } from 'solid-js'
import { AirportSearchFragment, MetarFragment } from '../../queries/generated/graphql'
import { VariableWind } from '../weather-elements/WindElement'

const cartesianCoordinates = (lat, lon) => {
	const x = merc.fromLatLngToPoint({ lat: lat, lng: lon }).x
	const y = merc.fromLatLngToPoint({ lat: lat, lng: lon }).y

	return { x, y }
}

const calculateMinMaxOfCoordinates = (
	runways: Runway[]
): { minX: number; minY: number; maxX: number; maxY: number } => {
	const maxX = Math.max(...runways.map(runway => Math.max(runway.direction1.x, runway.direction2.x)))
	const minX = Math.min(...runways.map(runway => Math.min(runway.direction1.x, runway.direction2.x)))

	const maxY = Math.max(...runways.map(runway => Math.max(runway.direction1.y, runway.direction2.y)))
	const minY = Math.min(...runways.map(runway => Math.min(runway.direction1.y, runway.direction2.y)))

	return { minX, minY, maxX, maxY }
}

interface Runway {
	direction1: RunwayDirection
	direction2: RunwayDirection
}

interface RunwayDirection {
	runway: string
	heading: number
	x: number
	y: number
	windAngle: number
	favourableLevel: number
}

const RunwayAndWindRenderer = (props: {
	airport: AirportSearchFragment
	windSpeed: number
	windDirection: number
	variableWind: VariableWind | undefined
}) => {
	const [runways, setRunways] = createSignal<Runway[]>([])

	const [centerX, setCenterX] = createSignal(0)
	const [centerY, setCenterY] = createSignal(0)

	const [realDiagonal, setRealDiagonal] = createSignal(0)

	// Scaling zoom
	const scale = 0.03

	createEffect(() => {
		const preparingRunways: Runway[] = []

		props.airport.runways.forEach(runway => {
			// Check if all runways have coordinates
			if (
				!(
					runway.lowRunwayLatitude &&
					runway.lowRunwayLongitude &&
					runway.highRunwayLatitude &&
					runway.highRunwayLongitude
				)
			) {
				return
			}

			if (
				runway.lowRunwayLatitude === undefined ||
				runway.lowRunwayLongitude === undefined ||
				runway.highRunwayLatitude === undefined ||
				runway.highRunwayLongitude === undefined
			) {
				return
			}

			const direction1 = cartesianCoordinates(runway.lowRunwayLatitude, runway.lowRunwayLongitude)
			const direction2 = cartesianCoordinates(runway.highRunwayLatitude, runway.highRunwayLongitude)

			preparingRunways.push({
				direction1: {
					runway: runway.lowRunwayIdentifier,
					heading: runway.lowRunwayHeading,
					x: direction1.x,
					y: direction1.y,
					favourableLevel: 0,
					windAngle:
						180 - Math.abs(Math.abs(runway.lowRunwayHeading - props.windDirection) - 180),
				},
				direction2: {
					runway: runway.highRunwayIdentifier,
					heading: runway.highRunwayHeading,
					x: direction2.x,
					y: direction2.y,
					favourableLevel: 0,
					windAngle:
						180 - Math.abs(Math.abs(runway.highRunwayHeading - props.windDirection) - 180),
				},
			})
		})

		// Calculate the best runway heading
		if (props.windSpeed > 2 && props.windDirection != 0) {
			const bestRunways = preparingRunways.filter(runway => {
				return runway.direction1.windAngle < 90 || runway.direction2.windAngle < 90
			})

			bestRunways.forEach(runway => {
				// Set the favourable level to 1 if the wind angle is less than 90 and 2 if the wind angle is less than 45 degrees
				if (runway.direction1.windAngle < 90)
					runway.direction1.favourableLevel = runway.direction1.windAngle < 45 ? 2 : 1

				if (runway.direction2.windAngle < 90)
					runway.direction2.favourableLevel = runway.direction2.windAngle < 45 ? 2 : 1
			})
		}

		const { minX, minY, maxX, maxY } = calculateMinMaxOfCoordinates(preparingRunways)

		const scaling = Math.sqrt((maxX - minX) * (maxX - minX) + (maxY - minY) * (maxY - minY)) * scale

		for (const runway of preparingRunways) {
			runway.direction1.x = (runway.direction1.x - minX) / scaling
			runway.direction1.y = (runway.direction1.y - minY) / scaling
			runway.direction2.x = (runway.direction2.x - minX) / scaling
			runway.direction2.y = (runway.direction2.y - minY) / scaling
		}

		const maximums = calculateMinMaxOfCoordinates(preparingRunways)

		// Scaling size lower is bigger
		setRealDiagonal(Math.sqrt(Math.pow(maximums.maxX, 2) + Math.pow(maximums.maxY, 2)) * 0.8)

		setCenterX(realDiagonal() - maximums.maxX / 2)
		setCenterY(realDiagonal() - maximums.maxY / 2)

		setRunways(preparingRunways)
	})

	// Calculate the radius around the center of the airport, to show a wind arrow
	const radius = () => realDiagonal() * 0.95

	const realCenterX = () => -centerX() + realDiagonal()
	const realCenterY = () => -centerY() + realDiagonal()

	// Calculate the wind arrow from the wind direction and variable wind if present
	const windArrows = (): { angle: number; x: number; y: number; isVariable: boolean }[] => {
		const arrows: { angle: number; x: number; y: number; isVariable: boolean }[] = []

		if (props.windSpeed > 2 && props.windDirection != 0) {
			arrows.push({
				angle: props.windDirection,
				x: realCenterX() + radius() * Math.cos(((props.windDirection - 90) * Math.PI) / 180),
				y: realCenterY() + radius() * Math.sin(((props.windDirection - 90) * Math.PI) / 180),
				isVariable: false,
			})
		}

		if (props.variableWind) {
			arrows.push({
				angle: props.variableWind.from,
				x: realCenterX() + radius() * Math.cos(((props.variableWind.from - 90) * Math.PI) / 180),
				y: realCenterY() + radius() * Math.sin(((props.variableWind.from - 90) * Math.PI) / 180),
				isVariable: true,
			})

			arrows.push({
				angle: props.variableWind.to,
				x: realCenterX() + radius() * Math.cos(((props.variableWind.to - 90) * Math.PI) / 180),
				y: realCenterY() + radius() * Math.sin(((props.variableWind.to - 90) * Math.PI) / 180),
				isVariable: true,
			})
		}

		return arrows
	}

	return (
		<Show when={runways().length > 0}>
			<div class="relative w-full rounded-full mx-auto md:mx-0">
				<svg
					class="cartesian md:w-[22rem] h-full"
					viewBox={`${-centerX()} ${-centerY()}  ${realDiagonal() * 2} ${realDiagonal() * 2}`}
					xmlns="http://www.w3.org/2000/svg">
					{/* Compass circle */}
					<circle
						transform-origin="center"
						class="fill-gray-100 dark:fill-[#212637] transition-colors"
						stroke-width="0.2"
						cx={realCenterX()}
						cy={realCenterY()}
						r={realDiagonal() * 0.85}></circle>

					{/* Wind arrow */}
					<Show when={props.windSpeed > 0 && props.windDirection != 0}>
						<For each={windArrows()}>
							{arrow => (
								<svg
									width="8"
									height="8"
									fill="none"
									viewBox="0 0 24 24"
									transform-origin="center"
									x={arrow.x - 4}
									y={arrow.y - 4}>
									<title>{arrow.isVariable ? "Variable wind direction" : "Wind direction"}</title>
									<path
										transform-origin="center"
										transform={`rotate(${arrow.angle})`}
										stroke="currentColor"
										class="stroke-gray-600 dark:stroke-white-dark transition-colors"
										classList={{ 'opacity-50': arrow.isVariable }}
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-dasharray={arrow.isVariable ? '1 1.2' : ''}
										stroke-width={arrow.isVariable ? '0.75' : '1.25'}
										d="M15.25 10.75L12 14.25L8.75 10.75"></path>
								</svg>
							)}
						</For>
					</Show>

					{/* Runways including stripes */}
					<For each={runways()}>
						{(r, i) => (
							<>
								<line
									x1={r.direction1.x}
									y1={r.direction1.y}
									x2={r.direction2.x}
									y2={r.direction2.y}
									class="stroke-gray-600"
									stroke-width="0.9"
								/>
								<line
									x1={r.direction1.x}
									y1={r.direction1.y}
									x2={r.direction2.x}
									y2={r.direction2.y}
									class="stroke-white"
									stroke-width="0.2"
									stroke-dasharray="1.2,0.6"
								/>
							</>
						)}
					</For>

					{/* Runway bubbles outside when favourable */}
					<For each={runways()}>
						{(r, i) => (
							<>
								<Show when={r.direction1.favourableLevel > 0}>
									<circle
										class="transition-colors"
										classList={{
											'fill-blue-400 dark:fill-blue-600': r.direction1.favourableLevel === 1,
											'fill-green-400 dark:fill-green-600': r.direction1.favourableLevel === 2,
										}}
										cx={r.direction1.x}
										cy={r.direction1.y}
										r="2"
									/>
								</Show>
								<Show when={r.direction2.favourableLevel > 0}>
									<circle
										class="transition-colors"
										classList={{
											'fill-blue-400 dark:fill-blue-600': r.direction2.favourableLevel === 1,
											'fill-green-400 dark:fill-green-600': r.direction2.favourableLevel === 2,
										}}
										cx={r.direction2.x}
										cy={r.direction2.y}
										r="2"
									/>
								</Show>
							</>
						)}
					</For>

					{/* Runway bubbles inside */}
					<For each={runways()}>
						{(r, i) => (
							<>
								<circle
									class="transition-colors"
									classList={{
										'fill-gray-600': r.direction1.favourableLevel === 0,
										'fill-blue-600 dark:fill-blue-800': r.direction1.favourableLevel === 1,
										'fill-green-600 dark:fill-green-800': r.direction1.favourableLevel === 2,
									}}
									cx={r.direction1.x}
									cy={r.direction1.y}
									r="1.5"
								/>
								<circle
									class="transition-colors"
									classList={{
										'fill-gray-600': r.direction2.favourableLevel === 0,
										'fill-blue-600 dark:fill-blue-800': r.direction2.favourableLevel === 1,
										'fill-green-600 dark:fill-green-800': r.direction2.favourableLevel === 2,
									}}
									cx={r.direction2.x}
									cy={r.direction2.y}
									r="1.5"
								/>
							</>
						)}
					</For>

					{/* Runway labels */}
					<For each={runways()}>
						{(r, i) => (
							<>
								<text
									class="text-[1.1px] fill-white"
									x={r.direction1.x}
									y={r.direction1.y}
									dominant-baseline="middle"
									text-anchor="middle">
									{r.direction1.runway}
								</text>
								<text
									class="text-[1.1px] fill-white"
									x={r.direction2.x}
									y={r.direction2.y}
									dominant-baseline="middle"
									text-anchor="middle">
									{r.direction2.runway}
								</text>
							</>
						)}
					</For>
				</svg>
			</div>
		</Show>
	)
}

export default RunwayAndWindRenderer
