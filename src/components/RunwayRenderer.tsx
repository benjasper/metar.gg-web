import { For } from 'solid-js'
import * as merc from 'mercator-projection'

const runwaysRaw = [
	{
		runway1: '09L',
		runway2: '27R',
		lat1: 52.468364,
		lon1: 9.648286,
		lat2: 52.466825,
		lon2: 9.704136,
	},
	{
		runway1: '09R',
		runway2: '27L',
		lat1: 52.454986,
		lon1: 9.676769,
		lat2: 52.454031,
		lon2: 9.71115,
	},
	{
		runway1: '09C',
		runway2: '27C',
		lat1: 52.464831,
		lon1: 9.683767,
		lat2: 52.464522,
		lon2: 9.695144,
	},
]

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

const transformRunwayCoordinates = (runway: Runway): Runway => {
	const direction1 = cartesianCoordinates(runway.direction1.x, runway.direction1.y)
	const direction2 = cartesianCoordinates(runway.direction2.x, runway.direction2.y)

	runway.direction1.x = direction1.x
	runway.direction1.y = direction1.y
	runway.direction2.x = direction2.x
	runway.direction2.y = direction2.y

	return runway
}

type TransformerFunction = (runway: Runway) => Runway

const convertAirport = (airport: Airport, transformFunction: TransformerFunction): Airport => {
	airport.runways = airport.runways.map(runway => {
		return transformFunction(runway)
	})

	return airport
}

const calculateMinMaxOfCoordinates = (airport: Airport): { minX: number; minY: number; maxX: number; maxY: number } => {
	const maxX = Math.max(...airport.runways.map(runway => Math.max(runway.direction1.x, runway.direction2.x)))
	const minX = Math.min(...airport.runways.map(runway => Math.min(runway.direction1.x, runway.direction2.x)))

	const maxY = Math.max(...airport.runways.map(runway => Math.max(runway.direction1.y, runway.direction2.y)))
	const minY = Math.min(...airport.runways.map(runway => Math.min(runway.direction1.y, runway.direction2.y)))

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

const RunwayRenderer = () => {
	// Lower is larger
	const scale = 0.05

	let airport = convertAirport(airports[1], transformRunwayCoordinates)

	const { minX, minY, maxX, maxY } = calculateMinMaxOfCoordinates(airport)

	const scaling = Math.sqrt((maxX - minX) * (maxX - minX) + (maxY - minY) * (maxY - minY)) * scale

	airport = convertAirport(airport, (runway: Runway): Runway => {
		runway.direction1.x = (runway.direction1.x - minX) / scaling
		runway.direction1.y = (runway.direction1.y - minY) / scaling
		runway.direction2.x = (runway.direction2.x - minX) / scaling
		runway.direction2.y = (runway.direction2.y - minY) / scaling

		return runway
	})

	const maximums = calculateMinMaxOfCoordinates(airport)
	const realDiagonal = Math.sqrt(Math.pow(maximums.maxX, 2) + Math.pow(maximums.maxY, 2)) * 0.7

	const centerY = (realDiagonal - (maximums.maxY / 2))
	const centerX = (realDiagonal - (maximums.maxX / 2))

	return (
		<div class="border rounded-full">
			<svg
				class="cartesian w-full h-full"
				viewBox={`${-centerX} ${-centerY}  ${realDiagonal * 2} ${realDiagonal * 2}`}
				xmlns="http://www.w3.org/2000/svg">
				<For each={airport.runways}>
					{(r, i) => (
						<>
							<line
								x1={r.direction1.x}
								y1={r.direction1.y}
								x2={r.direction2.x}
								y2={r.direction2.y}
								stroke={i() % 2 === 0 ? 'red' : 'green'}
								stroke-width="0.8"
							/>
							<text
								class="text-[1.5px]"
								x={r.direction1.x}
								y={r.direction1.y}
								classList={{ 'bg-red-600': i() % 2 === 0, 'bg-green-600': i() % 2 !== 0 }}>
								{r.direction1.runway}
							</text>
							<text
								class="text-[1.5px]"
								x={r.direction2.x}
								y={r.direction2.y}
								classList={{ 'bg-red-600': i() % 2 === 0, 'bg-green-600': i() % 2 !== 0 }}>
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
