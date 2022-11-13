import { IoChevronUp } from 'solid-icons/io'
import { RiWeatherWindyLine } from 'solid-icons/ri'
import { Component, createEffect, createMemo, For, Show } from 'solid-js'
import { createSlider, SliderProvider } from 'solid-slider'
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

	const bulletinTime = () => new Date(props.taf.bulletinTime)
	const bulletinTimeDuration = (): Duration => Duration.fromDates(bulletinTime(), now())

	const validFrom = createMemo(() => new Date(props.taf.validFromTime))
	const validTo = createMemo(() => new Date(props.taf.validToTime))

	const isValid = () => validFrom().getTime() <= now().getTime() && validTo().getTime() >= now().getTime()

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

	// Rerun the slider when it's items change
	createEffect(() => {
		if (props.airport.icaoCode || props.taf.rawText) {
			sliderInstance() && sliderInstance().update()
			moveTo(0)
		}
	})

	const timeFormat: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: 'numeric',
	}

	return (
		<div class="flex flex-col justify-between md:flex-row">
			<Show when={props.taf} fallback="No forecast available.">
				<div class="flex max-w-full flex-col">
					<h3 class="text-2xl dark:text-white-dark">Current forecast</h3>
					<div class="flex flex-row flex-wrap justify-start gap-2 pt-2">
						<Tag
							class="text-white dark:text-white-light"
							classList={{
								'bg-green-600 dark:bg-green-800': bulletinTimeDuration().asHours() <= 24,
								'bg-red-600 dark:bg-red-800': bulletinTimeDuration().asHours() > 24,
							}}
							title={bulletinTime().toLocaleTimeString([], {
								hour: 'numeric',
								minute: '2-digit',
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}>
							Bulletin time {bulletinTimeDuration().humanImprecise()}
						</Tag>
						<Tag
							class="text-white dark:text-white-light"
							classList={{
								'bg-green-600 dark:bg-green-800': isValid(),
								'bg-red-600 dark:bg-red-800': !isValid(),
							}}>
							Valid from {validFrom().toLocaleDateString([], { hour: 'numeric', minute: '2-digit' })} to{' '}
							{validTo().toLocaleDateString([], { hour: 'numeric', minute: '2-digit' })}
						</Tag>
					</div>
					<div class={`mt-4 max-w-full overflow-x-hidden md:overflow-x-visible`}>
						<SliderProvider>
							<div use:slider>
								<For each={forecasts()}>
									{forecast => (
										<div class="flex w-full flex-grow flex-col gap-2">
											<span class="text-left dark:text-white-dark">
												{new Date(forecast.fromTime).toLocaleDateString('default', {
													weekday: 'long',
												})}
												{' • '}
												{new Date(forecast.fromTime).toLocaleTimeString(
													'default',
													timeFormat
												)}{' '}
												- {new Date(forecast.toTime).toLocaleTimeString('default', timeFormat)}
											</span>
											<Show when={forecast.changeIndicator}>
												<WeatherElementLayout name="Change indicator" class="mb-2 !flex-grow-0">
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
													<PrecipitationElement
														weather={forecast.weather}></PrecipitationElement>
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
																	rotate: `${
																		(forecast.windDirection + 180) % 360
																	}deg`,
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
							<div class="mt-4 flex justify-center gap-3">
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
						</SliderProvider>
					</div>
					<p aria-label="TAF" class="py-16 text-center font-mono text-xl dark:text-white-dark">
						{props.taf.rawText}
					</p>
				</div>
			</Show>
		</div>
	)
}

export default ForecastElements
