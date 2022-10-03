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

	let refreshInterval = 1000 * 60 * 10
	const setRefreshInterval = (interval: number) => {
		if (refreshInterval !== interval) {
			refreshInterval = interval
			clearTimeout(refetchTimeout)
			refreshAirport()
		}
	}

	const [lastRefreshed, setLastRefreshed] = createSignal<Date>(new Date())
	const [airportIdentifier, setAirportIdentifier] = createSignal<GetSingleAirportQueryVariables | false>(false)
	const [airportRequest, { mutate, refetch: refetchAirport }] = newQuery<
		GetSingleAirportQuery,
		GetSingleAirportQueryVariables
	>(AIRPORT_SINGLE, () => airportIdentifier())

	const throttledLoading = debounce((id: string) => setAirportIdentifier({ identifier: id }), 100)

	const airport = (): AirportSearchFragment => {
		if (airportRequest() && airportRequest().getAirport) {
			return airportRequest().getAirport
		}

		return undefined
	}

	const [now, setNow] = createSignal<Date>(new Date())

	const metarObservationTime = () => new Date(airport()?.station.metars?.edges[0]?.node.observationTime) ?? undefined
	const lastObservationDuration = (): Duration => Duration.fromDates(metarObservationTime(), now())

	const nextImportPrediction = () =>
		new Date(airport()?.station.metars?.edges[0]?.node.nextImportTimePrediction) ?? undefined
	const nextImportPredictionDuration = (): Duration => Duration.fromDates(nextImportPrediction(), now())

	const importTime = () => new Date(airport()?.station.metars?.edges[0]?.node.importTime) ?? undefined
	const importTimeDuration = (): Duration => Duration.fromDates(importTime(), now())

	const nowInterval = setInterval(() => {
		setNow(new Date())
	}, 3000)

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			setAirportIdentifier(false)
			mutate(undefined)
			return
		}

		setLastRefreshed(new Date())
		throttledLoading(airportIdentifier)
	}

	let refetchTimeout: NodeJS.Timeout
	const refreshAirport = () => {
		refetchAirport()
		setLastRefreshed(new Date())

		refetchTimeout = setTimeout(() => {
			console.log('refreshing')
			refreshAirport()
		}, refreshInterval)
	}

	// Make a search base on the route parameter
	createEffect(() => {
		if (params.airportIdentifier) {
			doSearch(params.airportIdentifier)
		}
	})

	// Change the refresh interval based on the next import prediction
	createEffect(() => {
		if (nextImportPrediction() && nextImportPredictionDuration().asSeconds() < 60) {
			setRefreshInterval(1000 * 10) // 10 seconds
			return
		} else if (nextImportPrediction() && nextImportPredictionDuration().asMinutes() < 5) {
			setRefreshInterval(1000 * 30 /* 30 seconds */)
			return
		} else if (nextImportPrediction() && nextImportPredictionDuration().asMinutes() < 10) {
			setRefreshInterval(1000 * 60 /* 1 minute */)
			return
		}
	})

	onCleanup(() => {
		clearInterval(nowInterval)
		clearTimeout(refetchTimeout)
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
						<div class="flex flex-row flex-wrap gap-2 justify-start pt-2">
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
								Observed {lastObservationDuration().humanImprecise()}
							</span>
							<span
								class="text-xs px-3 py-1 rounded-full bg-gray-200 text-black cursor-default"
								title={importTime().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}>
								Published {importTimeDuration().humanImprecise()}
							</span>
							<span
								class="text-xs px-3 py-1 rounded-full text-white cursor-default"
								classList={{
									'bg-orange-500': nextImportPredictionDuration().isPast(),
									'bg-green-600': nextImportPredictionDuration().isFuture(),
								}}
								title={nextImportPrediction().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}>
								Next update expected {nextImportPredictionDuration().humanImprecise()}
							</span>
						</div>
					</div>
					<span class="flex mt-4 md:mt-auto text-gray-700">
						<HiOutlineRefresh class="my-auto mr-2" />
						Refreshed {Duration.fromDates(lastRefreshed(), now()).humanImprecise()}
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
