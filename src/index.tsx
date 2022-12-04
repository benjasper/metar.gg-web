/* @refresh reload */
import { MetaProvider } from '@solidjs/meta'
import { Navigate, Route, Router, Routes, useParams } from '@solidjs/router'
import { Component } from 'solid-js'
import { render } from 'solid-js/web'
import { GraphQLProvider } from './context/GraphQLClient'
import { TimeStoreProvider } from './context/TimeStore'
import About from './pages/About'
import AirportSearchDetail from './pages/AirportSearchDetail'
import Home from './pages/Home'
import Legal from './pages/Legal'
import TermsOfUse from './pages/TermsOfUse'
import './styles/index.css'

const App: Component = () => {
	return (
		<MetaProvider>
			<Router>
				<TimeStoreProvider>
					<GraphQLProvider>
						<Routes>
							<Route path="/" component={Home} />
							<Route path="/about" component={About} />
							<Route path="/legal" component={Legal} />
							<Route path="/terms" component={TermsOfUse} />
							<Route path="/airport/:airportIdentifier" component={AirportSearchDetail} />
							<Route
								path="/:airportIdentifier"
								element={<Navigate href={() => '/airport/' + useParams().airportIdentifier} />}
							/>
						</Routes>
					</GraphQLProvider>
				</TimeStoreProvider>
			</Router>
		</MetaProvider>
	)
}

render(() => <App />, document.getElementById('root') as HTMLElement)
