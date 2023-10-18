import { RiMapPinDistanceFill } from 'solid-icons/ri'
import { Component, Match, Switch, createEffect } from 'solid-js'
import { useUnitStore } from '../../context/UnitStore'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { MetarFragment } from '../../queries/generated/graphql'

interface VisibilityElementProps {
	visibility: MetarFragment['visibility']
	visibilityMoreThan: boolean
}

const VisibilityElement: Component<VisibilityElementProps> = props => {
	const [unitStore] = useUnitStore()

	const selected = () => unitStore.length.units[unitStore.length.selected]
	const visibility = () => selected().conversionFunction(props.visibility!)

	return (
		<WeatherElementLayout name="Visibility" icon={<RiMapPinDistanceFill />} unitType={[{ unitType: 'length' }]}>
			<p class="text-center text-xl dark:text-white-dark">
				<Switch>
					<Match when={props.visibilityMoreThan}>
						&ge; {Math.round(visibility())} {selected().symbol}
					</Match>
					<Match when={true}>
						{visibility().toFixed(1)} {selected().symbol}
					</Match>
				</Switch>
			</p>
		</WeatherElementLayout>
	)
}

export default VisibilityElement
