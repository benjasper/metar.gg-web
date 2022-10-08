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
	return (
		<Switch>
			<Match when={props.skyCover === SkyConditionSkyCover.Few}>
				<RiWeatherSunCloudyLine class={`h-auto ${props.class}`} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Sct}>
				<RiWeatherSunCloudyFill class={`h-auto ${props.class}`} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Bkn}>
				<RiWeatherCloudyLine class={`h-auto ${props.class}`} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Ovc}>
				<RiWeatherCloudyFill class={`h-auto ${props.class}`} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Clr}>
				<RiWeatherSunFill class={`h-auto ${props.class}`} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Skc}>
				<RiWeatherSunFill class={`h-auto ${props.class}`} />
			</Match>
			<Match when={props.skyCover === SkyConditionSkyCover.Cavok}>
				<RiWeatherSunFill class={`h-auto ${props.class}`} />
			</Match>
			<Match when={true}>
				<span>{props.skyCover}</span>
			</Match>
		</Switch>
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
			<Match when={true}>
				<span>{props.skyCover}</span>
			</Match>
		</Switch>
	)
}

const SkyConditionsElement: Component<SkyConditionsElementProps> = props => {
	return (
		<WeatherElementLayout name="Sky conditions">
			<div class="flex flex-col gap-2 text-center text-xl">
				<Show when={props.metar.skyConditions.length > 1}>
					<For each={props.metar.skyConditions.sort((a, b) => b.cloudBase - a.cloudBase)}>
						{(condition, i) => (
							<div class="flex flex-row gap-1 mx-auto text-center">
								<SkyConditionIcon skyCover={condition.skyCover} class="w-5 my-auto" />
								<span class="my-auto text-base"><SkyConditionText skyCover={condition.skyCover}></SkyConditionText></span>
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
					<span class="text-sm"><SkyConditionText skyCover={props.metar.skyConditions[0].skyCover}></SkyConditionText></span>
				</Show>
			</div>
		</WeatherElementLayout>
	)
}

export default SkyConditionsElement
