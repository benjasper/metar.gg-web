import SearchBar from '../components/SearchBar'
import { useNavigate } from '@solidjs/router'
import { Component } from 'solid-js'
import { Meta, Title } from '@solidjs/meta'

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
			<Title>
				Latest aviation weather | metar.gg
			</Title>
			<Meta name="description">
				Find out the weather for any airport in the world.
			</Meta>
			<div class="flex flex-col">
				<div class="flex flex-col gap-8 transition-all mt-[33%]">
					<h2 class="text-center mt-auto dark:text-white-dark">What's the weather like in...</h2>
					<SearchBar onSearch={doSearch}></SearchBar>
				</div>
			</div>
		</>
	)
}

export default Home
