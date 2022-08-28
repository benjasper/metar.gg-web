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
	}
]

const cartesianCoordinates = (lat, lon) => {
	const x = merc.fromLatLngToPoint({ lat: lat, lng: lon }).x
	const y = merc.fromLatLngToPoint({ lat: lat, lng: lon }).y

	return [x, y]
}

const runwaysCartesian = runwaysRaw.map(({ runway1, runway2, lat1, lon1, lat2, lon2 }) => {
	const [x1, y1] = cartesianCoordinates(lat1, lon1)
	const [x2, y2] = cartesianCoordinates(lat2, lon2)
	return { runway1, runway2, x1, y1, x2, y2 }
})

interface Runway {
	runway1: string
	runway2: string
	x1: number
	y1: number
	x2: number
	y2: number
}

const calculateLineEquation = (runway: Runway) => {
	const [x1, y1] = [runway.x1, runway.y1]
	const [x2, y2] = [runway.x2, runway.y2]
	const m = (y2 - y1) / (x2 - x1)
	const b = y1 - m * x1
	return { m, b }
}


const RunwayLayout = () => {
	// Lower is larger
	const scale = 0.1

	const maxX = Math.max(...runwaysCartesian.map(({ x1, y1, x2, y2 }) => (x1 > x2 ? x1 : x2)))
	const minX = Math.min(...runwaysCartesian.map(({ x1, y1, x2, y2 }) => (x1 < x2 ? x1 : x2)))

	const maxY = Math.max(...runwaysCartesian.map(({ x1, y1, x2, y2 }) => (y1 > y2 ? y1 : y2)))
	const minY = Math.min(...runwaysCartesian.map(({ x1, y1, x2, y2 }) => (y1 < y2 ? y1 : y2)))

	const diagonal = Math.sqrt((maxX - minX) * (maxX - minX) + (maxY - minY) * (maxY - minY)) * scale

	const normalizedRunways: Runway[] = runwaysCartesian.map(({ runway1, runway2, x1, y1, x2, y2 }) => {
		return {
			runway1,
			runway2,
			x1: (x1 - minX) / diagonal,
			y1: (y1 - minY) / diagonal,
			x2: (x2 - minX) / diagonal,
			y2: (y2 - minY) / diagonal,
		}
	})

	return (
		<div class="border rounded-full">
			<svg class="cartesian w-full h-full scale-125" viewBox="-5 -10 20 20" xmlns="http://www.w3.org/2000/svg">
				<For each={normalizedRunways}>
					{(r, i) => (
						<>
							<line
								x1={r.x1}
								y1={r.y1}
								x2={r.x2}
								y2={r.y2}
								stroke={i() % 2 === 0 ? 'red' : 'green'}
								stroke-width="0.3"
							/>
							<text class='text-[1px]' dx={-2.5} dy={0.5} x={r.x1} y={r.y1} classList={{'bg-red-600': i() % 2 === 0, 'bg-green-600': i() % 2 !== 0}}>{r.runway1}</text>
							<text class='text-[1px]' dy={0.5} x={r.x2} y={r.y2} classList={{'bg-red-600': i() % 2 === 0, 'bg-green-600': i() % 2 !== 0}}>{r.runway2}</text>
						</>
					)}
				</For>
			</svg>
		</div>
	)
}

export default RunwayLayout
