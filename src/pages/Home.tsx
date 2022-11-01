import SearchBar from '../components/SearchBar'
import { useNavigate } from '@solidjs/router'
import { Component } from 'solid-js'
import { Meta, Title } from '@solidjs/meta'
import Logo from '../components/Logo'
import PageLanding from '../layouts/PageLanding'

const Home: Component = () => {
	const navigate = useNavigate()

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			// TODO return to search page
			return
		}

		navigate(`/${airportIdentifier.toLowerCase()}`)
	}

	return (
		<>
			<Title>Latest aviation weather | metar.gg</Title>
			<Meta name="description">Find out the weather for any airport in the world.</Meta>
			<PageLanding>
				<div class="mt-[33%] flex flex-col gap-8 transition-all">
					<Logo class="mx-auto"></Logo>
					<h2 class="mt-4 text-center dark:text-white-dark">What's the weather like in...</h2>
					<div class="flex flex-col">
						<SearchBar onSearch={doSearch}></SearchBar>
						<span class="mx-auto mt-2 text-center text-gray-500">Simply start typing</span>
					</div>
				</div>
			</PageLanding>
		</>
	)
}

export default Home
