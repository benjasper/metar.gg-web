import Logo from '../components/Logo'
import PageContent from '../layouts/PageContent'

const Legal = () => {
	return (
		<PageContent>
			<div class="container text-black dark:text-white-dark">
				<div class="flex flex-col justify-between gap-6 md:flex-row">
					<Logo class="mx-auto md:mx-0 md:w-1/4"></Logo>
				</div>
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
