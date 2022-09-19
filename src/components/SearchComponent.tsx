import { gql } from '@solid-primitives/graphql'
import { Transition } from 'solid-headless'
import { createSignal, onCleanup, createEffect, createMemo, createResource, Resource, Show, Suspense } from 'solid-js'
import { useGraphQL } from '../context/GraphQLClient'
import { Airport, AirportSearchFragment, GetAirportsQuery, GetAirportsQueryVariables } from '../generated/graphql'
import WeatherParsed from './WeatherParsed'

const placeholders = ['KSFO', 'EDDF', 'LEBL', 'EGLL', 'LFPG']

const QUERY = gql`
	fragment Metar on Metar {
		observationTime
		rawText
		temperature
		dewpoint
		altimeter
		visibility
		windDirection
		windSpeed
		windGust
		skyConditions {
			skyCover
			cloudBase
		}
	}

	fragment AirportSearch on Airport {
		icaoCode
		iataCode
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
		station {
			metars(first: 1) {
				edges {
					node {
						...Metar
					}
				}
			}
		}
	}

	query GetAirports($search: String!) {
		getAirports(search: $search, hasWeather: true) {
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

const SearchComponent = () => {
	const [placeholder, setPlaceholder] = createSignal(placeholders[0])

	const [queryVars, setQueryVars] = createSignal<GetAirportsQueryVariables | false>(false)

	const newQuery = useGraphQL()

	const [airportResults, refetch] = newQuery<GetAirportsQuery, GetAirportsQueryVariables>(QUERY, queryVars)
	const airport = () => airportResults()?.getAirports.edges[0]?.node ?? undefined

	const metarObservationTime = () => new Date(airport()?.station?.metars.edges[0]?.node.observationTime) ?? undefined

	const interval = setInterval(() => {
		if (airportResults() && airportResults().getAirports.edges.length > 0) {
			return
		}

		setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)])
	}, 3000)

	onCleanup(() => {
		clearInterval(interval)
	})

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement

		if (target.value.length === 0) {
			setQueryVars(false)
			refetch.mutate(undefined)
			return
		}

		if (target.value.length < 3) {
			return
		}

		setQueryVars({ search: target.value })
	}

	return (
		<>
			<div class="flex flex-col gap-8 h-1/2 transition-all" classList={{ 'h-1/4': airport() != undefined }}>
				<h2 class="text-center mt-auto">What's the weather like in...</h2>
				<input
					type="text"
					autofocus={true}
					spellcheck={false}
					autocomplete="off"
					placeholder={placeholder()}
					onInput={e => handleInput(e)}
					class="mx-auto max-w-xs text-center bg-blue-50 text-3xl w-8/12 px-4 py-2 rounded-lg transition-all"
				/>
			</div>
			<div class="flex flex-col h-1/2 transition-all" classList={{ 'h-3/4': airport() != undefined }}>
				<Transition
					class="my-auto flex flex-col gap-32"
					show={airport() !== undefined}
					enter="transform transition duration-[200ms]"
					enterFrom="opacity-0 scale-50"
					enterTo="opacity-100 scale-100"
					leave="transform duration-200 transition ease-in-out"
					leaveFrom="opacity-100 rotate-0 scale-100 "
					leaveTo="opacity-0 scale-95">
					<Show when={airport() !== undefined}>
						<div class="flex flex-col mx-auto text-center">
							<h2>
								{airport().icaoCode} / {airport().iataCode}
							</h2>
							<span class="mx-">{airport().name}</span>
						</div>
						<WeatherParsed airport={airport()}></WeatherParsed>

						<div class='flex flex-col gap-4'>
							<p class="text-xl text-center">{airport().station.metars.edges[0].node.rawText}</p>
							<span class="text-center">
								Last updated at {metarObservationTime().toLocaleTimeString()}
							</span>
						</div>
					</Show>
				</Transition>
			</div>
		</>
	)
}

export default SearchComponent
