import { BsArrowUp } from 'solid-icons/bs'
import { TbWindsock } from 'solid-icons/tb'
import { Component, createMemo, Show } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { AirportSearchFragment, MetarFragment } from '../../queries/generated/graphql'
import RunwayAndWindRenderer from '../special/RunwayAndWindRenderer'

interface WindElementProps {
	airport: AirportSearchFragment

	windDirection: MetarFragment['windDirection']
	windSpeed: MetarFragment['windSpeed']
	windGust: MetarFragment['windGust']
	variableWindDirection?: string

	size: 'large' | 'small'
}
export interface VariableWind {
	from: number
	to: number
}

const WindElement: Component<WindElementProps> = props => {
	const variableWind = createMemo((): VariableWind | undefined => {
		const result = props.variableWindDirection?.match(/\d{3}V\d{3}/g)
		const vWindString = result ? result[0] : undefined

		if (vWindString === undefined) {
			return undefined
		}

		const fromTo = vWindString.split('V').map(v => parseInt(v))

		return {
			from: fromTo[0],
			to: fromTo[1],
		}
	})

	return (
		<WeatherElementLayout name="Wind" class="flex-shrink-0" icon={<TbWindsock></TbWindsock>}>
			<Show when={props.size === 'large'}>
				<RunwayAndWindRenderer
					airport={props.airport}
					windDirection={props.windDirection}
					windSpeed={props.windSpeed}
					variableWind={variableWind()}></RunwayAndWindRenderer>
			</Show>
			<Show when={props.size === 'small'}>
				<Show when={props.windDirection > 0}>
					<BsArrowUp
						class="mx-auto origin-center transform"
						size={24}
						style={{
							rotate: `${(props.windDirection + 180) % 360}deg`,
						}}></BsArrowUp>
				</Show>
			</Show>
			<div class="flex flex-col text-center dark:text-white-dark">
				<span class="text-lg">
					<Show when={props.windSpeed !== 0} fallback="Wind calm">
						<Show when={props.windDirection !== 0} fallback="Variable">
							{props.windDirection}°
						</Show>{' '}
						at {props.windSpeed} kt
					</Show>
				</span>
				<Show when={variableWind()}>
					<span>
						variable from {variableWind()!.from}° to {variableWind()!.to}°
					</span>
				</Show>
				<Show when={props.windGust}>
					<span>with gusts up to {props.windGust} kt</span>
				</Show>
			</div>
		</WeatherElementLayout>
	)
}

export default WindElement
