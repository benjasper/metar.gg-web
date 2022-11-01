import Logo from '../components/Logo'
import PageContent from '../layouts/PageContent'

const About = () => {
	return (
		<PageContent>
			<div class="container text-black dark:text-white-dark">
				<div class="flex flex-col justify-between gap-6 md:flex-row">
					<Logo class="mx-auto md:mx-0 md:w-1/4"></Logo>
				</div>
				<h1 class="pt-16 text-4xl font-bold">About</h1>
				<h2 class='pt-16 text-3xl'>What is this?</h2>
				<p class="mt-4">
					This is a simple app for getting up to date METAR information. For the airport data it uses the
					publicly available OurAirports database, while the weather is imported every 2 minutes from NOAA.
				</p>
			</div>
		</PageContent>
	)
}

export default About
