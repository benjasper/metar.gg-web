import { debounce } from '@solid-primitives/scheduled'
import { createScriptLoader } from '@solid-primitives/script-loader'
import { useNavigate, useParams } from '@solidjs/router'
import { CgWebsite } from 'solid-icons/cg'
import { FiExternalLink } from 'solid-icons/fi'
import { HiOutlineRefresh, HiSolidClock } from 'solid-icons/hi'
import { ImSpinner5 } from 'solid-icons/im'
import { IoLocationSharp } from 'solid-icons/io'
import { TbMountain } from 'solid-icons/tb'
import { Component, createEffect, createMemo, createSignal, ErrorBoundary, onCleanup, Show } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import Logo from '../components/Logo'
import SearchBar from '../components/SearchBar'
import { LinkTag, Tag } from '../components/Tag'
import WeatherElements from '../components/WeatherElements'
import { useGraphQL } from '../context/GraphQLClient'
import PageContent from '../layouts/PageContent'
import Duration from '../models/duration'
import { AIRPORT_SINGLE } from '../queries/AirportQueries'
import {
	AirportSearchFragment,
	GetSingleAirportQuery,
	GetSingleAirportQueryVariables
} from '../queries/generated/graphql'

const AirportSearchDetail: Component = () => {
	const params = useParams()
	const navigate = useNavigate()
	const newQuery = useGraphQL()

	const [airportStore, setAirportStore] = createStore<{ airport: AirportSearchFragment | undefined }>(undefined)

	const [lastRefreshed, setLastRefreshed] = createSignal<Date>(new Date())
	const [airportIdentifier, setAirportIdentifier] = createSignal<GetSingleAirportQueryVariables | false>(false)
	const [airportRequest, { mutate, refetch: refetchAirport }] = newQuery<
		GetSingleAirportQuery,
		GetSingleAirportQueryVariables
	>(AIRPORT_SINGLE, () => airportIdentifier())

	const throttledLoading = debounce((id: string) => setAirportIdentifier({ identifier: id }), 100)

	createEffect(() => {
		if (airportRequest() && airportRequest().getAirport) {
			setAirportStore(reconcile({ airport: airportRequest().getAirport }))
		}
	})

	const [now, setNow] = createSignal<Date>(new Date())

	const metarObservationTime = () =>
		new Date(airportStore.airport?.station.metars?.edges[0]?.node.observationTime) ?? undefined
	const lastObservationDuration = (): Duration => Duration.fromDates(metarObservationTime(), now())

	const nextImportPrediction = () =>
		new Date(airportStore.airport?.station.metars?.edges[0]?.node.nextImportTimePrediction) ?? undefined
	const nextImportPredictionDuration = (): Duration => Duration.fromDates(nextImportPrediction(), now())

	const importTime = () => new Date(airportStore.airport?.station.metars?.edges[0]?.node.importTime) ?? undefined
	const importTimeDuration = (): Duration => Duration.fromDates(importTime(), now())

	const title = createMemo(() => {
		if (airportStore.airport) {
			return `${airportStore.airport.icaoCode} / ${airportStore.airport.iataCode} - ${airportStore.airport.name} weather`
		}

		return `Loading ${params.airportIdentifier}...`
	})
	const description = createMemo(() => {
		return airportStore.airport
			? `Get real time METAR and TAF updates for ${airportStore.airport.name} (${airportStore.airport.identifier}${
					airportStore.airport.iataCode ? ' / ' + airportStore.airport.iataCode : ''
			  }) located in ${airportStore.airport.municipality ? airportStore.airport.municipality + ',' : ''} ${
					airportStore.airport.country.name
			  }.`
			: ''
	})

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

	const navigateTo = (airportIdentifier: string) => {
		navigate(`/airport/${airportIdentifier}`)
	}

	// Make a search base on the route parameter
	createEffect(() => {
		if (params.airportIdentifier) {
			doSearch(params.airportIdentifier)
		}
	})

	const jsonLdAirport = () =>
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Airport',
			iataCode: airportStore.airport?.iataCode,
			icaoCode: airportStore.airport?.icaoCode,
			name: airportStore.airport?.name,
			address: {
				'@type': 'PostalAddress',
				addressCountry: airportStore.airport?.country.name,
				addressLocality: airportStore.airport?.municipality,
			},
			geo: {
				'@type': 'GeoCoordinates',
				latitude: airportStore.airport?.latitude,
				longitude: airportStore.airport?.longitude,
				elevation: airportStore.airport?.elevation,
			},
			latitude: airportStore.airport?.latitude,
			longitude: airportStore.airport?.longitude,
			alternateName: `${airportStore.airport?.municipality} Airport`,
			sameAs: airportStore.airport?.website ?? airportStore.airport?.wikipedia ?? '',
			url: window.location.href,
		})

	const [_, removeJsonLdAirport] = createScriptLoader({
		src: () => jsonLdAirport(),
		type: 'application/ld+json',
	})

	onCleanup(() => {
		clearInterval(nowInterval)
		clearTimeout(refetchInterval)
		removeJsonLdAirport()
	})

	return (
		<PageContent title={title()} description={description()}>
			<div class="flex flex-col justify-between gap-6 md:flex-row">
				<Logo class="mx-auto md:mx-0 md:w-1/4"></Logo>
				<SearchBar
					class="my-auto mb-auto flex-grow justify-center"
					onSearch={navigateTo}
					placeholder="Search for another airport"></SearchBar>
				<div class="md:w-1/4"></div>
			</div>
			<ErrorBoundary fallback={err => <span class="m-auto">This airport could not be found</span>}>
				<Show
					when={
						airportStore.airport !== undefined ||
						(airportStore.airport !== undefined && !airportRequest.loading && !airportRequest.error)
					}
					fallback={
						<div class="flex h-full justify-center text-gray-700 dark:text-white-dark">
							<ImSpinner5 class="m-auto w-16 animate-spin" size={36} />
						</div>
					}>
					<div class="mx-auto flex flex-col py-16 text-center dark:text-white-dark">
						<h2>
							{airportStore.airport.icaoCode}{' '}
							<Show when={airportStore.airport.iataCode}>/ {airportStore.airport.iataCode}</Show>
						</h2>
						<span class="mt-1 text-lg">{airportStore.airport.name}</span>

						<div class="flex max-w-md flex-wrap justify-center gap-2 pt-4">
							<Tag>
								<IoLocationSharp class="my-auto mr-1"></IoLocationSharp>
								<Show when={airportStore.airport.municipality}>
									{airportStore.airport.municipality},
								</Show>{' '}
								{airportStore.airport.country.name}
							</Tag>
							<Show when={airportStore.airport.elevation}>
								<Tag>
									<TbMountain class="my-auto mr-1" />
									Elevation {airportStore.airport.elevation} ft
								</Tag>
							</Show>
							<Show when={airportStore.airport.timezone}>
								<Tag>
									<HiSolidClock class="my-auto mr-1"></HiSolidClock>
									Local time{' '}
									{now().toLocaleTimeString([], {
										hour: 'numeric',
										minute: '2-digit',
										timeZone: airportStore.airport.timezone,
									})}
								</Tag>
							</Show>
							<Show when={airportStore.airport.website}>
								<LinkTag href={airportStore.airport.website}>
									<CgWebsite class="my-auto mr-1" />
									Website
									<FiExternalLink class="my-auto ml-1" />
								</LinkTag>
							</Show>
						</div>
					</div>
					<div class="flex flex-col justify-between md:flex-row">
						<Show when={airportStore.airport.station.metars.edges.length > 0}>
							<div class="flex flex-col">
								<h3 class="text-xl dark:text-white-dark">Current weather</h3>
								<div class="flex flex-row flex-wrap justify-start gap-2 pt-2">
									<span
										class="cursor-default rounded-full px-3 py-1 text-xs text-white dark:text-white-light"
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
										class="cursor-default rounded-full bg-white px-3 py-1 text-xs text-black dark:bg-black-200 dark:text-white-light"
										title={importTime().toLocaleTimeString([], {
											hour: 'numeric',
											minute: '2-digit',
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})}>
										Published {importTimeDuration().humanImprecise()}
									</span>
									<Show
										when={
											!(
												nextImportPredictionDuration().isPast() &&
												nextImportPredictionDuration().asHours() > 2
											)
										}>
										<span
											class="cursor-default rounded-full px-3 py-1 text-xs text-white dark:text-white-light"
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
									</Show>
								</div>
							</div>
							<span
								class="mt-4 flex text-gray-700 dark:text-white-dark md:mt-auto"
								title={`Refreshed ${Duration.fromDates(lastRefreshed(), now()).humanPrecise()}`}>
								<HiOutlineRefresh class="my-auto mr-2" />
								Constantly checking for updates
							</span>
						</Show>
					</div>
					<WeatherElements class="mt-4" airport={airportStore.airport}></WeatherElements>
					<div class="flex flex-col gap-4 py-16">
						<Show when={airportStore.airport && airportStore.airport.station.metars.edges[0]}>
							<p aria-label="METAR" class="text-center text-xl dark:text-white-dark">
								{airportStore.airport.station.metars.edges[0].node.rawText}
							</p>
						</Show>
					</div>
				</Show>
			</ErrorBoundary>
		</PageContent>
	)
}

export default AirportSearchDetail
