import { Component, ParentComponent } from 'solid-js'
import Footer from '../components/Footer'

interface PageContentProps {}

const PageContent: ParentComponent<PageContentProps> = props => {
	return (
		<div class="grid min-h-full grid-rows-layout bg-gray-light pt-6 transition-colors dark:bg-black">
			<div class="container flex min-h-screen flex-col transition-colors">{props.children}</div>
			<Footer></Footer>
		</div>
	)
}

export default PageContent
