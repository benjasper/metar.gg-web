import { A } from '@solidjs/router'
import { Component, ParentComponent, ParentProps } from 'solid-js'
import Logo from './Logo'
import { AiOutlineGithub } from 'solid-icons/ai'
import DarkModeToggle from './DarkModeToggle'

const Footer: Component = () => {
	return (
		<footer class='flex flex-col py-8 gap-4'>
			<div class="container flex flex-col items-center justify-center gap-8 md:flex-row">
				<div class="flex flex-col items-center gap-2">
					<Logo showText={false}></Logo>
				</div>

				<div class="flex flex-col items-start gap-4 border-l-gray-400 pl-8 dark:text-white-light md:flex-row md:border-l">
					<A href="/">About</A>
					<A href="/">Legal</A>
					<A href="/">Terms of Use</A>
				</div>

				<div class="flex flex-col items-start gap-4 border-l-gray-400 pl-8 dark:text-white-light md:flex-row md:border-l">
					<A href="/" class="flex gap-2">
						<AiOutlineGithub class="my-auto" size={18} />
						GitHub
					</A>
				</div>
			</div>
			<div class="flex flex-row items-start gap-4 mx-auto">
				<DarkModeToggle></DarkModeToggle>
			</div>
		</footer>
	)
}

export default Footer
