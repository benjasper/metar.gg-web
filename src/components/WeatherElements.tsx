import { HiOutlineRefresh } from 'solid-icons/hi'
import { TbTemperature } from 'solid-icons/tb'
import { Component, createMemo, Show } from 'solid-js'
import { useTimeStore } from '../context/TimeStore'
import WeatherElementLayout from '../layouts/WeatherElementLayout'
import Duration from '../models/duration'
import { AirportSearchFragment } from '../queries/generated/graphql'
import { Tag } from './Tag'
import AltimeterElement from './weather-elements/AltimeterElement'
import FlightCategoryElement from './weather-elements/FlightCategoryElement'
import { PrecipitationElement } from './weather-elements/PrecipitationElement'
import SkyConditionsElement from './weather-elements/SkyConditionsElement'
import VisibilityElement from './weather-elements/VisibilityElement'
import WindElement from './weather-elements/WindElement'

interface ParsedWeatherElementsProps {
	airport: AirportSearchFragment
	lastRefreshed: Date
}

const WeatherElements: Component<ParsedWeatherElementsProps> = props => {
	const latestMetar = createMemo(() => props.airport?.station?.metars?.edges[0]?.node)

	const now = useTimeStore()

	const metarObservationTime = () =>
		new Date(props.airport?.station?.metars?.edges[0]?.node.observationTime) ?? undefined
	const lastObservationDuration = (): Duration => Duration.fromDates(metarObservationTime(), now())

	const nextImportPrediction = () =>
		new Date(props.airport?.station?.metars?.edges[0]?.node.nextImportTimePrediction) ?? undefined
	const nextImportPredictionDuration = (): Duration => Duration.fromDates(nextImportPrediction(), now())

	const importTime = () => new Date(props.airport?.station?.metars?.edges[0]?.node.importTime) ?? undefined
	const importTimeDuration = (): Duration => Duration.fromDates(importTime(), now())

	return (
		<>
			<div class="flex flex-col justify-between md:flex-row">
				<Show when={(props.airport?.station?.metars.edges.length ?? 0) > 0}>
					<div class="flex flex-col">
						<h3 class="text-2xl dark:text-white-dark">Current weather</h3>
						<div class="flex flex-row flex-wrap justify-start gap-2 pt-2">
							<Tag
								class="cursor-default rounded-full px-3 py-1 text-xs text-white dark:text-white-light"
								classList={{
									'bg-green-600 dark:bg-green-800': lastObservationDuration().asHours() <= 2,
									'bg-red-600 dark:bg-red-800': lastObservationDuration().asHours() > 2,
								}}
								title={metarObservationTime().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}>
								Observed {lastObservationDuration().humanImprecise()}
							</Tag>
							<Tag
								class="cursor-default rounded-full bg-white px-3 py-1 text-xs text-black dark:bg-black-200 dark:text-white-light"
								title={importTime().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}>
								Published {importTimeDuration().humanImprecise()}
							</Tag>
							<Show
								when={
									!(
										nextImportPredictionDuration().isPast() &&
										nextImportPredictionDuration().asHours() > 2
									)
								}>
								<Tag
									class="cursor-default rounded-full px-3 py-1 text-xs text-white dark:text-white-light"
									classList={{
										'bg-orange-500 dark:bg-orange-800':
											nextImportPredictionDuration().isPast() &&
											nextImportPredictionDuration().asMinutes() > 5,
										'bg-green-600 dark:bg-green-800':
											nextImportPredictionDuration().isFuture() ||
											(nextImportPredictionDuration().asMinutes() <= 5 &&
												nextImportPredictionDuration().isPast()),
									}}
									title={nextImportPrediction().toLocaleTimeString([], {
										hour: 'numeric',
										minute: '2-digit',
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}>
									<Show
										when={nextImportPredictionDuration().isFuture()}
										fallback={`Next update expected any moment now`}>
										Next update expected {nextImportPredictionDuration().humanImprecise()}
									</Show>
								</Tag>
							</Show>
						</div>
					</div>
					<span
						class="mt-4 flex text-gray-700 dark:text-white-dark md:mt-auto"
						title={`Refreshed ${Duration.fromDates(props.lastRefreshed, now()).humanPrecise()}`}>
						<HiOutlineRefresh class="my-auto mr-2" />
						Constantly checking for updates
					</span>
				</Show>
			</div>
			<div class={`mt-4 flex h-full flex-col justify-center gap-8 md:flex-row`}>
				<Show when={latestMetar()} fallback={<span class="m-auto text-lg">No recent weather available.</span>}>
					<div class="flex flex-shrink-0 flex-col">
						<WindElement
							airport={props.airport}
							windDirection={latestMetar().windDirection}
							windSpeed={latestMetar().windSpeed}
							windGust={latestMetar().windGust}
							variableWindDirection={latestMetar().presentWeather ?? ''}
							size="large"
						/>
					</div>
					<div class="flex flex-row flex-wrap justify-center gap-8 md:justify-start">
						<VisibilityElement visibility={latestMetar().visibility}></VisibilityElement>

						<Show when={latestMetar().skyConditions.length > 0}>
							<SkyConditionsElement skyConditions={latestMetar().skyConditions} airport={props.airport} />
						</Show>

						<WeatherElementLayout name="Temperature" icon={<TbTemperature></TbTemperature>}>
							<p class="text-center text-xl dark:text-white-dark">
								{Math.round(latestMetar().temperature)} °C
							</p>
						</WeatherElementLayout>

						<WeatherElementLayout name="Dewpoint" icon={<TbTemperature></TbTemperature>}>
							<p class="text-center text-xl dark:text-white-dark">
								{Math.round(latestMetar().dewpoint)} °C
							</p>
						</WeatherElementLayout>

						<Show when={latestMetar().altimeter !== 0}>
							<AltimeterElement altimeter={latestMetar().altimeter}></AltimeterElement>
						</Show>

						<Show when={latestMetar().presentWeather && latestMetar().presentWeather.length > 0}>
							<PrecipitationElement weather={latestMetar().presentWeather}></PrecipitationElement>
						</Show>

						<Show when={latestMetar().flightCategory}>
							<FlightCategoryElement latestMetar={latestMetar()}></FlightCategoryElement>
						</Show>
					</div>
				</Show>
			</div>
			<div class="flex flex-col gap-4 py-16">
				<Show when={props.airport && props.airport.station.metars.edges[0]}>
					<p aria-label="METAR" class="text-center font-mono text-xl dark:text-white-dark">
						{props.airport.station.metars.edges[0].node.rawText}
					</p>
				</Show>
			</div>
		</>
	)
}

export default WeatherElements
