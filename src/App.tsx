import { createGraphQLClient } from '@solid-primitives/graphql'
import { Component } from 'solid-js'
import SearchComponent from './components/SearchComponent'
import { GraphQLProvider } from './context/GraphQLClient'

const App: Component = () => {
	const client = createGraphQLClient("https://api.metar.gg/graphql")

	return (
		<GraphQLProvider client={client}>
			<div class="container mx-auto w-full h-screen">
				<SearchComponent></SearchComponent>
			</div>
		</GraphQLProvider>
	)
}

export default App
