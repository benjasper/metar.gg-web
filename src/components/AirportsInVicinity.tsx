import { A } from '@solidjs/router'
import { TbArrowTopCircle } from 'solid-icons/tb'
import { Component, For, Match, Show, Switch } from 'solid-js'
import { useUnitStore } from '../context/UnitStore'
import { StationsVicinityFragment } from '../queries/generated/graphql'
import Slider from '../Slider'
import AirportClassification from './AirportClassification'
import FlightCategorySymbol from './FlightCategorySymbol'
import { Tag } from './Tag'

interface AirportsInVicinityProps {
	airportCoordinates: {
		latitude: number
		longitude: number
	}
	stations: StationsVicinityFragment['stationsVicinity']
}

const degreeToDirection = (degree: number): string => {
	const directions = [
		'North',
		'North-East',
		'East',
		'South-East',
		'South',
		'South-West',
		'West',
		'North-West',
		'North',
	]
	if (degree < 0) {
		degree = 360 - Math.abs(degree)
	}

	const index = Math.round((degree % 360) / 45)
	return directions[index]
}

interface Coordinates {
	latitude: number
	longitude: number
}

function getInitialBearing(point1: Coordinates, point2: Coordinates): number {
	const lat1 = (point1.latitude * Math.PI) / 180
	const lon1 = (point1.longitude * Math.PI) / 180
	const lat2 = (point2.latitude * Math.PI) / 180
	const lon2 = (point2.longitude * Math.PI) / 180

	const Δlon = lon2 - lon1

	const θ = Math.atan2(
		Math.sin(Δlon) * Math.cos(lat2),
		Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(Δlon)
	)

	return (θ * 180) / Math.PI
}

const AirportsInVicinity: Component<AirportsInVicinityProps> = props => {
	const [unitStore] = useUnitStore()

	const selectedLengthUnit = () => unitStore.length.units[unitStore.length.selected]

	// Calculate bearing from airport to airport in vicinity
	const bearing = (airport: StationsVicinityFragment['stationsVicinity'][number]) => {
		const pos1: Coordinates = {
			latitude: airport.station.airport!.latitude,
			longitude: airport.station.airport!.longitude,
		}

		const pos2: Coordinates = {
			latitude: props.airportCoordinates.latitude,
			longitude: props.airportCoordinates.longitude,
		}

		return getInitialBearing(pos2, pos1)
	}

	return (
		<section class="flex flex-col">
			<Show when={props.stations.length > 0}>
				<h3 class="text-2xl dark:text-white-dark">Nearby airports</h3>
				<div class="flex gap-2 pt-2">
					<Tag>
						{props.stations.length >= 10 ? 'At least 10' : props.stations.length}{' '}
						{props.stations.length === 1 ? 'airport' : 'airports'} in the vicinity
					</Tag>
				</div>
				<Slider class="mt-4" items={props.stations} mobileCentered={true}>
					<For each={props.stations}>
						{airport => (
							<A
								href={`/airport/${airport.station.airport?.identifier}`}
								class="flex cursor-pointer flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:bg-black-200 dark:text-white-dark hover:dark:bg-black-100">
								<div class="flex flex-col whitespace-nowrap">
									<h4>
										<Switch>
											<Match
												when={
													airport.station.airport?.icaoCode &&
													airport.station.airport?.iataCode
												}>
												{airport.station.airport?.icaoCode} /{' '}
												{airport.station.airport?.iataCode}
											</Match>
											<Match when={airport.station.airport?.icaoCode}>
												{airport.station.airport?.icaoCode}
											</Match>
											<Match when={airport.station.airport?.gpsCode}>
												{airport.station.airport?.gpsCode}
											</Match>
											<Match when={true}>{airport.station.airport?.identifier}</Match>
										</Switch>
									</h4>
									<span class="text-sm">{airport.station.airport?.name}</span>
									<div class="mt-2 flex gap-2">
										<Tag intent="neutral">
											<AirportClassification
												type={airport.station.airport!.type}></AirportClassification>
										</Tag>
										<Show
											when={
												airport.station.metars.edges.length > 0 &&
												airport.station.metars.edges[0].node.flightCategory
											}>
											<Tag intent="neutral">
												<FlightCategorySymbol
													size="small"
													class="my-auto"
													flightCategory={
														airport.station.metars.edges[0].node.flightCategory!
													}
												/>
												{airport.station.metars.edges[0].node.flightCategory}
											</Tag>
										</Show>
									</div>
								</div>
								<TbArrowTopCircle
									class="mx-auto my-2 origin-center transform"
									size={36}
									style={{
										rotate: `${bearing(airport)}deg`,
									}}></TbArrowTopCircle>
								<span class="mx-auto whitespace-nowrap">
									{Math.round(selectedLengthUnit().conversionFunction(airport.distance))}{' '}
									{selectedLengthUnit().symbol} ({degreeToDirection(bearing(airport))})
								</span>
							</A>
						)}
					</For>
				</Slider>
			</Show>
		</section>
	)
}

export default AirportsInVicinity
