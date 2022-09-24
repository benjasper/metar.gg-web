import { debounce } from '@solid-primitives/scheduled'
import { Title } from '@solidjs/meta'
import { useParams } from '@solidjs/router'
import { Duration } from 'uhrwerk'
import { Component, createEffect, createSignal, onCleanup, Show, untrack } from 'solid-js'
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

	const throttledLoading = debounce((id: string) => setAirportIdentifier({ identifier: id }), 100)

	const airport = (): AirportSearchFragment => {
		if (airportRequest() && airportRequest().getAirport) {
			return airportRequest().getAirport
		}

		return undefined
	}

	const metarObservationTime = () => new Date(airport()?.station.metars?.edges[0]?.node.observationTime) ?? undefined
	const [now, setNow] = createSignal<Date>(new Date())

	const lastObservationDuration = (): Duration =>
		new Duration(now().getTime() - metarObservationTime().getTime(), 'ms')

	const interval = setInterval(() => {
		setNow(new Date())
	}, 1000)

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			setAirportIdentifier(false)
			mutate(undefined)
			return
		}
		throttledLoading(airportIdentifier)
	}

	createEffect(() => {
		if (params.airportIdentifier) {
			doSearch(params.airportIdentifier)
		}
	})

	onCleanup(() => {
		clearInterval(interval)
	})

	return (
		<Show when={airportRequest.loading === false && airport() !== undefined}>
			<Title>
				{airport().icaoCode} / {airport().iataCode} - Weather | metar.gg
			</Title>
			<div class="my-auto flex flex-col">
				<div class="flex flex-col mx-auto text-center py-16">
					<h2>
						{airport().icaoCode} / {airport().iataCode}
					</h2>
					<span class="text-lg mt-1">{airport().name}</span>
					<span class="text-sm">
						{airport().municipality}, {airport().country.name}
					</span>
				</div>

				<h3 class="text-xl">Current weather</h3>
				<div class="flex flex-row gap-2 justify-start pt-2">
					<span
						class="text-xs px-3 py-1 rounded-full  text-white"
						classList={{'bg-green-600': lastObservationDuration().asHours() <= 2, 'bg-red-600': lastObservationDuration().asHours() > 2}}
						title={metarObservationTime().toLocaleTimeString([], {
							hour: 'numeric',
							minute: '2-digit',
						})}>
						Observed {lastObservationDuration().humanize()} ago
					</span>
				</div>

				<ParsedWeatherElements class="mt-4" airport={airport()}></ParsedWeatherElements>

				<div class="flex flex-col gap-4 py-16">
					<Show when={airport() && airport().station.metars.edges[0]}>
						<p class="text-xl text-center">{airport().station.metars.edges[0].node.rawText}</p>
					</Show>
				</div>
			</div>
		</Show>
	)
}

export default AirportSearchDetail
