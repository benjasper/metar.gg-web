import { Meta } from '@solidjs/meta'
import { ParentComponent } from 'solid-js'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import metarGGLogo from '../images/metargg-logo.webp'

interface PageContentProps {
	title: string
	description: string
	contentFullHeight?: boolean
}

const PageContent: ParentComponent<PageContentProps> = props => {
	return (
		<>
			<PageTitle content={props.title}></PageTitle>
			<Meta name="description" content={props.description}></Meta>

			<Meta name="og:title" content={props.title}></Meta>
			<Meta name="og:description" content={props.description}></Meta>
			<Meta name="og:image" content={metarGGLogo}></Meta>

			<Meta name="twitter:card" content='summary'></Meta>
			<Meta name="twitter:title" content={props.title}></Meta>
			<Meta name="twitter:description" content={props.description}></Meta>
			<Meta name="twitter:image" content={metarGGLogo}></Meta>

			<div class="grid min-h-full grid-rows-layout bg-gray-light pt-6 transition-colors dark:bg-black">
				<div class="container flex flex-col transition-colors" classList={{'min-h-screen': props.contentFullHeight ?? false}}>{props.children}</div>
				<Footer></Footer>
			</div>
		</>
	)
}

export default PageContent
