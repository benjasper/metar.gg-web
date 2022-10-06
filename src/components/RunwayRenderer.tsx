import { createEffect, createSignal, For, Show, untrack } from 'solid-js'
import * as merc from 'mercator-projection'
import { AirportSearchFragment } from '../queries/generated/graphql'

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
	x: number
	y: number
}

interface Airport {
	runways: Runway[]
}

const RunwayRenderer = (props: { airport: AirportSearchFragment, windDirection: number }) => {
	const [runways, setRunways] = createSignal<Runway[]>([])

	const [centerX, setCenterX] = createSignal(0)
	const [centerY, setCenterY] = createSignal(0)

	const [realDiagonal, setRealDiagonal] = createSignal(0)

	// Lower is larger
	const scale = 0.04

	createEffect(() => {
		const preparingRunways = []

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
					x: direction1.x,
					y: direction1.y,
				},
				direction2: {
					runway: runway.highRunwayIdentifier,
					x: direction2.x,
					y: direction2.y,
				},
			})
		})

		const { minX, minY, maxX, maxY } = calculateMinMaxOfCoordinates(preparingRunways)

		const scaling = Math.sqrt((maxX - minX) * (maxX - minX) + (maxY - minY) * (maxY - minY)) * scale

		for (const runway of preparingRunways) {
			runway.direction1.x = (runway.direction1.x - minX) / scaling
			runway.direction1.y = (runway.direction1.y - minY) / scaling
			runway.direction2.x = (runway.direction2.x - minX) / scaling
			runway.direction2.y = (runway.direction2.y - minY) / scaling
		}

		const maximums = calculateMinMaxOfCoordinates(preparingRunways)

		setRealDiagonal(Math.sqrt(Math.pow(maximums.maxX, 2) + Math.pow(maximums.maxY, 2)) * 0.6)
		setCenterX(realDiagonal() - maximums.maxX / 2)
		setCenterY(realDiagonal() - maximums.maxY / 2)

		setRunways(preparingRunways)
	})

	// Calculate the radius around the center of the airport, to show a wind arrow
	const radius = () => realDiagonal()

	const windDirectionInDegree = () => props.windDirection - 90

	const realCenterX = () => -centerX() + realDiagonal()
	const realCenterY = () => -centerY() + realDiagonal()

	// Place the wind arrow onto the circle around the center of the airport
	const windArrowX = () => realCenterX() + radius() * Math.cos((windDirectionInDegree() * Math.PI) / 180)
	const windArrowY = () => realCenterY() + radius() * Math.sin((windDirectionInDegree() * Math.PI) / 180)

	// Calculate the angle of the wind arrow
	const windArrowAngle = () => {
		const angle = windDirectionInDegree() + 90

		if (angle > 180) {
			return angle - 360
		}

		return angle
	}

	return (
		<Show when={runways().length > 0}>
			<div class="w-full rounded-full mx-auto md:mx-0">
				<svg
					class="cartesian w-full h-full"
					viewBox={`${-centerX()} ${-centerY()}  ${realDiagonal() * 2} ${realDiagonal() * 2}`}
					xmlns="http://www.w3.org/2000/svg">
					<rect
						class="fill-grey-800"
						x={windArrowX() - 0.25}
						y={windArrowY()}
						width="0.5"
						height={2}
						transform={`rotate(${windArrowAngle()}, ${windArrowX()}, ${windArrowY()})`}></rect>

					<For each={runways()}>
						{(r, i) => (
							<>
								<line
									x1={r.direction1.x}
									y1={r.direction1.y}
									x2={r.direction2.x}
									y2={r.direction2.y}
									class="stroke-gray-600"
									stroke-width="0.8"
								/>
								<line
									x1={r.direction1.x}
									y1={r.direction1.y}
									x2={r.direction2.x}
									y2={r.direction2.y}
									class="stroke-white"
									stroke-width="0.15"
									stroke-dasharray="0.9,0.6"
								/>
							</>
						)}
					</For>
					<For each={runways()}>
						{(r, i) => (
							<>
								<circle class="fill-gray-600" cx={r.direction1.x} cy={r.direction1.y} r="1" />
								<text
									class="text-[0.8px] fill-white"
									x={r.direction1.x}
									y={r.direction1.y}
									dominant-baseline="middle"
									text-anchor="middle">
									{r.direction1.runway}
								</text>
								<circle class="fill-gray-600" cx={r.direction2.x} cy={r.direction2.y} r="1" />
								<text
									class="text-[0.8px] fill-white"
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

export default RunwayRenderer
