import { Title } from '@solidjs/meta'
import { AiOutlineGithub } from 'solid-icons/ai'
import Logo from '~/components/Logo'
import PageTitle from '~/components/PageTitle'
import PageContent from '~/layouts/PageContent'

const About = () => {
	return (
		<PageContent title='About' description='An app for getting up to date METAR information. Get latest weather observations and forecasts here.'>
			<div class="container text-black dark:text-white-dark">
				<div class="flex flex-col justify-between gap-6 md:flex-row">
					<Logo class="mx-auto md:mx-0 md:w-1/4"></Logo>
				</div>
				<h1 class="pt-16 text-4xl font-bold">About</h1>

				<h2 class="pt-16 text-3xl">What is this?</h2>
				<p class="mt-4">
					This is a simple app for getting up to date METAR information. For the airport data it uses the
					publicly available <a href="https://www.ourairports.com/">OurAirports</a> database, while the
					weather is imported every 2 minutes from <a href="https://www.noaa.gov/">NOAA</a>.
				</p>

				<h2 class="pt-16 text-3xl">Open Source</h2>
				<p class="mt-4">
					This is a free and open source project. You can find both the source code for the app as well as the
					API here:
				</p>
				<ul class="mt-4 flex flex-col gap-2 pl-2">
					<li>
						<a class="flex gap-2" href="https://github.com/benjasper/metar.gg-web">
							<AiOutlineGithub class="my-auto" size={24} />
							<span class="my-auto">Web app</span>
						</a>
					</li>
					<li>
						<a class="flex gap-2" href="https://github.com/benjasper/metar.gg-backend">
							<AiOutlineGithub class="my-auto" size={24} />
							<span class="my-auto">Backend</span>
						</a>
					</li>
				</ul>

				<p class="mt-4">
					Feel free to contribute or open an issue if you find a bug or have a feature request.
				</p>
			</div>
		</PageContent>
	)
}

export default About
