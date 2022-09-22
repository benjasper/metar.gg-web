import { useParams } from '@solidjs/router'
import { Transition } from 'solid-headless'
import { Component, createEffect, createSignal, Show } from 'solid-js'
import ParsedWeatherElements from '../components/parsed-weather/ParsedWeatherElements'
import { useGraphQL } from '../context/GraphQLClient'
import { AIRPORT_SINGLE } from '../queries/AirportQueries'
import {
	GetSingleAirportQueryVariables,
	GetSingleAirportQuery,
	AirportSearchFragment,
} from '../queries/generated/graphql'

const AirportSearchDetail: Component = () => {
	const params = useParams()
	const newQuery = useGraphQL()

	const [airportIdentifier, setAirportIdentifier] = createSignal<GetSingleAirportQueryVariables | false>(false)
	const [airportRequest, { mutate, refetch }] = newQuery<GetSingleAirportQuery, GetSingleAirportQueryVariables>(
		AIRPORT_SINGLE,
		() => airportIdentifier()
	)

	const airport = (): AirportSearchFragment => {
		if (airportRequest() && airportRequest().getAirport) {
			return airportRequest().getAirport
		}

		return undefined
	}

	const metarObservationTime = () => new Date(airport()?.station.metars?.edges[0]?.node.observationTime) ?? undefined

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			setAirportIdentifier(false)
			mutate(undefined)
			return
		}
		setAirportIdentifier({ identifier: airportIdentifier })
	}

	createEffect(() => {
		if (params.airportIdentifier) {
			doSearch(params.airportIdentifier)
		}
	})

	return (
		<Transition
			class="my-auto flex flex-col gap-32"
			show={airportRequest.loading === false && airport() !== undefined}
			enter="transform transition duration-[200ms]"
			enterFrom="opacity-0 scale-80"
			enterTo="opacity-100 scale-100"
			leave="transform duration-200 transition ease-in-out"
			leaveFrom="opacity-100 rotate-0 scale-100 "
			leaveTo="opacity-0 scale-95">
			<div class="flex flex-col mx-auto text-center">
				<h2>
					{airport().icaoCode} / {airport().iataCode}
				</h2>
				<span class="text-lg mt-1">{airport().name}</span>
				<span class="text-sm">
					{airport().municipality}, {airport().country.name}
				</span>
			</div>
			<ParsedWeatherElements airport={airport()}></ParsedWeatherElements>

			<div class="flex flex-col gap-4">
				<Show when={airport() && airport().station.metars.edges[0]}>
					<p class="text-xl text-center">{airport().station.metars.edges[0].node.rawText}</p>
					<span class="text-center">
						Last updated at{' '}
						{metarObservationTime().toLocaleTimeString([], {
							hour: 'numeric',
							minute: '2-digit',
						})}
					</span>
				</Show>
			</div>
		</Transition>
	)
}

export default AirportSearchDetail
