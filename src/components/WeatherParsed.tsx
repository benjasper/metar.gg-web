import { For, Show } from 'solid-js'
import { Airport, AirportSearchFragment } from '../generated/graphql'
import ParsedWeatherItem from './parsed-weather/ParsedWeatherItem'
import RunwayRenderer from './RunwayRenderer'
import RunwayLayout from './RunwayRenderer'

const WeatherParsed = (props: { airport: AirportSearchFragment }) => {
	return (
		<div class="grid grid-flow-row md:grid-flow-col auto-cols-fr gap-8 justify-center">
			<ParsedWeatherItem class="max-w-xs">
				<h3 class="mx-auto">Wind</h3>
				<RunwayRenderer airport={props.airport}></RunwayRenderer>
				<p class="text-center">
					{props.airport.station.metars.edges[0].node.windDirection}° at{' '}
					{props.airport.station.metars.edges[0].node.windSpeed}kt
				</p>
			</ParsedWeatherItem>
			<ParsedWeatherItem>
				<h3 class="mx-auto">Temperature</h3>
				<p class="text-center text-xl">{props.airport.station.metars.edges[0].node.temperature}°C</p>
			</ParsedWeatherItem>
			<ParsedWeatherItem>
				<h3 class="mx-auto">Visibility</h3>
				<p class="text-center text-xl">{props.airport.station.metars.edges[0].node.visibility} miles</p>
			</ParsedWeatherItem>
			<ParsedWeatherItem>
				<h3 class="mx-auto">Altimeter</h3>
				<p class="text-center text-xl">
					{props.airport.station.metars.edges[0].node.altimeter.toFixed(2)} inHg
				</p>
			</ParsedWeatherItem>
			<ParsedWeatherItem>
				<h3 class="mx-auto">Sky conditions</h3>
				<div class="flex flex-col gap-2 text-center text-xl">
					<For each={props.airport.station.metars.edges[0].node.skyConditions.reverse()}>
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
		</div>
	)
}

export default WeatherParsed
