import { For, Show } from 'solid-js'
import { Airport, AirportSearchFragment, MetarFragment } from '../../generated/graphql'
import ParsedWeatherItem from './ParsedWeatherItem'
import RunwayRenderer from '../RunwayRenderer'
import RunwayLayout from '../RunwayRenderer'

const ParsedWeatherElements = (props: { airport: AirportSearchFragment }) => {
	const latestMetar = () => {
		if (props.airport.station.metars.edges.length === 0) {
			return undefined
		}

		return props.airport.station.metars.edges[0].node
	}

	return (
		<div class="grid grid-flow-row md:grid-flow-col auto-cols-fr gap-8 justify-center">
			<Show when={latestMetar()} fallback={<span class="text-lg mx-auto">No recent weather available.</span>}>
				<ParsedWeatherItem class="max-w-xs">
					<h3 class="mx-auto">Wind</h3>
					<RunwayRenderer airport={props.airport}></RunwayRenderer>
					<Show when={latestMetar()}>
						<p class="text-center">
							{latestMetar().windDirection}° at {latestMetar().windSpeed}kt
						</p>
					</Show>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<h3 class="mx-auto">Temperature</h3>
					<p class="text-center text-xl">{latestMetar().temperature}°C</p>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<h3 class="mx-auto">Visibility</h3>
					<p class="text-center text-xl">{latestMetar().visibility} miles</p>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<h3 class="mx-auto">Altimeter</h3>
					<p class="text-center text-xl">{latestMetar().altimeter.toFixed(2)} inHg</p>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<h3 class="mx-auto">Sky conditions</h3>
					<div class="flex flex-col gap-2 text-center text-xl">
						<For each={latestMetar().skyConditions.reverse()}>
							{(condition, i) => (
								<div class="flex flex-col mx-auto text-center">
									<span>{condition.skyCover}</span>
									<Show when={condition.cloudBase}>
										<span class="text-sm">{condition.cloudBase}</span>
									</Show>
								</div>
							)}
						</For>
					</div>
				</ParsedWeatherItem>
			</Show>
		</div>
	)
}

export default ParsedWeatherElements
