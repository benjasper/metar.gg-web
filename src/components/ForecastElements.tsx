import { Toggle } from 'solid-headless'
import { HiOutlineSwitchHorizontal } from 'solid-icons/hi'
import { IoChevronUp } from 'solid-icons/io'
import { RiWeatherWindyLine } from 'solid-icons/ri'
import { Component, createEffect, createMemo, createSignal, For, onCleanup, Show } from 'solid-js'
import { createSlider } from 'solid-slider'
import { useTimeStore } from '../context/TimeStore'
import WeatherElementLayout from '../layouts/WeatherElementLayout'
import Duration from '../models/duration'
import { AirportSearchFragment, ForecastFragment, TafFragment } from '../queries/generated/graphql'
import { Tag } from './Tag'
import AltimeterElement from './weather-elements/AltimeterElement'
import { PrecipitationElement } from './weather-elements/PrecipitationElement'
import SkyConditionsElement from './weather-elements/SkyConditionsElement'
import VisibilityElement from './weather-elements/VisibilityElement'

export interface ForecastElementsProps {
	taf?: TafFragment
	airport: AirportSearchFragment
}

const changeIndicatorToSortingIndex = (changeIndicator: string): number => {
	switch (changeIndicator) {
		case '':
			return 0
		case 'BECMG':
			return 1
		case 'TEMPO':
			return 2
		case 'PROB':
			return 3
		default:
			return 4
	}
}

const ForecastElements: Component<ForecastElementsProps> = props => {
	const now = useTimeStore()

	const issueTime = () => new Date(props.taf.issueTime)
	const issueTimeDuration = (): Duration => Duration.fromDates(issueTime(), now())

	const validFrom = createMemo(() => new Date(props.taf.validFromTime))
	const validTo = createMemo(() => new Date(props.taf.validToTime))

	const isValid = () => validFrom().getTime() <= now().getTime() && validTo().getTime() >= now().getTime()

	const [isLocalTime, setIsLocalTime] = createSignal(false)
	const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	const timeZoneIsSameAsAirport = createMemo(
		() =>
			new Date(props.taf.issueTime).toLocaleString('en-US', { timeZone: browserTimezone }) ===
			new Date(props.taf.issueTime).toLocaleString('en-US', { timeZone: props.airport.timezone })
	)

	const forecastsSorted = createMemo(() => {
		const forecasts: ForecastFragment[] = []

		props.taf.forecast.forEach(forecast => {
			forecasts.push(forecast)
		})

		return forecasts.sort((x, y) => {
			const xChangeIndicator = changeIndicatorToSortingIndex(x.changeIndicator ?? '')
			const yChangeIndicator = changeIndicatorToSortingIndex(y.changeIndicator ?? '')

			const xIndex = new Date(x.fromTime).getTime() + xChangeIndicator
			const yIndex = new Date(y.fromTime).getTime() + yChangeIndicator

			return xIndex - yIndex
		})
	})

	const forecasts = () => forecastsSorted().filter(x => new Date(x.toTime).getTime() > now().getTime())

	// Slider containing all forecasts
	const [slider, { current, next, prev, moveTo, slider: sliderInstance }] = createSlider({
		slides: { perView: 1, spacing: 40 },
		breakpoints: {
			'(min-width: 500px)': {
				slides: { perView: 'auto', spacing: 40 },
			},
		},
		mode: 'snap',
	})

	const recalculateSlider = () => {
		if (sliderInstance()) {
			moveTo(0)
			sliderInstance().update()
		}
	}

	addEventListener('resize', recalculateSlider);

	// Rerun the slider when it's items change
	createEffect(() => {
		if ((props.airport.icaoCode || props.taf.rawText) && sliderInstance()) {
			recalculateSlider()
		}
	})

	const timeFormat: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: 'numeric',
	}

	onCleanup(() => removeEventListener('resize', recalculateSlider))

	return (
		<div class="flex w-full flex-col">
			<Show when={props.taf} fallback={<span class="mx-auto mt-8">No forecast available.</span>}>
				<>
					<h3 class="text-2xl dark:text-white-dark">Current forecast</h3>
					<div class="flex w-full flex-row flex-wrap justify-between gap-2 pt-2">
						<div class="flex flex-wrap gap-2">
							<Tag
								class="text-white dark:text-white-light"
								classList={{
									'bg-green-600 dark:bg-green-800': issueTimeDuration().asHours() <= 24,
									'bg-red-600 dark:bg-red-800': issueTimeDuration().asHours() > 24,
								}}
								title={issueTime().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
									timeZone: isLocalTime() ? props.airport.timezone : browserTimezone,
								})}>
								Issued {issueTimeDuration().humanImprecise()}
							</Tag>
							<Tag
								class="text-white dark:text-white-light"
								classList={{
									'bg-green-600 dark:bg-green-800': isValid(),
									'bg-yellow-600 dark:bg-yellow-800': !isValid(),
								}}>
								Valid from{' '}
								{validFrom().toLocaleDateString([], {
									hour: 'numeric',
									minute: '2-digit',
									timeZone: isLocalTime() ? props.airport.timezone : browserTimezone,
								})}{' '}
								to{' '}
								{validTo().toLocaleDateString([], {
									hour: 'numeric',
									minute: '2-digit',
									timeZone: isLocalTime() ? props.airport.timezone : browserTimezone,
								})}
							</Tag>
						</div>
						<Show when={!timeZoneIsSameAsAirport()}>
							<div class="flex gap-2">
								<label for="localTime" class="my-auto normal-case">
									My time
								</label>
								<Toggle
									id="local-time"
									pressed={isLocalTime()}
									onChange={setIsLocalTime}
									class="relative inline-flex h-[1.5rem] w-[3rem] shrink-0 cursor-pointer rounded-full transition-all"
									classList={{
										'bg-blue-600 dark:bg-blue-700': isLocalTime(),
										'bg-gray-200 dark:bg-black-100': !isLocalTime(),
									}}>
									<span class="sr-only">Timezone setting</span>
									<span
										aria-hidden="true"
										class={`${
											isLocalTime() ? 'translate-x-[1.6rem]' : 'translate-x-[0.1rem]'
										} pointer-events-none my-auto inline-block h-[1.3rem] w-[1.3rem] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-white-dark`}
									/>
								</Toggle>
								<label for="localTime" class="my-auto normal-case">
									Local time
								</label>
							</div>
						</Show>
					</div>
					<div class={`mt-4 max-w-full overflow-x-hidden md:overflow-x-visible`}>
						<div use:slider>
							<For each={forecasts()}>
								{forecast => (
									<div class="flex flex-col gap-2">
										<div class="inline-block">
											<span class="text-left dark:text-white-dark">
												{new Date(forecast.fromTime).toLocaleString('default', {
													weekday: 'long',
													...timeFormat,
													timeZone: isLocalTime() ? props.airport.timezone : browserTimezone,
												})}
											</span>
											<span class="text-left dark:text-white-dark">
												{' '}
												-{' '}
												{new Date(forecast.toTime).toLocaleString('default', {
													weekday:
														new Date(forecast.fromTime).toLocaleDateString('default', {
															weekday: 'long',
														}) !==
														new Date(forecast.toTime).toLocaleDateString('default', {
															weekday: 'long',
														})
															? 'long'
															: undefined,
													...timeFormat,
													timeZone: isLocalTime() ? props.airport.timezone : browserTimezone,
												})}
											</span>
										</div>
										<Show when={forecast.changeIndicator}>
											<WeatherElementLayout
												name="Change indicator"
												icon={<HiOutlineSwitchHorizontal />}
												class="mb-2 !flex-grow-0">
												<span class="mx-auto">{forecast.changeIndicator}</span>
											</WeatherElementLayout>
										</Show>
										<div class="flex w-full max-w-full flex-col flex-wrap gap-4 md:w-[30rem] md:flex-row">
											<Show when={forecast.visibilityHorizontal}>
												<VisibilityElement
													visibility={forecast.visibilityHorizontal}></VisibilityElement>
											</Show>
											<Show when={forecast.changeProbability}>
												<WeatherElementLayout name="Probability" icon={<></>}>
													<span class="mx-auto text-lg dark:text-white-darker">
														{forecast.changeProbability}%
													</span>
												</WeatherElementLayout>
											</Show>
											<Show when={forecast.skyConditions.length > 0}>
												<SkyConditionsElement
													skyConditions={forecast.skyConditions}
													airport={props.airport}></SkyConditionsElement>
											</Show>
											<Show when={forecast.weather.length > 1}>
												<PrecipitationElement weather={forecast.weather}></PrecipitationElement>
											</Show>
											<Show when={forecast.altimeter && forecast.altimeter > 0}>
												<AltimeterElement altimeter={forecast.altimeter}></AltimeterElement>
											</Show>
											<Show when={forecast.windSpeed}>
												<WeatherElementLayout
													name="Wind"
													icon={<RiWeatherWindyLine></RiWeatherWindyLine>}>
													<Show when={forecast.windDirection > 0}>
														<IoChevronUp
															class="mx-auto origin-center transform"
															size={24}
															style={{
																rotate: `${(forecast.windDirection + 180) % 360}deg`,
															}}></IoChevronUp>
													</Show>
													<span class="mx-auto text-base dark:text-white-darker">
														<Show when={forecast.windDirection > 0} fallback="Variable">
															{forecast.windDirection}°
														</Show>{' '}
														at {forecast.windSpeed} kt
													</span>
												</WeatherElementLayout>
											</Show>
										</div>
									</div>
								)}
							</For>
						</div>
						<Show when={forecasts().length > 1}>
							<div class="mt-4 flex w-full justify-center gap-3">
								<For each={forecasts()}>
									{(dot, index) => (
										<button
											role="button"
											class="h-2.5 w-2.5 rounded-full bg-gray-300 transition-all dark:bg-gray-700"
											aria-label={`Select forecast ${index() + 1}`}
											classList={{
												'bg-gray-500 dark:bg-gray-400': current() === index(),
												'hover:bg-gray-400 dark:hover:bg-gray-500': current() !== index(),
											}}
											disabled={current() === index()}
											onClick={() => moveTo(index())}></button>
									)}
								</For>
							</div>
						</Show>
					</div>
					<p aria-label="TAF" class="mx-auto w-full py-16 text-center font-mono text-xl dark:text-white-dark">
						{props.taf.rawText}
					</p>
				</>
			</Show>
		</div>
	)
}

export default ForecastElements
