import { Component, mergeProps, Show } from 'solid-js'

import { A } from '@solidjs/router'
import LogoSvg from '/src/icons/metargg-logo.svg?component'

interface LogoProps {
	class?: string
	showText?: boolean
}

const Logo: Component<LogoProps> = props => {
	props = mergeProps<[LogoProps, LogoProps]>({ showText: true }, props)

	return (
		<A href="/" class={`flex flex-row gap-4 ${props.class ?? ''}`} aria-label="metar.gg logo, links back to the home page">
			<LogoSvg class="w-12 flex-shrink-0 rounded-full bg-white text-primary dark:bg-transparent dark:text-white-light transition-colors"></LogoSvg>
			<Show when={props.showText}>
				<span class="my-auto font-display text-2xl text-primary dark:text-white-light transition-colors">metar.gg</span>
			</Show>
		</A>
	)
}

export default Logo
