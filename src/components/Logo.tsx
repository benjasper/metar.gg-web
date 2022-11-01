import { Component, mergeProps, Show } from 'solid-js'

import LogoDay from '/src/icons/metargg-logo.svg?component'
import LogoNight from '/src/icons/metargg-logo-night.svg?component'
import { A } from '@solidjs/router'

interface LogoProps {
	class?: string
	showText?: boolean
}

const Logo: Component<LogoProps> = props => {
	props = mergeProps<[LogoProps, LogoProps]>({ showText: true }, props)

	return (
		<A href="/" class={`flex flex-row gap-4 ${props.class ?? ''}`}>
			<LogoDay class="w-12 flex-shrink-0 rounded-full bg-white text-primary"></LogoDay>
			<Show when={props.showText}>
				<span class="my-auto font-display text-2xl text-primary dark:text-white-dark">metar.gg</span>
			</Show>
		</A>
	)
}

export default Logo
