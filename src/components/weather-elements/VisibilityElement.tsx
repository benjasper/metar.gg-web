import { RiMapPinDistanceFill } from 'solid-icons/ri'
import { Component, Show } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { MetarFragment } from '../../queries/generated/graphql'

interface VisibilityElementProps {
	visibility: MetarFragment['visibility']
}

const VisibilityElement: Component<VisibilityElementProps> = props => {
	return (
		<WeatherElementLayout name="Visibility" icon={<RiMapPinDistanceFill></RiMapPinDistanceFill>}>
			<p class="text-center text-xl dark:text-white-dark">
				<Show when={props.visibility > 1} fallback={`${Math.round(props.visibility * 1000)} m`}>
					<Show when={Math.round(props.visibility) === 10 || props.visibility.toFixed(1) === '16.1'}>
						&ge;&nbsp;
					</Show>
					{props.visibility.toFixed(1)} km
				</Show>
			</p>
		</WeatherElementLayout>
	)
}

export default VisibilityElement
