import { RiMapPinDistanceFill } from 'solid-icons/ri'
import { Component, Show } from 'solid-js'
import { useUnitStore } from '../../context/UnitStore'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { MetarFragment } from '../../queries/generated/graphql'

interface VisibilityElementProps {
	visibility: MetarFragment['visibility']
}

const VisibilityElement: Component<VisibilityElementProps> = props => {
	const [unitStore] = useUnitStore()

	const selected = () => unitStore.length.units[unitStore.length.selected]
	const visibility = () => selected().conversionFunction(props.visibility)

	return (
		<WeatherElementLayout name="Visibility" icon={<RiMapPinDistanceFill />} unitType={[{ unitType: 'length' }]}>
			<p class="text-center text-xl dark:text-white-dark">
				<Show when={visibility() === 9.99402624}>&ge;&nbsp;</Show>
				{visibility().toFixed(1)} {selected().symbol}
			</p>
		</WeatherElementLayout>
	)
}

export default VisibilityElement
