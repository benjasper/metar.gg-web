import { Component } from 'solid-js'
import { Title, useNavigate } from 'solid-start'
import Logo from '~/components/Logo'
import SearchBar from '~/components/SearchBar'
import PageLanding from '~/layouts/PageLanding'

export default function Home() {
	const navigate = useNavigate()

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			// TODO return to search page
			return
		}

		navigate(`/airport/${airportIdentifier}`)
	}

	return (
		<PageLanding
			title="Latest aviation weather"
			description="Find the latest aviation weather observations and forecasts for any airport around the world. Get your METARs and TAFs here.">
			<div class="mt-[25vh] flex flex-col gap-8 transition-all md:mt-[33vh]">
				<Logo class="mx-auto"></Logo>
				<h2 class="mt-4 text-center dark:text-white-dark">What's the weather like in...</h2>
				<div class="flex flex-col">
					<SearchBar onSearch={doSearch}></SearchBar>
					<span class="mx-auto mt-2 text-center text-gray-500">Simply start typing</span>
				</div>
			</div>
		</PageLanding>
	)
}
