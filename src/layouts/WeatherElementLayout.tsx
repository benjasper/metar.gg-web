import { Component } from "solid-js"

interface ParsedWeatherElementLayoutProps {
	name: string
	class?: string
	children: any
}

const WeatherElementLayout: Component<ParsedWeatherElementLayoutProps> = (props) => {
	return (
		<div class={`h-auto w-auto flex-grow flex flex-col md:mx-0 gap-2 justify-center rounded-2xl px-12 py-6 bg-gray-50 ${props.class ?? ''}`}>
			<label class="mx-auto uppercase text-xs font-semibold text-gray-600">{props.name}</label>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout