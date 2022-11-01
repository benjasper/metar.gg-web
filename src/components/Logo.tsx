import { Component } from 'solid-js'

import LogoDay from '/src/icons/metargg-logo.svg?component'
import LogoNight from '/src/icons/metargg-logo-night.svg?component'
import { A } from '@solidjs/router'

interface LogoProps {
	class?: string
}

const Logo: Component<LogoProps> = (props) => {
	return (
		<A href='/' class={`flex flex-row gap-4 ${props.class ?? ''}`}>
			<LogoDay class="w-12 bg-white rounded-full text-primary flex-shrink-0"></LogoDay>
			<span class="text-primary dark:text-white-dark my-auto text-2xl font-display">metar.gg</span>
		</A>
	)
}

export default Logo
