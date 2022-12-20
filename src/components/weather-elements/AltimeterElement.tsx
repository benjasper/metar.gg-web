import { FaSolidGauge } from 'solid-icons/fa'
import { Component } from 'solid-js'
import { useUnitStore } from '../../context/UnitStore'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { PressureUnit } from '../../models/units'

interface AltimeterElementProps {
	altimeter: number
}

const AltimeterElement: Component<AltimeterElementProps> = (props) => {
	const [unitStore] = useUnitStore()
	
	const selected = () => unitStore.pressure.units[unitStore.pressure.selected]
	const altimeter = () => selected().symbol === PressureUnit.InchesOfMercury ? (Math.round((selected().conversionFunction(props.altimeter) + Number.EPSILON) * 100) / 100).toFixed(2) : Math.round(selected().conversionFunction(props.altimeter))

	return (
		<WeatherElementLayout name="Altimeter" icon={<FaSolidGauge></FaSolidGauge>} unitType={'pressure'}>
			<p class="text-center text-xl dark:text-white-dark">{altimeter} {selected().symbol}</p>
		</WeatherElementLayout>
	)
}

export default AltimeterElement
