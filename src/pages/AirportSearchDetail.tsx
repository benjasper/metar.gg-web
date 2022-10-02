import { debounce } from '@solid-primitives/scheduled'
import { Meta, Title } from '@solidjs/meta'
import { useParams } from '@solidjs/router'
import { Component, createEffect, createSignal, onCleanup, Show, untrack } from 'solid-js'
import WeatherElements from '../components/WeatherElements'
import { useGraphQL } from '../context/GraphQLClient'
import { AIRPORT_SINGLE } from '../queries/AirportQueries'
import { HiOutlineRefresh } from 'solid-icons/hi'
import {
	GetSingleAirportQueryVariables,
	GetSingleAirportQuery,
	AirportSearchFragment,
} from '../queries/generated/graphql'
import Duration from '../models/duration'

const AirportSearchDetail: Component = () => {
	const params = useParams()
	const newQuery = useGraphQL()

	const [lastRefreshed, setLastRefreshed] = createSignal<Date>(new Date())
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

	const lastObservationDuration = (): Duration => Duration.fromDates(now(), metarObservationTime())

	const interval = setInterval(() => {
		setNow(new Date())
	}, 3000)

	let refetchInterval: NodeJS.Timer

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			setAirportIdentifier(false)
			mutate(undefined)
			return
		}

		setLastRefreshed(new Date())
		throttledLoading(airportIdentifier)

		if (refetchInterval) {
			clearInterval(refetchInterval)
		}

		refetchInterval = setInterval(() => {
			refetch()
			setLastRefreshed(new Date())
		}, 1000 * 60 * 5)
	}

	createEffect(() => {
		if (params.airportIdentifier) {
			doSearch(params.airportIdentifier)
		}
	})

	onCleanup(() => {
		clearInterval(interval)
		clearInterval(refetchInterval)
	})

	return (
		<Show when={airport() !== undefined}>
			<Title>
				{airport().icaoCode} / {airport().iataCode} - Weather | metar.gg
			</Title>
			<Meta name="description">
				Get the latest METAR and TAF information for {airport().name} ({airport().identifier}).
			</Meta>
			<div class="my-auto flex flex-col">
				<div class="flex flex-col mx-auto text-center py-16">
					<h2>
						{airport().icaoCode} <Show when={airport().iataCode}>/ {airport().iataCode}</Show>
					</h2>
					<span class="text-lg mt-1">{airport().name}</span>
					<span class="text-sm">
						<Show when={airport().municipality}>{airport().municipality},</Show> {airport().country.name}
					</span>
					<Show when={airport().timezone}>
						<span class="text-xs px-3 py-1 mt-2 mx-auto rounded-full bg-gray-50 text-black cursor-default">
							Local time{' '}
							{now().toLocaleTimeString([], {
								hour: 'numeric',
								minute: '2-digit',
								timeZone: airport().timezone,
							})}
						</span>
					</Show>
				</div>

				<div class="flex flex-col md:flex-row justify-between">
					<div class="flex flex-col">
						<h3 class="text-xl">Current weather</h3>
						<div class="flex flex-row gap-2 justify-start pt-2">
							<span
								class="text-xs px-3 py-1 rounded-full text-white cursor-default"
								classList={{
									'bg-green-600': lastObservationDuration().asHours() <= 2,
									'bg-red-600': lastObservationDuration().asHours() > 2,
								}}
								title={metarObservationTime().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}>
								Observed {lastObservationDuration().humanImprecise()} ago
							</span>
						</div>
					</div>
					<span class="flex mt-4 md:mt-auto text-gray-700">
						<HiOutlineRefresh class="my-auto mr-2" />
						Refreshed {Duration.fromDates(now(), lastRefreshed()).humanImprecise()} ago
					</span>
				</div>

				<WeatherElements class="mt-4" airport={airport()}></WeatherElements>

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
