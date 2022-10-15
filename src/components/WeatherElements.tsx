import { For, Show, Switch } from 'solid-js'
import { AirportSearchFragment } from '../queries/generated/graphql'
import WeatherElementLayout from '../layouts/WeatherElementLayout'
import PrecipitationElement from './weather-elements/PrecipitationElement'
import WindElement from './weather-elements/WindElement'
import SkyConditionsElement from './weather-elements/SkyConditionsElement'
import FlightCategoryElement from './weather-elements/FlightCategoryElement'

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
					<WindElement airport={props.airport} latestMetar={latestMetar()} />
				</div>
				<div class="flex flex-row flex-wrap justify-center md:justify-start gap-8">
					<WeatherElementLayout name="Visibility">
						<p class="text-center text-xl dark:text-white-dark">
							<Show when={Math.round(latestMetar().visibility) === 10 || latestMetar().visibility.toFixed(1) === '16.1'}>&ge;&nbsp;</Show>
							{latestMetar().visibility.toFixed(1)} km
						</p>
					</WeatherElementLayout>

					<SkyConditionsElement metar={latestMetar()} />

					<WeatherElementLayout name="Temperature">
						<p class="text-center text-xl dark:text-white-dark">{Math.round(latestMetar().temperature)} °C</p>
					</WeatherElementLayout>

					<WeatherElementLayout name="Dewpoint">
						<p class="text-center text-xl dark:text-white-dark">{Math.round(latestMetar().dewpoint)} °C</p>
					</WeatherElementLayout>

					<WeatherElementLayout name="Altimeter">
						<p class="text-center text-xl dark:text-white-dark">{latestMetar().altimeter.toFixed(0)} hPa</p>
					</WeatherElementLayout>

					<Show when={latestMetar().presentWeather}>
						<PrecipitationElement latestMetar={latestMetar()}></PrecipitationElement>
					</Show>

					<Show when={latestMetar().flightCategory}>
						<FlightCategoryElement latestMetar={latestMetar()}></FlightCategoryElement>
					</Show>
				</div>
			</Show>
		</div>
	)
}

export default WeatherElements
