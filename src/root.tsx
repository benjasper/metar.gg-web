// @refresh reload
import { createGraphQLClient } from '@solid-primitives/graphql'
import { Suspense } from 'solid-js'
import {
	A,
	Body,
	ErrorBoundary,
	FileRoutes,
	Head,
	Html,
	Link,
	Meta,
	Navigate,
	Route,
	Routes,
	Scripts,
	Title,
	useParams,
} from 'solid-start'
import '~/assets/styles/index.css'
import { GraphQLProvider } from './context/GraphQLClient'
import Home from './routes'

export default function Root() {
	const client = createGraphQLClient('https://api.metar.gg/graphql')

	return (
		<Html lang="en">
			<Head>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />

				<Link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<Link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
				<Link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
				<Link rel="manifest" href="/favicon/site.webmanifest" />
				<Link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#03045e" />
				<Link rel="shortcut icon" href="/favicon/favicon.ico" />
				<Meta name="msapplication-TileColor" content="#03045e" />
				<Meta name="msapplication-config" content="/favicon/browserconfig.xml" />
				<Meta name="theme-color" content="#ffffff" />
			</Head>
			<Body>
				<Suspense>
					<ErrorBoundary>
						<GraphQLProvider client={client}>
							<Routes>
								<Route
									path="/:airportIdentifier"
									element={<Navigate href={() => '/airport/' + useParams().airportIdentifier} />}
								/>
								<FileRoutes />
							</Routes>
						</GraphQLProvider>
					</ErrorBoundary>
				</Suspense>
				<Scripts />
			</Body>
		</Html>
	)
}
