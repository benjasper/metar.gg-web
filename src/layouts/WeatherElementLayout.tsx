import { JSX, ParentComponent, Show } from 'solid-js'

interface ParsedWeatherElementLayoutProps {
	name: string
	class?: string
	icon?: JSX.Element
}

const WeatherElementLayout: ParentComponent<ParsedWeatherElementLayoutProps> = props => {
	return (
		<div
			class={`flex h-auto w-auto flex-grow flex-col justify-center gap-2 rounded-2xl bg-gray-50 px-4 py-6 text-black shadow-sm transition-colors dark:bg-black-200 dark:text-white-light md:mx-0 md:px-12 ${
				props.class ?? ''
			}`}>
			<label class="mx-auto flex gap-1 text-xs font-semibold uppercase text-gray-500 transition-colors dark:text-white-darker">
				<Show when={props.icon}>
					<div class="my-auto">{props.icon}</div>
				</Show>
				<span class="my-auto">{props.name}</span>
			</label>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout
