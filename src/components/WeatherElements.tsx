import { For, Show, Switch } from 'solid-js'
import { AirportSearchFragment } from '../queries/generated/graphql'
import WeatherElementLayout from '../layouts/WeatherElementLayout'
import RunwayRenderer from './RunwayRenderer'
import RunwayLayout from './RunwayRenderer'
import PrecipitationElement from './weather-elements/PrecipitationElement'

const WeatherElements = (props: { airport: AirportSearchFragment; class?: string }) => {
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
					<WeatherElementLayout name="Wind" class="flex-shrink-0">
						<RunwayRenderer airport={props.airport}></RunwayRenderer>
						<Show when={latestMetar()}>
							<p class="text-center">
								{latestMetar().windDirection}° at {latestMetar().windSpeed}kt
							</p>
						</Show>
					</WeatherElementLayout>
				</div>
				<div class="flex flex-row flex-wrap justify-center md:justify-start gap-8">
					<WeatherElementLayout name='Visibility'>
						<p class="text-center text-xl">
							<Show when={Math.round(latestMetar().visibility) === 10}>&gt;</Show>
							{latestMetar().visibility.toFixed(1)} km
						</p>
					</WeatherElementLayout>

					<WeatherElementLayout name='Sky conditions'>
						<div class="flex flex-col gap-2 text-center text-xl">
							<For each={latestMetar().skyConditions.sort((a,b) => b.cloudBase - a.cloudBase)}>
								{(condition, i) => (
									<div class="flex flex-row gap-1 mx-auto text-center">
										<span>{condition.skyCover}</span>
										<Show when={condition.cloudBase}>
											<span>at</span>
											<span class="my-auto">{Math.round(condition.cloudBase)} ft</span>
										</Show>
									</div>
								)}
							</For>
						</div>
					</WeatherElementLayout>

					<WeatherElementLayout name='Temperature'>
						<p class="text-center text-xl">{latestMetar().temperature} °C</p>
					</WeatherElementLayout>

					<WeatherElementLayout name='Dewpoint'>
						<p class="text-center text-xl">{latestMetar().dewpoint} °C</p>
					</WeatherElementLayout>

					<WeatherElementLayout name='Altimeter'>
						<p class="text-center text-xl">{latestMetar().altimeter.toFixed(0)} hPa</p>
					</WeatherElementLayout>

					<Show when={latestMetar().presentWeather}>
						<PrecipitationElement latestMetar={latestMetar()}></PrecipitationElement>
					</Show>

					<Show when={latestMetar().flightCategory}>
						<WeatherElementLayout name='Flight category'>
							<p class="text-center text-xl">{latestMetar().flightCategory}</p>
						</WeatherElementLayout>
					</Show>
				</div>
			</Show>
		</div>
	)
}

export default WeatherElements
