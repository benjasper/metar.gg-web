import { Component, Show } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { AirportSearchFragment, MetarFragment } from '../../queries/generated/graphql'
import RunwayAndWindRenderer from '../special/RunwayAndWindRenderer'

interface WindElementProps {
	airport: AirportSearchFragment
	latestMetar: MetarFragment
}

export interface VariableWind {
	from: number
	to: number
}

const WindElement: Component<WindElementProps> = props => {
	const variableWind = (): VariableWind | undefined => {
		const result = props.latestMetar.rawText.match(/\d{3}V\d{3}/g)
		const vWindString = result ? result[0] : undefined

		if (vWindString === undefined) {
			return undefined
		}

		const fromTo = vWindString.split('V').map(v => parseInt(v))

		return {
			from: fromTo[0],
			to: fromTo[1],
		}
	}

	return (
		<WeatherElementLayout name="Wind" class="flex-shrink-0">
			<RunwayAndWindRenderer
				airport={props.airport}
				latestMetar={props.latestMetar}
				variableWind={variableWind()}></RunwayAndWindRenderer>
			<div class="flex flex-col text-center dark:text-white-dark">
				<Show when={props.latestMetar.windSpeed !== 0} fallback="Wind calm">
					<span class="text-lg">
						<Show when={props.latestMetar.windDirection !== 0} fallback="Variable">
							{props.latestMetar.windDirection}°
						</Show>{' '}
						at {props.latestMetar.windSpeed} kt
					</span>
					<Show when={variableWind()}>
						<span>
							variable from {variableWind().from}° to {variableWind().to}°
						</span>
					</Show>
					<Show when={props.latestMetar.windGust}>
						<span>with gusts up to {props.latestMetar.windGust} kt</span>
					</Show>
				</Show>
			</div>
		</WeatherElementLayout>
	)
}

export default WindElement
