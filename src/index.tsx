/* @refresh reload */
import { MetaProvider } from '@solidjs/meta'
import { Navigate, Route, Router, Routes, useParams } from '@solidjs/router'
import { Component, ErrorBoundary } from 'solid-js'
import { render } from 'solid-js/web'
import { GraphQLProvider } from './context/GraphQLClient'
import { SettingsStoreProvider } from './context/SettingsStore'
import { TimeStoreProvider } from './context/TimeStore'
import { UnitStoreProvider } from './context/UnitStore'
import ErrorPage from './layouts/ErrorPage'
import About from './pages/About'
import AirportSearchDetail from './pages/AirportSearchDetail'
import Home from './pages/Home'
import Legal from './pages/Legal'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import './styles/index.css'

const App: Component = () => {
	return (
		<MetaProvider>
			<Router>
				<SettingsStoreProvider>
					<UnitStoreProvider>
						<TimeStoreProvider>
							<GraphQLProvider>
								<ErrorBoundary
									fallback={(err, reset) => <ErrorPage error={err} reset={reset} recoverable />}>
									<Routes>
										<Route path="/" component={Home} />
										<Route path="/about" component={About} />
										<Route path="/legal" component={Legal} />
										<Route path="/terms" component={TermsOfUse} />
										<Route path="/privacy" component={PrivacyPolicy} />
										<Route path="/airport/:airportIdentifier" component={AirportSearchDetail} />
										<Route
											path="/:airportIdentifier"
											element={
												<Navigate href={() => '/airport/' + useParams().airportIdentifier} />
											}
										/>
									</Routes>
								</ErrorBoundary>
							</GraphQLProvider>
						</TimeStoreProvider>
					</UnitStoreProvider>
				</SettingsStoreProvider>
			</Router>
		</MetaProvider>
	)
}

render(() => <App />, document.getElementById('root') as HTMLElement)
