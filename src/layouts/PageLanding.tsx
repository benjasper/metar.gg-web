import { Meta } from '@solidjs/meta'
import { ParentComponent } from 'solid-js'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'

interface PageLandingProps {
	title: string
	description: string
}

const PageLanding: ParentComponent<PageLandingProps> = props => {
	return (
		<>
			<PageTitle content={props.title} />
			<Meta name="description" content={props.description} />
			<div class="grid min-h-full grid-rows-layout bg-gray-light dark:bg-black">
				<div class="container flex min-h-screen flex-col">{props.children}</div>
				<Footer />
			</div>
		</>
	)
}

export default PageLanding
