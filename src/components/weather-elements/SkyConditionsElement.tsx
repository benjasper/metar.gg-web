import { IoCloudy } from 'solid-icons/io'
import {
	RiWeatherCloudyFill,
	RiWeatherCloudyLine,
	RiWeatherMoonClearFill,
	RiWeatherMoonCloudyFill,
	RiWeatherMoonCloudyLine,
	RiWeatherSunCloudyFill,
	RiWeatherSunCloudyLine,
	RiWeatherSunFill
} from 'solid-icons/ri'
import { Component, createMemo, For, Match, Show, Switch } from 'solid-js'
import { useUnitStore } from '../../context/UnitStore'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { AirportSearchFragment, SkyConditionFragment, SkyConditionSkyCover } from '../../queries/generated/graphql'

const SkyConditionIcon = (props: { skyCover: SkyConditionSkyCover; class: string; isDayTime: boolean }) => {
	const classes = `h-auto ${props.class ?? ''}`

	return (
		<div class="text-gray-600 dark:text-white-light">
			<Switch>
				<Match when={props.skyCover === SkyConditionSkyCover.Few}>
					<Show when={props.isDayTime} fallback={<RiWeatherMoonCloudyLine class={classes} />}>
						<RiWeatherSunCloudyLine class={classes} />
					</Show>
				</Match>
				<Match when={props.skyCover === SkyConditionSkyCover.Sct}>
					<Show when={props.isDayTime} fallback={<RiWeatherMoonCloudyFill class={classes} />}>
						<RiWeatherSunCloudyFill class={classes} />
					</Show>
				</Match>
				<Match when={props.skyCover === SkyConditionSkyCover.Bkn}>
					<RiWeatherCloudyLine class={classes} />
				</Match>
				<Match when={props.skyCover === SkyConditionSkyCover.Ovc}>
					<RiWeatherCloudyFill class={classes} />
				</Match>
				<Match when={props.skyCover === SkyConditionSkyCover.Clr}>
					<Show when={props.isDayTime} fallback={<RiWeatherMoonClearFill class={classes} />}>
						<RiWeatherSunFill class={classes} />
					</Show>
				</Match>
				<Match when={props.skyCover === SkyConditionSkyCover.Skc}>
					<Show when={props.isDayTime} fallback={<RiWeatherMoonClearFill class={classes} />}>
						<RiWeatherSunFill class={classes} />
					</Show>
				</Match>
				<Match when={props.skyCover === SkyConditionSkyCover.Cavok}>
					<Show when={props.isDayTime} fallback={<RiWeatherMoonClearFill class={classes} />}>
						<RiWeatherSunFill class={classes} />
					</Show>
				</Match>
				<Match when={props.skyCover === SkyConditionSkyCover.Nsc}>
					<Show when={props.isDayTime} fallback={<RiWeatherMoonClearFill class={classes} />}>
						<RiWeatherSunFill class={classes} />
					</Show>
				</Match>
				<Match when={true}>
					<span>{props.skyCover}</span>
				</Match>
			</Switch>
		</div>
	)
}

const SkyConditionText = (props: { skyCover: SkyConditionSkyCover }) => {
	return (
		<Switch>
			<Match when={props.skyCover === SkyConditionSkyCover.Few}>Few</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Sct}>Scattered</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Bkn}>Broken</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Ovc}>Overcast</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Clr}>Clear</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Skc}>Sky Clear</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Cavok}>Ceiling and Visibility OK</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Ovx}>Sky Obscured</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Nsc}>No Significant Clouds</Match>
			<Match when={true}>
				<span>{props.skyCover}</span>
			</Match>
		</Switch>
	)
}

interface SkyConditionsElementProps {
	skyConditions: SkyConditionFragment[]
	airport: AirportSearchFragment
}

const SkyConditionsElement: Component<SkyConditionsElementProps> = props => {
	const [unitStore] = useUnitStore()

	const selected = createMemo(() => unitStore.height.units[unitStore.height.selected])
	const convert = (value: number) => selected().conversionFunction(value)

	const hasCloudBase = () => props.skyConditions.some(x => x.cloudBase !== null)

	const sortedSkyConditions = createMemo(() =>
		props.skyConditions.map(x => x).sort((a, b) => (b.cloudBase ?? 0) - (a.cloudBase ?? 0))
	)

	const localHour = createMemo(() =>
		parseInt(
			new Date()
				.toLocaleTimeString('en', { hour: '2-digit', hourCycle: 'h24', timeZone: props.airport.timezone ?? '' })
				.substring(0, 2)
		)
	)

	const isDayTime = () => localHour() >= 6 && localHour() <= 18

	return (
		<WeatherElementLayout name="Sky conditions" icon={<IoCloudy></IoCloudy>} unitType={hasCloudBase() ? 'height' : undefined}>
			<div class="flex flex-col gap-2 text-center text-xl dark:text-white-dark">
				<Show when={props.skyConditions.length > 1}>
					<For each={sortedSkyConditions()}>
						{(condition, i) => (
							<div class="mx-auto flex whitespace-nowrap flex-row gap-1 text-center">
								<SkyConditionIcon
									skyCover={condition.skyCover}
									class="my-auto w-5"
									isDayTime={isDayTime()}
								/>
								<span class="my-auto text-base">
									<SkyConditionText skyCover={condition.skyCover}></SkyConditionText>
								</span>
								<Show when={condition.cloudBase}>
									<span class="my-auto text-base">at {Math.round(convert(condition.cloudBase!)) > 1 ? Math.round(convert(condition.cloudBase!)) : convert(condition.cloudBase!).toFixed(1)} {selected().symbol}</span>
								</Show>
							</div>
						)}
					</For>
				</Show>
				<Show when={props.skyConditions.length === 1}>
					<div class="mx-auto">
						<SkyConditionIcon
							skyCover={props.skyConditions[0].skyCover}
							isDayTime={isDayTime()}
							class="w-10"
						/>
					</div>
					<span class="text-base">
						<SkyConditionText skyCover={props.skyConditions[0].skyCover}></SkyConditionText>
						<Show when={props.skyConditions[0].cloudBase}>
							&nbsp;at {Math.round(convert(props.skyConditions[0].cloudBase!)) > 1 ? Math.round(convert(props.skyConditions[0].cloudBase!)) : convert(props.skyConditions[0].cloudBase!).toFixed(1)} {selected().symbol}
						</Show>
					</span>
				</Show>
			</div>
		</WeatherElementLayout>
	)
}

export default SkyConditionsElement
