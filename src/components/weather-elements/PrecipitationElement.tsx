import { Component, createEffect, For, Match, Show, Switch } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { MetarFragment } from '../../queries/generated/graphql'
import {
	RiWeatherDrizzleLine,
	RiWeatherFoggyLine,
	RiWeatherHailLine,
	RiWeatherHazeLine,
	RiWeatherMistLine,
	RiWeatherShowersLine,
	RiWeatherSnowyLine,
	RiWeatherThunderstormsLine,
	RiWeatherTornadoLine,
	RiWeatherWindyLine,
} from 'solid-icons/ri'

interface PrecipitationElementProps {
	latestMetar: MetarFragment
}

enum IntensityOrProximity {
	Light = '-',
	Heavy = '+',
	Nearby = 'VC',
	Recent = 'RE',
}

enum Descriptor {
	Shallow = 'MI',
	Partial = 'PR',
	Patches = 'BC',
	Blowing = 'BL',
	LowDrifting = 'DR',
	Showers = 'SH',
	Thunderstorm = 'TS',
	Freezing = 'FZ',
}

enum PrecipitationType {
	Drizzle = 'DZ',
	Rain = 'RA',
	Snow = 'SN',
	Hail = 'GR',
	SmallHail = 'GS',
	IcePellets = 'PL',
	IceCrystals = 'IC',
	UnknownPrecipitation = 'UP',
}

enum Obscuration {
	Mist = 'BR',
	Fog = 'FG',
	Smoke = 'FU',
	VolcanicAsh = 'VA',
	Dust = 'DU',
	Sand = 'SA',
	Haze = 'HZ',
}

enum Other {
	DustWhirls = 'PO',
	Duststorm = 'DS',
	Sandstorm = 'SS',
	Squalls = 'SQ',
	SandOrDustWhirls = 'FC',
	Tornado = '+FC',
	FunnelCloud = 'FC',
}

const ConditionElement = (props: { condition: string }) => {
	const intensityOrProximity = (): IntensityOrProximity | undefined =>
		Object.values(IntensityOrProximity).find(key => props.condition.startsWith(key))

	const descriptor = (): Descriptor | undefined =>
		Object.values(Descriptor).find(key => props.condition.includes(key))

	const precipitationType = (): PrecipitationType =>
		Object.values(PrecipitationType).find(key => props.condition.includes(key))

	const obscuration = (): Obscuration | undefined =>
		Object.values(Obscuration).find(key => props.condition.includes(key))

	const other = (): Other | undefined => Object.values(Other).find(key => props.condition.includes(key))

	return (
		<div class="flex flex-row gap-1 justify-center text-xl">
			<div class='text-gray-800 dark:text-white-dark'>
				<Switch>
					<Match when={precipitationType() === PrecipitationType.Drizzle}>
						<RiWeatherDrizzleLine size={24} />
					</Match>
					<Match when={descriptor() === Descriptor.Showers || precipitationType() === PrecipitationType.Rain}>
						<RiWeatherShowersLine size={24} />
					</Match>
					<Match when={descriptor() === Descriptor.Thunderstorm}>
						<RiWeatherThunderstormsLine size={24} />
					</Match>
					<Match when={precipitationType() === PrecipitationType.Snow}>
						<RiWeatherSnowyLine size={24} />
					</Match>
					<Match
						when={
							precipitationType() === PrecipitationType.Hail ||
							precipitationType() === PrecipitationType.SmallHail
						}>
						<RiWeatherHailLine size={24} />
					</Match>
					<Match when={obscuration() === Obscuration.Fog}>
						<RiWeatherFoggyLine size={24} />
					</Match>
					<Match when={obscuration() === Obscuration.Mist}>
						<RiWeatherMistLine size={24} />
					</Match>
					<Match when={obscuration() === Obscuration.Haze}>
						<RiWeatherHazeLine size={24} />
					</Match>
					<Match
						when={
							other() === Other.Duststorm ||
							other() === Other.Sandstorm ||
							other() === Other.Squalls ||
							other() === Other.SandOrDustWhirls ||
							other() === Other.DustWhirls
						}>
						<RiWeatherWindyLine size={24} />
					</Match>
					<Match when={other() === Other.Tornado || other() === Other.FunnelCloud}>
						<RiWeatherTornadoLine size={24} />
					</Match>
				</Switch>
			</div>

			{/* Intensity or Proximity */}
			<Show when={intensityOrProximity()}>
				<span>
					<Switch fallback="">
						<Match when={intensityOrProximity() === IntensityOrProximity.Light}>Light</Match>
						<Match when={intensityOrProximity() === IntensityOrProximity.Heavy}>Heavy</Match>
						<Match when={intensityOrProximity() === IntensityOrProximity.Nearby}>Nearby</Match>
						<Match when={intensityOrProximity() === IntensityOrProximity.Recent}>Recent</Match>
					</Switch>
				</span>
			</Show>

			{/* Descriptor */}
			<Show when={descriptor()}>
				<span>
					<Switch fallback="">
						<Match when={descriptor() === Descriptor.Shallow}>Shallow</Match>
						<Match when={descriptor() === Descriptor.Partial}>Partial</Match>
						<Match when={descriptor() === Descriptor.Patches}>Patches</Match>
						<Match when={descriptor() === Descriptor.Blowing}>Blowing</Match>
						<Match when={descriptor() === Descriptor.LowDrifting}>Low drifting</Match>
						<Match when={descriptor() === Descriptor.Showers}>Showers</Match>
						<Match when={descriptor() === Descriptor.Thunderstorm}>Thunderstorm</Match>
						<Match when={descriptor() === Descriptor.Freezing}>Freezing</Match>
					</Switch>
				</span>
			</Show>

			{/* Precipitation Type */}
			<Show when={precipitationType()}>
				<span>
					<Switch fallback="">
						<Match when={precipitationType() === PrecipitationType.Drizzle}>Drizzle</Match>
						<Match when={precipitationType() === PrecipitationType.Rain}>Rain</Match>
						<Match when={precipitationType() === PrecipitationType.Snow}>Snow</Match>
						<Match when={precipitationType() === PrecipitationType.Hail}>Hail</Match>
						<Match when={precipitationType() === PrecipitationType.SmallHail}>Small hail</Match>
						<Match when={precipitationType() === PrecipitationType.IcePellets}>Ice pellets</Match>
						<Match when={precipitationType() === PrecipitationType.IceCrystals}>Ice crystals</Match>
						<Match when={precipitationType() === PrecipitationType.UnknownPrecipitation}>
							Unknown Precipitation
						</Match>
					</Switch>
				</span>
			</Show>

			{/* Obscuration */}
			<Show when={obscuration()}>
				<span>
					<Switch fallback="">
						<Match when={obscuration() === Obscuration.Mist}>Mist</Match>
						<Match when={obscuration() === Obscuration.Fog}>Fog</Match>
						<Match when={obscuration() === Obscuration.Smoke}>Smoke</Match>
						<Match when={obscuration() === Obscuration.VolcanicAsh}>Volcanic ash</Match>
						<Match when={obscuration() === Obscuration.Dust}>Dust</Match>
						<Match when={obscuration() === Obscuration.Sand}>Sand</Match>
						<Match when={obscuration() === Obscuration.Haze}>Haze</Match>
					</Switch>
				</span>
			</Show>

			{/* Other */}
			<Show when={other()}>
				<span>
					<Switch fallback="">
						<Match when={other() === Other.DustWhirls}>Dust Whirls</Match>
						<Match when={other() === Other.Duststorm}>Duststorm</Match>
						<Match when={other() === Other.Sandstorm}>Sandstorm</Match>
						<Match when={other() === Other.Squalls}>Squalls</Match>
						<Match when={other() === Other.SandOrDustWhirls}>Sand or dust whirls</Match>
						<Match when={other() === Other.Tornado}>Tornado</Match>
						<Match when={other() === Other.FunnelCloud}>Funnel cloud</Match>
					</Switch>
				</span>
			</Show>
		</div>
	)
}

const PrecipitationElement: Component<PrecipitationElementProps> = props => {
	const conditions = () => props.latestMetar.presentWeather.split(' ')

	return (
		<WeatherElementLayout name="Precipitation">
			<div class="flex flex-col gap-1 dark:text-white-dark">
				<For each={conditions()}>{condition => <ConditionElement condition={condition} />}</For>
			</div>
			<span class="mx-auto dark:text-white-dark">{props.latestMetar.presentWeather}</span>
		</WeatherElementLayout>
	)
}

export default PrecipitationElement
