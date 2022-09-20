import { gql } from '@solid-primitives/graphql'
import { Transition } from 'solid-headless'
import { createSignal, onCleanup, createEffect, createMemo, createResource, Resource, Show, Suspense } from 'solid-js'
import { useGraphQL } from '../context/GraphQLClient'
import { Airport, AirportSearchFragment, GetAirportsQuery, GetAirportsQueryVariables } from '../generated/graphql'
import SearchBar from './SearchBar'
import ParsedWeatherElements from './parsed-weather/ParsedWeatherElements'

const SearchComponent = () => {
	const [placeholder, setPlaceholder] = createSignal('')

	const newQuery = useGraphQL()

	const airport = () => undefined

	const metarObservationTime = () => new Date(airport()?.station?.metars.edges[0]?.node.observationTime) ?? undefined

	return (
		<>
			<div class="flex flex-col gap-8 h-1/2 transition-all" classList={{ 'h-1/4': airport() != undefined }}>
				<h2 class="text-center mt-auto">What's the weather like in...</h2>
				<SearchBar></SearchBar>
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
						<ParsedWeatherElements airport={airport()}></ParsedWeatherElements>

						<div class='flex flex-col gap-4'>
							<p class="text-xl text-center">{airport().station.metars.edges[0].node.rawText}</p>
							<span class="text-center">
								Last updated at {metarObservationTime().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
							</span>
						</div>
					</Show>
				</Transition>
			</div>
		</>
	)
}

export default SearchComponent
