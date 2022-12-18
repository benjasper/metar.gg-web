import { FaSolidGauge } from 'solid-icons/fa'
import { Component } from 'solid-js'
import { useUnitStore } from '../../context/UnitStore'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'

interface AltimeterElementProps {
	altimeter: number
}

const AltimeterElement: Component<AltimeterElementProps> = (props) => {
	const [unitStore] = useUnitStore()
	
	const selected = () => unitStore.pressure.units[unitStore.pressure.selected]
	const altimeter = () => selected().conversionFunction(props.altimeter).toFixed(selected().symbol === 'inHg' ? 2 : 0)

	return (
		<WeatherElementLayout name="Altimeter" icon={<FaSolidGauge></FaSolidGauge>} unitType={'pressure'}>
			<p class="text-center text-xl dark:text-white-dark">{altimeter} {selected().symbol}</p>
		</WeatherElementLayout>
	)
}

export default AltimeterElement
