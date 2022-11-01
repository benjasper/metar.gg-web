import { Component, ParentComponent } from "solid-js"

interface ParsedWeatherElementLayoutProps {
	name: string
	class?: string
}

const WeatherElementLayout: ParentComponent<ParsedWeatherElementLayoutProps> = (props) => {
	return (
		<div class={`h-auto w-auto flex-grow flex flex-col md:mx-0 gap-2 justify-center rounded-2xl px-4 md:px-12 py-6 bg-gray-50 dark:bg-black-200 shadow-sm ${props.class ?? ''}`}>
			<label class="mx-auto uppercase text-xs font-semibold text-gray-600 dark:text-white-dark">{props.name}</label>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout