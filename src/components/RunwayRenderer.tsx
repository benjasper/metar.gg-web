import { createEffect, createSignal, For } from 'solid-js'
import * as merc from 'mercator-projection'
import { AirportSearchFragment } from '../generated/graphql'

const airports: Airport[] = [
	{
		runways: [
			{
				direction1: {
					runway: '09L',
					x: 52.468364,
					y: 9.648286,
				},
				direction2: {
					runway: '27R',
					x: 52.466825,
					y: 9.704136,
				},
			},
			{
				direction1: {
					runway: '09R',
					x: 52.454986,
					y: 9.676769,
				},
				direction2: {
					runway: '27L',
					x: 52.454031,
					y: 9.71115,
				},
			},
			{
				direction1: {
					runway: '09C',
					x: 52.464831,
					y: 9.683767,
				},
				direction2: {
					runway: '27C',
					x: 52.464522,
					y: 9.695144,
				},
			},
		],
	},
	{
		runways: [
			{
				direction1: {
					runway: '07L',
					x: 50.032617,
					y: 8.534631,
				},
				direction2: {
					runway: '25R',
					x: 50.045128,
					y: 8.586981,
				},
			},
			{
				direction1: {
					runway: '07R',
					x: 50.027542,
					y: 8.534175,
				},
				direction2: {
					runway: '25L',
					x: 50.040053,
					y: 8.586531,
				},
			},
			{
				direction1: {
					runway: '18',
					x: 50.034439,
					y: 8.525928,
				},
				direction2: {
					runway: '36',
					x: 49.998417,
					y: 8.526083,
				},
			},
		],
	},
]

const cartesianCoordinates = (lat, lon) => {
	const x = merc.fromLatLngToPoint({ lat: lat, lng: lon }).x
	const y = merc.fromLatLngToPoint({ lat: lat, lng: lon }).y

	return { x, y }
}

type TransformerFunction = (runway: Runway) => Runway

const convertAirport = (airport: Airport, transformFunction: TransformerFunction): Airport => {
	airport.runways = airport.runways.map(runway => {
		return transformFunction(runway)
	})

	return airport
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

const RunwayRenderer = (props: { airport: AirportSearchFragment }) => {
	const [runways, setRunways] = createSignal<Runway[]>([])

	const [centerX, setCenterX] = createSignal(0)
	const [centerY, setCenterY] = createSignal(0)

	const [realDiagonal, setRealDiagonal] = createSignal(0)

	// Lower is larger
	const scale = 0.04

	createEffect(() => {
		const preparingRunways = []

		props.airport.runways.forEach(runway => {
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

	return (
		<div class="w-1/2 md:w-full border rounded-full mx-auto md:mx-0">
			<svg
				class="cartesian w-full h-full"
				viewBox={`${-centerX()} ${-centerY()}  ${realDiagonal() * 2} ${realDiagonal() * 2}`}
				xmlns="http://www.w3.org/2000/svg">
				<For each={runways()}>
					{(r, i) => (
						<>
							<line
								x1={r.direction1.x}
								y1={r.direction1.y}
								x2={r.direction2.x}
								y2={r.direction2.y}
								stroke={i() % 2 === 0 ? 'lightgray' : 'green'}
								stroke-width="0.8"
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
	)
}

export default RunwayRenderer
