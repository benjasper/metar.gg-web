import { Component } from "solid-js"

interface ParsedWeatherItemWrapperProps {
	class?: string
	children: any
}

const ParsedWeatherItem: Component<ParsedWeatherItemWrapperProps> = (props) => {
	return (
		<div class={`h-auto w-auto flex-grow flex flex-col md:mx-0 gap-2 justify-center rounded-2xl px-12 py-6 bg-gray-50 ${props.class ?? ''}`}>
			{props.children}
		</div>
	)
}

export default ParsedWeatherItem