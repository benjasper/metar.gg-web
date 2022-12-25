import { Component } from 'solid-js'
import DarkModeToggle from './DarkModeToggle'
import Logo from './Logo'

const Header: Component = () => {
	return (
		<header class="flex flex-col justify-between gap-6 md:flex-row">
			<Logo class="mx-auto md:mx-0 md:w-1/4"></Logo>
			<DarkModeToggle class='hidden md:flex'></DarkModeToggle>
		</header>
	)
}

export default Header
