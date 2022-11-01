import { Component } from "solid-js"
import Footer from "../components/Footer"

interface PageLandingProps {
	children: any
}

const PageLanding: Component<PageLandingProps> = (props) => {
	return (
		<div class="grid min-h-full grid-rows-layout bg-gray-light dark:bg-black">
			<div class="container flex flex-col">{props.children}</div>
			<Footer></Footer>
		</div>
	)
}

export default PageLanding
