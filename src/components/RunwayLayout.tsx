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
]

const cartesianCoordinates = (lat, lon) => {
	const x = merc.fromLatLngToPoint({ lat: lat, lng: lon }).x
	const y = merc.fromLatLngToPoint({ lat: lat, lng: lon }).y

	return { x, y }
}

const transformRunwayCoordinates = (runway: Runway): Runway => {
	runway.direction1.x = cartesianCoordinates(runway.direction1.x, runway.direction1.y).x
	runway.direction1.y = cartesianCoordinates(runway.direction1.x, runway.direction1.y).y
	runway.direction2.x = cartesianCoordinates(runway.direction2.x, runway.direction2.y).x
	runway.direction2.y = cartesianCoordinates(runway.direction2.x, runway.direction2.y).y

	return runway
}

type TransformerFunction = (runway: Runway) => Runway

const convertAirport = (airport: Airport, transformFunction: TransformerFunction): Airport => {
	airport.runways = airport.runways.map(runway => {
		return transformFunction(runway)
	})

	return airport
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

const RunwayLayout = () => {
	// Lower is larger
	const scale = 0.05

	let airport = convertAirport(airports[0], transformRunwayCoordinates)
	console.log(airport)

	const maxX = Math.max(
		...airport.runways.map(runway =>
			Math.max(runway.direction1.x, runway.direction2.x)
		)
	)
	const minX = Math.min(
		...airport.runways.map(runway =>
			Math.min(runway.direction1.x, runway.direction2.x)
		)
	)

	const maxY = Math.max(
		...airport.runways.map(runway =>
			Math.max(runway.direction1.y, runway.direction2.y)
		)
	)
	const minY = Math.min(
		...airport.runways.map(runway =>
			Math.min(runway.direction1.y, runway.direction2.y)
		)
	)

	const diagonal = Math.sqrt((maxX - minX) * (maxX - minX) + (maxY - minY) * (maxY - minY)) * scale

	airport = convertAirport(airport, (runway: Runway): Runway => {
		runway.direction1.x = (runway.direction1.x - minX) / diagonal
		runway.direction1.y = (runway.direction1.y - minY) / diagonal
		runway.direction2.x = (runway.direction2.x - minX) / diagonal
		runway.direction2.y = (runway.direction2.y - minY) / diagonal

		return runway
	})

	return (
		<div class="border rounded-full">
			<svg class="cartesian w-full h-full" viewBox="-10 -20 40 40" xmlns="http://www.w3.org/2000/svg">
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
								dx={-4}
								dy={0.5}
								x={r.direction1.x}
								y={r.direction1.y}
								classList={{ 'bg-red-600': i() % 2 === 0, 'bg-green-600': i() % 2 !== 0 }}>
								{r.direction1.runway}
							</text>
							<text
								class="text-[1.5px]"
								dx={1}
								dy={0.5}
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

export default RunwayLayout
