import { gql } from '@solid-primitives/graphql'
import { Transition } from 'solid-headless'
import { createSignal, onCleanup, createEffect, createMemo, createResource } from 'solid-js'
import { useGraphQL } from '../context/GraphQLClient'
import { Airport, AirportSearchFragment, GetAirportsQuery, GetAirportsQueryVariables } from '../generated/graphql'
import WeatherParsed from './WeatherParsed'

const placeholders = ['KSFO', 'EDDF', 'LEBL', 'EGLL', 'LFPG']

const SearchComponent = () => {
	const [result, setResult] = createSignal<AirportSearchFragment | undefined>(undefined)
	const [input, setInput] = createSignal('')
	const [placeholder, setPlaceholder] = createSignal(placeholders[0])

	const interval = setInterval(() => {
		if (result()) {
			return
		}

		setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)])
	}, 3000)

	onCleanup(() => {
		clearInterval(interval)
	})

	const QUERY = gql`
		fragment AirportSearch on Airport {
			identifier
			name
			runways(closed: false) {
				closed
				surface
				lowRunwayHeading
				lowRunwayIdentifier
				lowRunwayLatitude
				lowRunwayLongitude

				highRunwayHeading
				highRunwayIdentifier
				highRunwayLatitude
				highRunwayLongitude
			}
		}
		query GetAirports($identifier: String!) {
			getAirports(identifier: $identifier) {
				pageInfo {
					hasNextPage
					endCursor
				}
				totalCount
				edges {
					cursor
					node {
						...AirportSearch
					}
				}
			}
		}
	`

	const newQuery = useGraphQL()
	const [data] = newQuery<GetAirportsQuery, GetAirportsQueryVariables>(QUERY, () => {
		return { identifier: input() }
	})

	createEffect(() => {
		if (data() && data().getAirports.edges.length > 0) {
			setResult(data().getAirports.edges[0].node)
			return
		}

		setResult(undefined)
	})

	return (
		<>
			<div class="flex flex-col gap-8 h-1/2 transition-all" classList={{ 'h-1/3': result() != undefined }}>
				<h2 class="text-center mt-auto">What's the weather like in...</h2>
				<input
					type="text"
					placeholder={placeholder()}
					onInput={e => {
						setInput((e.target as HTMLInputElement).value)
					}}
					class="mx-auto max-w-xs text-center bg-blue-50 text-2xl w-8/12 px-4 py-2 rounded-lg transition-all"
				/>
			</div>
			<div class="flex flex-col h-1/2 transition-all" classList={{ 'h-2/3': result() != undefined }}>
				<Transition
					show={result() != undefined}
					enter="transform transition duration-[200ms]"
					enterFrom="opacity-0 scale-50"
					enterTo="opacity-100 scale-100"
					leave="transform duration-200 transition ease-in-out"
					leaveFrom="opacity-100 rotate-0 scale-100 "
					leaveTo="opacity-0 scale-95">
					<WeatherParsed airport={result()}></WeatherParsed>
					<p class="text-xl text-blue-400 text-center py-20">
						KSFO 280956Z 20003KT 10SM FEW007 FEW012 15/12 A2982 RMK AO2 SLP097 T01500122
					</p>
				</Transition>
			</div>
		</>
	)
}

export default SearchComponent
