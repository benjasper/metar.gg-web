import { Component, Show } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { AirportSearchFragment, MetarFragment } from '../../queries/generated/graphql'
import RunwayAndWindRenderer from '../special/RunwayAndWindRenderer'

interface WindElementProps {
	airport: AirportSearchFragment
	latestMetar: MetarFragment
}

const WindElement: Component<WindElementProps> = (props) => {
	return (
		<WeatherElementLayout name="Wind" class="flex-shrink-0">
			<RunwayAndWindRenderer airport={props.airport} latestMetar={props.latestMetar}></RunwayAndWindRenderer>
			<div class="flex flex-col text-center">
				<Show when={props.latestMetar.windSpeed !== 0} fallback="Wind calm">
					<span class='dark:text-white-dark'>
						<Show when={props.latestMetar.windDirection !== 0} fallback="Variable">
							{props.latestMetar.windDirection}°
						</Show>{' '}
						at {props.latestMetar.windSpeed}kt
					</span>
					<Show when={props.latestMetar.windGust}>with gusts up to {props.latestMetar.windGust}kt</Show>
				</Show>
			</div>
		</WeatherElementLayout>
	)
}

export default WindElement
