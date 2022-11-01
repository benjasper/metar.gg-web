import { Component } from 'solid-js'
import Footer from '../components/Footer'

interface PageContentProps {
	children: any
}

const PageContent: Component<PageContentProps> = props => {
	return (
		<div class="grid min-h-full grid-rows-layout bg-gray-light dark:bg-black">
			<div class="container flex flex-col">{props.children}</div>
			<Footer></Footer>
		</div>
	)
}

export default PageContent
