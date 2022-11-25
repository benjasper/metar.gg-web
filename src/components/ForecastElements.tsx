import { Toggle } from 'solid-headless'
import { BsClockHistory } from 'solid-icons/bs'
import { HiOutlineSwitchHorizontal } from 'solid-icons/hi'
import { TbChevronLeft } from 'solid-icons/tb'
import { Component, createEffect, createMemo, createSignal, For, Show, useContext } from 'solid-js'
import { Slider, SliderContext, SliderProvider } from 'solid-slider'
import { useTimeStore } from '../context/TimeStore'
import Duration from '../models/duration'
import {
	AirportSearchFragment,
	ForecastChangeIndicator,
	ForecastFragment,
	TafFragment
} from '../queries/generated/graphql'
import { Tag } from './Tag'
import AltimeterElement from './weather-elements/AltimeterElement'
import { PrecipitationElement } from './weather-elements/PrecipitationElement'
import SkyConditionsElement from './weather-elements/SkyConditionsElement'
import VisibilityElement from './weather-elements/VisibilityElement'
import WindElement from './weather-elements/WindElement'
import WindShearElement from './weather-elements/WindShearElement'

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

interface DotsProps {
	items: any[]
}

const SliderNavigation: Component<DotsProps> = props => {
	const [helpers] = useContext(SliderContext)

	return (
		<Show when={props.items.length > 1}>
			<Show when={helpers().current() > 0}>
				<button
					onClick={() => helpers().prev()}
					role="button"
					class="absolute -bottom-6 left-0 hidden h-8 w-8 -translate-y-1/2 transform rounded-full bg-white text-black shadow-sm dark:bg-black-100 dark:text-white-dark md:flex">
					<TbChevronLeft class="m-auto" size={24} />
				</button>
			</Show>

			<div class="relative mx-auto mt-8 flex justify-center gap-3">
				<For each={props.items}>
					{(_, index) => (
						<button
							role="button"
							class="h-2.5 w-2.5 rounded-full bg-gray-300 transition-all dark:bg-gray-700"
							aria-label={`Select forecast ${index() + 1}`}
							classList={{
								'bg-gray-500 dark:bg-gray-400': helpers().current() === index(),
								'hover:bg-gray-400 dark:hover:bg-gray-500': helpers().current() !== index(),
							}}
							disabled={helpers().current() === index()}
							onClick={() => helpers().moveTo(index())}></button>
					)}
				</For>
			</div>

			<Show when={helpers().current() < props.items.length - 2}>
				<button
					onClick={() => helpers().next()}
					role="button"
					class="absolute -bottom-6 right-0 hidden h-8 w-8 -translate-y-1/2 transform rounded-full bg-white text-black shadow-sm dark:bg-black-100 dark:text-white-dark md:flex">
					<TbChevronLeft class="m-auto rotate-180" size={24} />
				</button>
			</Show>
		</Show>
	)
}

const ReloadSliderOnChange: Component<{ forecast: TafFragment }> = props => {
	const [helpers] = useContext(SliderContext)

	createEffect(() => {
		if (props.forecast.rawText && helpers().slider()) {
			helpers().slider().update()
		}
	})

	return undefined
}

const WheelControls = slider => {
	var touchTimeout
	var position
	var wheelActive

	function dispatch(e, name) {
		position.x -= e.deltaX
		position.y -= e.deltaY
		slider.container.dispatchEvent(
			new CustomEvent(name, {
				detail: {
					x: position.x,
					y: position.y,
				},
			})
		)
	}

	function wheelStart(e) {
		position = {
			x: e.pageX,
			y: e.pageY,
		}
		dispatch(e, 'ksDragStart')
	}

	function wheel(e) {
		dispatch(e, 'ksDrag')
	}

	function wheelEnd(e) {
		dispatch(e, 'ksDragEnd')
	}

	function eventWheel(e: WheelEvent) {
		if (e.deltaX !== 0) e.preventDefault()

		if (!wheelActive) {
			wheelStart(e)
			wheelActive = true
		}
		wheel(e)
		clearTimeout(touchTimeout)
		touchTimeout = setTimeout(() => {
			wheelActive = false
			wheelEnd(e)
		}, 50)
	}

	slider.on('created', () => {
		slider.container.addEventListener('wheel', eventWheel, {
			passive: false,
		})
	})
}

const changeIndicatorCodeToText = (changeIndicator: string): string => {
	switch (changeIndicator) {
		case 'BECMG':
			return 'Becoming'
		case 'TEMPO':
			return 'Temporarily'
		case 'PROB':
			return 'Probable'
		case 'FM':
			return 'From'
		default:
			return ''
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

	let omitNull = obj => {
		Object.keys(obj)
			.filter(k => obj[k] === null || (typeof obj[k][Symbol.iterator] === 'function' && obj[k].length === 0))
			.forEach(k => delete obj[k])
		return obj
	}

	const forecastsSorted = createMemo(() => {
		let forecasts: ForecastFragment[] = []

		forecasts = props.taf.forecast.map(forecast => forecast)

		forecasts = forecasts.sort((x, y) => {
			const xChangeIndicator = changeIndicatorToSortingIndex(x.changeIndicator ?? '')
			const yChangeIndicator = changeIndicatorToSortingIndex(y.changeIndicator ?? '')

			const xIndex = new Date(x.fromTime).getTime() + xChangeIndicator
			const yIndex = new Date(y.fromTime).getTime() + yChangeIndicator

			return xIndex - yIndex
		})

		// If it is a TEMPO we want to merge it with the previous forecast
		forecasts = forecasts.map((forecast, index) => {
			if (forecast.changeIndicator === 'TEMPO') {
				// Look for the first previous forecast that is not a TEMPO
				const previousForecast = forecasts
					.slice(0, index)
					.reverse()
					.find(f => f.changeIndicator !== 'TEMPO')

				if (previousForecast) {
					return {
						...previousForecast,
						...omitNull({ ...forecast }),
					}
				}
			}

			return forecast
		})

		return forecasts
	})

	const forecasts = createMemo(
		() => forecastsSorted().filter(x => new Date(x.toTime).getTime() > now().getTime()),
		[],
		{ equals: (x, y) => x.length === y.length }
	)

	const timeFormat: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: 'numeric',
	}

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
					<div class={`relative mt-6 flex max-w-full flex-col overflow-x-hidden md:overflow-x-visible`}>
						<Show
							when={forecasts().length > 0}
							fallback={
								<span class="mx-auto py-16 text-xl text-black dark:text-white-dark">
									No future forecasts available.
								</span>
							}>
							<SliderProvider>
								<ReloadSliderOnChange forecast={props.taf} />
								<Slider
									options={{
										slides: { perView: 1, spacing: 32 },
										breakpoints: {
											'(min-width: 500px)': {
												slides: { perView: 'auto', spacing: 32 },
											},
										},
										mode: 'snap',
									}}
									plugins={[WheelControls]}>
									<For each={forecasts()}>
										{forecast => (
											<div class="flex flex-col gap-2">
												<div class="flex flex-row flex-wrap gap-2">
													<div class="inline-block">
														<span class="text-left dark:text-white-dark">
															{new Date(forecast.fromTime).toLocaleString('default', {
																weekday: 'long',
																...timeFormat,
																timeZone: isLocalTime()
																	? props.airport.timezone
																	: browserTimezone,
															})}
														</span>
														<span class="text-left dark:text-white-dark">
															{' '}
															-{' '}
															{new Date(forecast.toTime).toLocaleString('default', {
																weekday:
																	new Date(forecast.fromTime).toLocaleDateString(
																		'default',
																		{
																			weekday: 'long',
																		}
																	) !==
																	new Date(forecast.toTime).toLocaleDateString(
																		'default',
																		{
																			weekday: 'long',
																		}
																	)
																		? 'long'
																		: undefined,
																...timeFormat,
																timeZone: isLocalTime()
																	? props.airport.timezone
																	: browserTimezone,
															})}
														</span>
													</div>
													<Show when={forecast.changeIndicator}>
														<Tag class="gap-1" title={`Change indicator: ${changeIndicatorCodeToText(forecast.changeIndicator)}`}>
															<Show
																when={
																	forecast.changeIndicator ===
																	ForecastChangeIndicator.Tempo
																}
																fallback={
																	<HiOutlineSwitchHorizontal class="my-auto" />
																}>
																<BsClockHistory class="my-auto" />
															</Show>
															<span>{forecast.changeIndicator}</span>
														</Tag>
													</Show>
													<Show when={forecast.changeProbability}>
														<Tag class="gap-1" title="Probability">
															<span>{forecast.changeProbability}%</span>
														</Tag>
													</Show>
												</div>
												<div class="flex w-full max-w-full flex-col flex-wrap gap-4 md:w-[30rem] md:flex-row">
													<Show when={forecast.visibilityHorizontal}>
														<VisibilityElement
															visibility={
																forecast.visibilityHorizontal
															}></VisibilityElement>
													</Show>
													<Show when={forecast.skyConditions.length > 0}>
														<SkyConditionsElement
															skyConditions={forecast.skyConditions}
															airport={props.airport}></SkyConditionsElement>
													</Show>
													<Show when={forecast.weather.length > 1}>
														<PrecipitationElement
															weather={forecast.weather}></PrecipitationElement>
													</Show>
													<Show when={forecast.altimeter && forecast.altimeter > 0}>
														<AltimeterElement
															altimeter={forecast.altimeter}></AltimeterElement>
													</Show>
													<Show when={forecast.windSpeed}>
														<WindElement
															airport={props.airport}
															windDirection={forecast.windDirection}
															windSpeed={forecast.windSpeed}
															windGust={forecast.windGust}
															size="small"
														/>
													</Show>
													<Show when={forecast.windShearSpeed}>
														<WindShearElement
															direction={forecast.windShearDirection}
															speed={forecast.windShearSpeed}
															height={forecast.windShearHeight}></WindShearElement>
													</Show>
												</div>
											</div>
										)}
									</For>
								</Slider>
								<SliderNavigation items={forecasts()}></SliderNavigation>
							</SliderProvider>
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
