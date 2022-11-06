/* @refresh reload */
import './styles/index.css'
import { render } from 'solid-js/web'
import { createGraphQLClient } from '@solid-primitives/graphql'
import { Component } from 'solid-js'
import { GraphQLProvider } from './context/GraphQLClient'
import { Navigate, Route, Router, Routes, useParams } from '@solidjs/router'
import Home from './pages/Home'
import { MetaProvider } from '@solidjs/meta'
import AirportSearchDetail from './pages/AirportSearchDetail'
import About from './pages/About'
import TermsOfUse from './pages/TermsOfUse'
import Legal from './pages/Legal'

const App: Component = () => {
	const client = createGraphQLClient('https://api.metar.gg/graphql')

	return (
		<MetaProvider>
			<Router>
				<GraphQLProvider client={client}>
					<Routes>
						<Route path="/" component={Home} />
						<Route path="/about" component={About} />
						<Route path="/legal" component={Legal} />
						<Route path="/terms" component={TermsOfUse} />
						<Route path="/airport/:airportIdentifier" component={AirportSearchDetail} />
						<Route path="/:airportIdentifier" element={<Navigate href={(() => '/airport/' + useParams().airportIdentifier)}/>} />
					</Routes>
				</GraphQLProvider>
			</Router>
		</MetaProvider>
	)
}

render(() => <App />, document.getElementById('root') as HTMLElement)
