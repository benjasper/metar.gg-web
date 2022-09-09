import { Airport, AirportSearchFragment } from '../generated/graphql'
import RunwayRenderer from './RunwayRenderer'
import RunwayLayout from './RunwayRenderer'

const WeatherParsed = (props: { airport: AirportSearchFragment }) => {
	return (
		<div class="flex flex-col md:flex-row gap-2">
			<div class="flex flex-col gap-1">
				<h3>Wind</h3>
				<RunwayRenderer airport={props.airport}></RunwayRenderer>
			</div>
		</div>
	)
}

export default WeatherParsed
