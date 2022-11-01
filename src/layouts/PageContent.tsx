import { Component, ParentComponent } from 'solid-js'
import Footer from '../components/Footer'

interface PageContentProps {
}

const PageContent: ParentComponent<PageContentProps> = props => {
	return (
		<div class="grid min-h-full grid-rows-layout bg-gray-light dark:bg-black transition-colors">
			<div class="container flex flex-col min-h-screen transition-colors">{props.children}</div>
			<Footer></Footer>
		</div>
	)
}

export default PageContent
