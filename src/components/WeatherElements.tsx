import { Component, createMemo, For, Show, Switch } from 'solid-js'
import { AirportSearchFragment } from '../queries/generated/graphql'
import WeatherElementLayout from '../layouts/WeatherElementLayout'
import PrecipitationElement from './weather-elements/PrecipitationElement'
import WindElement from './weather-elements/WindElement'
import SkyConditionsElement from './weather-elements/SkyConditionsElement'
import FlightCategoryElement from './weather-elements/FlightCategoryElement'
import { RiMapPinDistanceFill } from 'solid-icons/ri'
import { TbGauge, TbTemperature } from 'solid-icons/tb'
import { FaSolidArrowDown, FaSolidGauge, FaSolidGaugeHigh, FaSolidGaugeSimpleHigh } from 'solid-icons/fa'

interface ParsedWeatherElementsProps {
	airport: AirportSearchFragment
	class?: string
}

const WeatherElements: Component<ParsedWeatherElementsProps> = (props) => {
	const latestMetar = createMemo(() => props.airport?.station.metars?.edges[0]?.node)

	return (
		<div class={`flex h-full flex-col justify-center gap-8 md:flex-row ${props.class ?? ''}`}>
			<Show when={latestMetar()} fallback={<span class="m-auto text-lg">No recent weather available.</span>}>
				<div class="flex flex-shrink-0 flex-col">
					<WindElement airport={props.airport} latestMetar={latestMetar()} />
				</div>
				<div class="flex flex-row flex-wrap justify-center gap-8 md:justify-start">
					<WeatherElementLayout name="Visibility" icon={<RiMapPinDistanceFill></RiMapPinDistanceFill>}>
						<p class="text-center text-xl dark:text-white-dark">
							<Show
								when={
									Math.round(latestMetar().visibility) === 10 ||
									latestMetar().visibility.toFixed(1) === '16.1'
								}>
								&ge;&nbsp;
							</Show>
							{latestMetar().visibility.toFixed(1)} km
						</p>
					</WeatherElementLayout>

					<Show when={latestMetar().skyConditions.length > 0}>
						<SkyConditionsElement metar={latestMetar()} airport={props.airport} />
					</Show>

					<WeatherElementLayout name="Temperature" icon={<TbTemperature></TbTemperature>}>
						<p class="text-center text-xl dark:text-white-dark">
							{Math.round(latestMetar().temperature)} °C
						</p>
					</WeatherElementLayout>

					<WeatherElementLayout name="Dewpoint" icon={<TbTemperature></TbTemperature>}>
						<p class="text-center text-xl dark:text-white-dark">{Math.round(latestMetar().dewpoint)} °C</p>
					</WeatherElementLayout>

					<WeatherElementLayout name="Altimeter" icon={<FaSolidGauge class=''></FaSolidGauge>}>
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
