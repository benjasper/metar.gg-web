import { A } from '@solidjs/router'
import { Component, ParentComponent, ParentProps } from 'solid-js'
import Logo from './Logo'
import { AiOutlineGithub } from 'solid-icons/ai'

const Footer: Component = () => {
	return (
		<footer>
			<div class="container flex flex-row items-center justify-center py-8 gap-8">
				<div class="flex flex-col items-center gap-2">
					<Logo showText={false}></Logo>
				</div>
			
				<div class="flex flex-col items-start gap-4 pl-8 border-l border-l-gray-400">
					<A href="/">About</A>
					<A href="/">Legal</A>
					<A href="/">Terms of Use</A>
					<A href="/" class='flex gap-2'><AiOutlineGithub class='my-auto' size={18} />GitHub</A>
				</div>
			</div>
		</footer>
	)
}

export default Footer
