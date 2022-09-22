import { For, Show } from 'solid-js'
import { AirportSearchFragment } from '../../queries/generated/graphql'
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
					<span class="mx-auto">Wind</span>
					<RunwayRenderer airport={props.airport}></RunwayRenderer>
					<Show when={latestMetar()}>
						<p class="text-center">
							{latestMetar().windDirection}° at {latestMetar().windSpeed}kt
						</p>
					</Show>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<span class="mx-auto">Temperature</span>
					<p class="text-center text-xl">{latestMetar().temperature}°C</p>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<span class="mx-auto">Visibility</span>
					<p class="text-center text-xl">{latestMetar().visibility} miles</p>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<span class="mx-auto">Altimeter</span>
					<p class="text-center text-xl">{latestMetar().altimeter.toFixed(2)} inHg</p>
				</ParsedWeatherItem>
				<ParsedWeatherItem>
					<span class="mx-auto">Sky conditions</span>
					<div class="flex flex-col gap-2 text-center text-xl">
						<For each={latestMetar().skyConditions.reverse()}>
							{(condition, i) => (
								<div class="flex flex-row gap-1 mx-auto text-center">
									<span>{condition.skyCover}</span>
									<span>at</span>
									<Show when={condition.cloudBase}>
										<span class="my-auto">{condition.cloudBase}</span>
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
