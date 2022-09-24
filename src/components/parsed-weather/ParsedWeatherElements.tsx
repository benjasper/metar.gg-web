import { For, Show } from 'solid-js'
import { AirportSearchFragment } from '../../queries/generated/graphql'
import ParsedWeatherItem from './ParsedWeatherItem'
import RunwayRenderer from '../RunwayRenderer'
import RunwayLayout from '../RunwayRenderer'

const ParsedWeatherElements = (props: { airport: AirportSearchFragment; class?: string }) => {
	const latestMetar = () => {
		if (props.airport.station.metars.edges.length === 0) {
			return undefined
		}

		return props.airport.station.metars.edges[0].node
	}

	return (
		<div class={`flex flex-col md:flex-row gap-8 justify-center ${props.class ?? ''}`}>
			<Show when={latestMetar()} fallback={<span class="text-lg mx-auto">No recent weather available.</span>}>
				<div class="flex flex-col flex-shrink-0">
					<ParsedWeatherItem class="flex-shrink-0">
						<span class="mx-auto">Wind</span>
						<RunwayRenderer airport={props.airport}></RunwayRenderer>
						<Show when={latestMetar()}>
							<p class="text-center">
								{latestMetar().windDirection}° at {latestMetar().windSpeed}kt
							</p>
						</Show>
					</ParsedWeatherItem>
				</div>
				<div class="flex flex-row flex-wrap justify-center md:justify-start gap-8">
					<ParsedWeatherItem>
						<span class="mx-auto">Visibility</span>
						<p class="text-center text-xl">{latestMetar().visibility} miles</p>
					</ParsedWeatherItem>
					<ParsedWeatherItem>
						<span class="mx-auto">Sky conditions</span>
						<div class="flex flex-col gap-2 text-center text-xl">
							<For each={latestMetar().skyConditions.reverse()}>
								{(condition, i) => (
									<div class="flex flex-row gap-1 mx-auto text-center">
										<span>{condition.skyCover}</span>
										<Show when={condition.cloudBase}>
											<span>at</span>
											<span class="my-auto">{condition.cloudBase} ft</span>
										</Show>
									</div>
								)}
							</For>
						</div>
					</ParsedWeatherItem>
					<ParsedWeatherItem>
						<span class="mx-auto">Temperature</span>
						<p class="text-center text-xl">{latestMetar().temperature}°C</p>
					</ParsedWeatherItem>
					<ParsedWeatherItem>
						<span class="mx-auto">Dewpoint</span>
						<p class="text-center text-xl">{latestMetar().dewpoint}°C</p>
					</ParsedWeatherItem>

					<ParsedWeatherItem>
						<span class="mx-auto">Altimeter</span>
						<p class="text-center text-xl">{latestMetar().altimeter.toFixed(2)} inHg</p>
					</ParsedWeatherItem>

					<Show when={latestMetar().presentWeather}>
						<ParsedWeatherItem>
							<span class="mx-auto">Precipitation</span>
							<p class="text-center text-xl">{latestMetar().presentWeather}</p>
						</ParsedWeatherItem>
					</Show>

					<Show when={latestMetar().flightCategory}>
						<ParsedWeatherItem>
							<span class="mx-auto">Flight Category</span>
							<p class="text-center text-xl">{latestMetar().flightCategory}</p>
						</ParsedWeatherItem>
					</Show>
				</div>
			</Show>
		</div>
	)
}

export default ParsedWeatherElements
