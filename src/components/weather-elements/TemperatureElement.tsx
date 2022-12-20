import { TbTemperature } from 'solid-icons/tb'
import { Component } from 'solid-js'
import { useUnitStore } from '../../context/UnitStore'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'

interface TemperatureElementProps {
	name: string
	temperature: number
}

const TemperatureElement: Component<TemperatureElementProps> = props => {
	const [unitStore] = useUnitStore()

	const selected = () => unitStore.temperature.units[unitStore.temperature.selected]
	const temperature = () => Math.round(selected().conversionFunction(props.temperature))

	return (
		<WeatherElementLayout name={props.name} icon={<TbTemperature></TbTemperature>} unitType={'temperature'}>
			<p class="text-center text-xl dark:text-white-dark">{temperature} {selected().symbol}</p>
		</WeatherElementLayout>
	)
}

export default TemperatureElement
