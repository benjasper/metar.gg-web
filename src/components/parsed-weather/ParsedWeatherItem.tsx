import { Component } from "solid-js"

interface ParsedWeatherItemWrapperProps {
	class?: string
	children: any
}

const ParsedWeatherItem: Component<ParsedWeatherItemWrapperProps> = (props) => {
	return (
		<div class={`flex flex-col gap-2 justify-center rounded-2xl p-4 bg-gray-50 ${props.class ?? ''}`}>
			{props.children}
		</div>
	)
}

export default ParsedWeatherItem