import { HiOutlineRefresh } from 'solid-icons/hi'
import { Component, createMemo, Show } from 'solid-js'
import { useTimeStore } from '../context/TimeStore'
import Duration from '../models/duration'
import { AirportSearchFragment } from '../queries/generated/graphql'
import { Tag } from './Tag'
import Tooltip from './Tooltip'
import AltimeterElement from './weather-elements/AltimeterElement'
import FlightCategoryElement from './weather-elements/FlightCategoryElement'
import { PrecipitationElement } from './weather-elements/PrecipitationElement'
import SkyConditionsElement from './weather-elements/SkyConditionsElement'
import TemperatureElement from './weather-elements/TemperatureElement'
import VisibilityElement from './weather-elements/VisibilityElement'
import WindElement from './weather-elements/WindElement'

interface ParsedWeatherElementsProps {
	airport: AirportSearchFragment
	lastRefreshed: Date
}

const WeatherElements: Component<ParsedWeatherElementsProps> = props => {
	const latestMetar = createMemo(() => props.airport?.station?.metars?.edges[0]?.node)
	const previousMetar = createMemo(() => props.airport?.station?.metars?.edges[1]?.node)

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
						<h2 class="text-2xl dark:text-white-dark">Current weather</h2>
						<div class="flex flex-row flex-wrap justify-start gap-2 pt-2">
							<Tag
								intent={lastObservationDuration().asHours() <= 2 ? 'successful' : 'danger'}
								tooltip={metarObservationTime().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}>
								Observed {lastObservationDuration().humanImprecise()}
							</Tag>
							<Tag
								tooltip={importTime().toLocaleTimeString([], {
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
									intent={
										nextImportPredictionDuration().isPast() &&
										nextImportPredictionDuration().asHours() > 2
											? 'danger'
											: 'successful'
									}
									tooltip={nextImportPrediction().toLocaleTimeString([], {
										hour: 'numeric',
										minute: '2-digit',
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}>
									<Show
										when={nextImportPredictionDuration().isFuture()}
										fallback={'Next update expected any moment now'}>
										Next update expected {nextImportPredictionDuration().humanImprecise()}
									</Show>
								</Tag>
							</Show>
						</div>
					</div>
					<Tooltip
						text={`Refreshed ${Duration.fromDates(props.lastRefreshed, now()).humanPrecise(false)}`}
						delay={1000}>
						<span class="mt-4 flex text-gray-700 dark:text-white-dark md:mt-auto">
							<HiOutlineRefresh class="my-auto mr-2" />
							Constantly checking for updates
						</span>
					</Tooltip>
				</Show>
			</div>
			<div class={'mt-4 flex h-full flex-col justify-center gap-8 md:flex-row'}>
				<Show when={latestMetar()} fallback={<span class="m-auto text-lg">No recent weather available.</span>}>
					<div class="flex flex-shrink-0 flex-col">
						<WindElement
							airport={props.airport}
							windData={{
								windDirection: latestMetar()!.windDirection,
								windSpeed: latestMetar()!.windSpeed,
								windGust: latestMetar()!.windGust,
								variableWindDirection: latestMetar()?.rawText ?? '',
								isVariable: latestMetar()!.windDirectionVariable,
							}}
							previousWindDate={{
								windDirection: previousMetar()?.windDirection,
								windSpeed: previousMetar()?.windSpeed,
								windGust: previousMetar()?.windGust,
								variableWindDirection: previousMetar()?.rawText ?? '',
								isVariable: previousMetar()?.windDirectionVariable ?? false,
							}}
							size="large"
						/>
					</div>
					<div class="flex flex-row flex-wrap justify-center gap-8 md:justify-start">
						<VisibilityElement
							visibility={latestMetar()!.visibility}
							visibilityMoreThan={latestMetar()!.visibilityIsMoreThan}
							previousVisibility={previousMetar()?.visibility}
							previousVisibilityMoreThan={previousMetar()?.visibilityIsMoreThan}
						/>

						<Show when={latestMetar()!.skyConditions!.length > 0}>
							<SkyConditionsElement
								skyConditions={latestMetar()!.skyConditions!}
								previousSkyConditions={previousMetar()?.skyConditions ?? undefined}
								airport={props.airport}
							/>
						</Show>

						<Show when={latestMetar()!.temperature !== undefined}>
							<TemperatureElement
								temperature={latestMetar()!.temperature!}
								previousTemperature={previousMetar()?.temperature ?? undefined}
								name="Temperature"
							/>
						</Show>

						<Show when={latestMetar()!.dewpoint !== undefined}>
							<TemperatureElement
								temperature={latestMetar()!.dewpoint!}
								previousTemperature={previousMetar()?.dewpoint ?? undefined}
								name="Dewpoint"
							/>
						</Show>

						<Show when={latestMetar()!.altimeter !== undefined}>
							<AltimeterElement
								altimeter={latestMetar()!.altimeter!}
								previousAltimeter={previousMetar()?.altimeter ?? undefined}
							/>
						</Show>

						<Show when={latestMetar()!.presentWeather && (latestMetar()!.presentWeather ?? '').length > 0}>
							<PrecipitationElement
								weather={latestMetar()!.presentWeather ?? ''}
								previousWeather={previousMetar()!.presentWeather ?? undefined}
							/>
						</Show>

						<Show when={latestMetar()!.flightCategory}>
							<FlightCategoryElement latestMetar={latestMetar()!} previousMetar={previousMetar()} />
						</Show>
					</div>
				</Show>
			</div>
			<div class="flex flex-col gap-4 py-16">
				<Show when={props.airport && props.airport!.station!.metars.edges[0]}>
					<p aria-label="METAR" class="text-center font-mono text-xl dark:text-white-dark">
						{props.airport!.station!.metars.edges[0].node.rawText}
					</p>
				</Show>
			</div>
		</>
	)
}

export default WeatherElements
