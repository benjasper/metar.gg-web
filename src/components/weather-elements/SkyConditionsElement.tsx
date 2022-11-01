import { Component, For, Match, Show, Switch } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { MetarFragment, SkyConditionSkyCover } from '../../queries/generated/graphql'
import {
	RiWeatherCloudyFill,
	RiWeatherCloudyLine,
	RiWeatherSunCloudyFill,
	RiWeatherSunCloudyLine,
	RiWeatherSunFill,
} from 'solid-icons/ri'

interface SkyConditionsElementProps {
	metar: MetarFragment
}

const SkyConditionIcon = (props: { skyCover: SkyConditionSkyCover; class: string }) => {
	const classes = `h-auto ${props.class ?? ''}`

	return (
		<div class='text-gray-800'>
			<Switch>
			<Match when={props.skyCover === SkyConditionSkyCover.Few}>
				<RiWeatherSunCloudyLine class={classes} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Sct}>
				<RiWeatherSunCloudyFill class={classes} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Bkn}>
				<RiWeatherCloudyLine class={classes} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Ovc}>
				<RiWeatherCloudyFill class={classes} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Clr}>
				<RiWeatherSunFill class={classes} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Skc}>
				<RiWeatherSunFill class={classes} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Cavok}>
				<RiWeatherSunFill class={classes} />
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
			<Match when={true}>
				<span>{props.skyCover}</span>
			</Match>
		</Switch>
	)
}

const SkyConditionsElement: Component<SkyConditionsElementProps> = props => {
	return (
		<WeatherElementLayout name="Sky conditions">
			<div class="flex flex-col gap-2 text-center text-xl dark:text-white-dark">
				<Show when={props.metar.skyConditions.length > 1}>
					<For each={props.metar.skyConditions.sort((a, b) => b.cloudBase - a.cloudBase)}>
						{(condition, i) => (
							<div class="flex flex-row gap-1 mx-auto text-center">
								<SkyConditionIcon skyCover={condition.skyCover} class="w-5 my-auto" />
								<span class="my-auto text-base">
									<SkyConditionText skyCover={condition.skyCover}></SkyConditionText>
								</span>
								<Show when={condition.cloudBase}>
									<span class="my-auto text-base">at {Math.round(condition.cloudBase)} ft</span>
								</Show>
							</div>
						)}
					</For>
				</Show>
				<Show when={props.metar.skyConditions.length === 1}>
					<div class="mx-auto">
						<SkyConditionIcon skyCover={props.metar.skyConditions[0].skyCover} class="w-10" />
					</div>
					<span class="text-base">
						<SkyConditionText skyCover={props.metar.skyConditions[0].skyCover}></SkyConditionText>
						<Show when={props.metar.skyConditions[0].cloudBase}>
							&nbsp;at {Math.round(props.metar.skyConditions[0].cloudBase)} ft
						</Show>
					</span>
				</Show>
			</div>
		</WeatherElementLayout>
	)
}

export default SkyConditionsElement
