import RunwayRenderer from "./RunwayRenderer"
import RunwayLayout from "./RunwayRenderer"

const WeatherParsed = () => {
	return (
		<div class="flex flex-col md:flex-row gap-2">
			<div class="flex flex-col gap-1">
				<h3>Wind</h3>
				<RunwayRenderer></RunwayRenderer>
			</div>
		</div>
	)
}

export default WeatherParsed
