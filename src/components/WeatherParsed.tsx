import RunwayLayout from "./RunwayLayout"

const WeatherParsed = () => {
	return (
		<div class="flex flex-row gap-2">
			<div class="flex flex-col gap-1">
				<h3>Wind</h3>
				<RunwayLayout></RunwayLayout>
			</div>
		</div>
	)
}

export default WeatherParsed
