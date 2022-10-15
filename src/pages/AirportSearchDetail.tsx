import { debounce } from '@solid-primitives/scheduled'
import { Meta, Title } from '@solidjs/meta'
import { useIsRouting, useParams } from '@solidjs/router'
import { Component, createEffect, createSignal, onCleanup, Show, untrack } from 'solid-js'
import WeatherElements from '../components/WeatherElements'
import { useGraphQL } from '../context/GraphQLClient'
import { AIRPORT_SINGLE } from '../queries/AirportQueries'
import { HiOutlineRefresh } from 'solid-icons/hi'
import { ImSpinner5 } from 'solid-icons/im'
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

	const refetchInterval = setInterval(() => {
		refreshAirport()
	}, 1000 * 30)

	const doSearch = (airportIdentifier: string) => {
		mutate(undefined)
		if (airportIdentifier.length === 0) {
			setAirportIdentifier(false)
			mutate(undefined)
			return
		}

		setLastRefreshed(new Date())
		throttledLoading(airportIdentifier)
	}

	const refreshAirport = () => {
		refetchAirport()
		setLastRefreshed(new Date())
	}

	// Make a search base on the route parameter
	createEffect(() => {
		if (params.airportIdentifier) {
			doSearch(params.airportIdentifier)
		}
	})

	onCleanup(() => {
		clearInterval(nowInterval)
		clearTimeout(refetchInterval)
	})

	return (
		<Show
			when={airport() !== undefined || (airport() !== undefined && !airportRequest.loading)}
			fallback={<ImSpinner5 class="animate-spin w-16 mx-auto mt-32 dark:text-white-dark" size={36} />}>
			<Title>
				{airport().icaoCode} / {airport().iataCode} - Weather | metar.gg
			</Title>
			<Meta name="description">
				Get the latest METAR and TAF information for {airport().name} ({airport().identifier}).
			</Meta>
			<div class="my-auto flex flex-col">
				<div class="flex flex-col mx-auto text-center py-16 dark:text-white-dark">
					<h2>
						{airport().icaoCode} <Show when={airport().iataCode}>/ {airport().iataCode}</Show>
					</h2>
					<span class="text-lg mt-1">{airport().name}</span>
					<span class="text-sm">
						<Show when={airport().municipality}>{airport().municipality},</Show> {airport().country.name}
					</span>
					<Show when={airport().timezone}>
						<span class="text-xs px-3 py-1 mt-2 mx-auto rounded-full bg-gray-50 dark:bg-black-200 text-black dark:text-white-dark cursor-default">
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
						<h3 class="text-xl dark:text-white-dark">Current weather</h3>
						<div class="flex flex-row flex-wrap gap-2 justify-start pt-2">
							<span
								class="text-xs px-3 py-1 rounded-full text-white dark:text-white-light cursor-default"
								classList={{
									'bg-green-600 dark:bg-green-800': lastObservationDuration().asHours() <= 2,
									'bg-red-600 dark:bg-red-800': lastObservationDuration().asHours() > 2,
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
								class="text-xs px-3 py-1 rounded-full bg-white dark:bg-black-200 text-black dark:text-white-light cursor-default"
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
								class="text-xs px-3 py-1 rounded-full text-white dark:text-white-light cursor-default"
								classList={{
									'bg-orange-500 dark:bg-orange-800':
										nextImportPredictionDuration().isPast() &&
										nextImportPredictionDuration().asMinutes() > 5,
									'bg-green-600 dark:bg-green-800':
										nextImportPredictionDuration().isFuture() ||
										(nextImportPredictionDuration().asMinutes() <= 5 &&
											nextImportPredictionDuration().isPast()),
								}}
								title={nextImportPrediction().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}>
								<Show
									when={nextImportPredictionDuration().isFuture()}
									fallback={`Next update expected any moment now`}>
									Next update expected {nextImportPredictionDuration().humanImprecise()}
								</Show>
							</span>
						</div>
					</div>
					<span class="flex mt-4 md:mt-auto text-gray-700 dark:text-white-dark">
						<HiOutlineRefresh class="my-auto mr-2" />
						Refreshed {Duration.fromDates(lastRefreshed(), now()).humanImprecise()}
					</span>
				</div>
				<WeatherElements class="mt-4" airport={airport()}></WeatherElements>
				<div class="flex flex-col gap-4 py-16">
					<Show when={airport() && airport().station.metars.edges[0]}>
						<p class="text-xl text-center dark:text-white-dark">{airport().station.metars.edges[0].node.rawText}</p>
					</Show>
				</div>
			</div>
		</Show>
	)
}

export default AirportSearchDetail
