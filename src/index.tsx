/* @refresh reload */
import './styles/index.css'
import { render } from 'solid-js/web'
import { createGraphQLClient } from '@solid-primitives/graphql'
import { Component } from 'solid-js'
import { GraphQLProvider } from './context/GraphQLClient'
import { Route, Router, Routes } from '@solidjs/router'
import Home from './pages/Home'
import { MetaProvider } from '@solidjs/meta'
import AirportSearchDetail from './pages/AirportSearchDetail'
import Logo from './components/Logo'

const App: Component = () => {
	const client = createGraphQLClient('https://api.metar.gg/graphql')

	return (
		<MetaProvider>
			<Router>
				<GraphQLProvider client={client}>
					<Routes>
						<Route path="/" component={Home} />
						<Route path="/:airportIdentifier" component={AirportSearchDetail} />
					</Routes>
				</GraphQLProvider>
			</Router>
		</MetaProvider>
	)
}

render(() => <App />, document.getElementById('root') as HTMLElement)
