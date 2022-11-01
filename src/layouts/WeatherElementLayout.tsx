import { Component, ParentComponent } from 'solid-js'

interface ParsedWeatherElementLayoutProps {
	name: string
	class?: string
}

const WeatherElementLayout: ParentComponent<ParsedWeatherElementLayoutProps> = props => {
	return (
		<div
			class={`flex h-auto w-auto flex-grow flex-col justify-center gap-2 rounded-2xl bg-gray-50 px-4 py-6 shadow-sm transition-colors dark:bg-black-200 md:mx-0 md:px-12 ${
				props.class ?? ''
			}`}>
			<label class="mx-auto text-xs font-semibold uppercase text-gray-600 dark:text-white-dark transition-colors">
				{props.name}
			</label>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout
