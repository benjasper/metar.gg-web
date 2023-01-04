import { Meta } from '@solidjs/meta'
import Header from '../components/Header'
import Logo from '../components/Logo'
import PageContent from '../layouts/PageContent'

const Legal = () => {
	return (
		<PageContent title="Legal" description="">
			<Meta name="robots" content="noindex" />

			<div class="container text-black dark:text-white-dark">
				<Header />
				<h1 class="pt-16 text-4xl font-bold">Legal</h1>
				<h2 class="pt-16 text-3xl">Information according to §5 TMG</h2>
				<p class="mt-4">
					Operator: Benjamin Jasper
					<br />
					Steinstr. 21b
					<br />
					78467 Konstanz, Germany
				</p>
				<h2 class="pt-8 text-3xl">Contact</h2>
				<p>
					<a class="mt-4 block" href="benjaminjasper.com">
						benjaminjasper.com
					</a>
				</p>
			</div>
		</PageContent>
	)
}

export default Legal
