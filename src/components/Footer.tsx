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

				<div class="flex flex-col items-start gap-4 border-l-gray-400 md:pl-8 dark:text-white-light md:flex-row md:border-l">
					<A class="mx-auto" href="/about">About</A>
					<A class="mx-auto" href="https://github.com/benjasper/metar.gg-web/blob/main/LICENSE">License</A>
					<A class="mx-auto" href="/legal">Legal</A>
					<A class="mx-auto" href="/terms">Terms of Use</A>
				</div>

				<div class="flex flex-col items-start gap-4 border-l-gray-400 md:pl-8 dark:text-white-light md:flex-row md:border-l">
					<A href="https://github.com/benjasper/metar.gg-web" class="flex gap-2 mx-auto" >
						<AiOutlineGithub class="my-auto" size={18} />
						GitHub
					</A>
				</div>
			</div>
			<div class="flex flex-row items-start gap-4 mx-auto pt-4 md:pt-0">
				<DarkModeToggle></DarkModeToggle>
			</div>
		</footer>
	)
}

export default Footer
