/* @refresh reload */
import './styles/index.css'
import { render } from 'solid-js/web'
import { createGraphQLClient } from '@solid-primitives/graphql'
import { Component } from 'solid-js'
import { GraphQLProvider } from './context/GraphQLClient'
import { Route, Router, Routes } from '@solidjs/router'
import AirportSearch from './pages/AirportSearch'
import AirportSearchDetail from './pages/AirportSearchDetail'

const App: Component = () => {
	const client = createGraphQLClient('https://api.metar.gg/graphql')

	return (
		<Router>
			<GraphQLProvider client={client}>
				<div class="container mx-auto w-full h-screen">
					<AirportSearch></AirportSearch>
				</div>
			</GraphQLProvider>
		</Router>
	)
}

render(() => <App />, document.getElementById('root') as HTMLElement)
