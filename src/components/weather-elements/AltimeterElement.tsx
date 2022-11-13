import { FaSolidGauge } from 'solid-icons/fa'
import { Component } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'

interface AltimeterElementProps {
	altimeter: number
}

const AltimeterElement: Component<AltimeterElementProps> = (props) => {
	return (
		<WeatherElementLayout name="Altimeter" icon={<FaSolidGauge class=""></FaSolidGauge>}>
			<p class="text-center text-xl dark:text-white-dark">{props.altimeter.toFixed(0)} hPa</p>
		</WeatherElementLayout>
	)
}

export default AltimeterElement
