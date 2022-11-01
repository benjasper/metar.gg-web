import { Component, ParentComponent } from "solid-js"
import Footer from "../components/Footer"

interface PageLandingProps {
}

const PageLanding: ParentComponent<PageLandingProps> = (props) => {
	return (
		<div class="grid min-h-full grid-rows-layout bg-gray-light dark:bg-black">
			<div class="container flex flex-col min-h-screen">{props.children}</div>
			<Footer></Footer>
		</div>
	)
}

export default PageLanding
