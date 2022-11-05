import { debounce } from '@solid-primitives/scheduled'
import { Meta, Title } from '@solidjs/meta'
import { useIsRouting, useNavigate, useParams } from '@solidjs/router'
import { Component, createEffect, createMemo, createSignal, ErrorBoundary, onCleanup, Show, untrack } from 'solid-js'
import WeatherElements from '../components/WeatherElements'
import { useGraphQL } from '../context/GraphQLClient'
import { AIRPORT_SINGLE } from '../queries/AirportQueries'
import { HiOutlineRefresh, HiSolidClock } from 'solid-icons/hi'
import { ImSpinner5 } from 'solid-icons/im'
import {
	GetSingleAirportQueryVariables,
	GetSingleAirportQuery,
	AirportSearchFragment,
} from '../queries/generated/graphql'
import Duration from '../models/duration'
import SearchBar from '../components/SearchBar'
import Logo from '../components/Logo'
import PageContent from '../layouts/PageContent'
import { IoLocationSharp } from 'solid-icons/io'
import { CgWebsite } from 'solid-icons/cg'
import { TbMountain } from 'solid-icons/tb'
import { FiExternalLink } from 'solid-icons/fi'
import { LinkTag, Tag } from '../components/Tag'

const AirportSearchDetail: Component = () => {
	const params = useParams()
	const navigate = useNavigate()
	const newQuery = useGraphQL()

	const [lastRefreshed, setLastRefreshed] = createSignal<Date>(new Date())
	const [airportIdentifier, setAirportIdentifier] = createSignal<GetSingleAirportQueryVariables | false>(false)
	const [airportRequest, { mutate, refetch: refetchAirport }] = newQuery<
		GetSingleAirportQuery,
		GetSingleAirportQueryVariables
	>(AIRPORT_SINGLE, () => airportIdentifier())

	const throttledLoading = debounce((id: string) => setAirportIdentifier({ identifier: id }), 100)

	const airport = createMemo((): AirportSearchFragment|undefined => {
		if (airportRequest() && airportRequest().getAirport) {
			return airportRequest().getAirport
		}

		return undefined
	})

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

	const navigateTo = (airportIdentifier: string) => {
		navigate(`/airport/${airportIdentifier}`)
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
		<PageContent>
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
						airport() !== undefined ||
						(airport() !== undefined && !airportRequest.loading && !airportRequest.error)
					}
					fallback={
						<div class="flex h-full justify-center text-gray-700 dark:text-white-dark">
							<ImSpinner5 class="m-auto w-16 animate-spin" size={36} />
						</div>
					}>
					<Title>
						{airport().icaoCode} / {airport().iataCode} - {airport().name} weather | metar.gg
					</Title>
					<Meta
						name="description"
						content={`Get the latest METAR information for ${airport().name} - ${
							airport().identifier
						} located in ${airport().municipality ? airport().municipality + ',' : ''} ${
							airport().country.name
						}.`}></Meta>
					<div class="mx-auto flex flex-col py-16 text-center dark:text-white-dark">
						<h2>
							{airport().icaoCode} <Show when={airport().iataCode}>/ {airport().iataCode}</Show>
						</h2>
						<span class="mt-1 text-lg">{airport().name}</span>

						<div class="flex max-w-md flex-wrap justify-center gap-2 pt-4">
							<Tag>
								<IoLocationSharp class="my-auto mr-1"></IoLocationSharp>
								<Show when={airport().municipality}>{airport().municipality},</Show>{' '}
								{airport().country.name}
							</Tag>
							<Show when={airport().elevation}>
								<Tag>
									<TbMountain class="my-auto mr-1" />
									Elevation {airport().elevation} ft
								</Tag>
							</Show>
							<Show when={airport().timezone}>
								<Tag>
									<HiSolidClock class="my-auto mr-1"></HiSolidClock>
									Local time{' '}
									{now().toLocaleTimeString([], {
										hour: 'numeric',
										minute: '2-digit',
										timeZone: airport().timezone,
									})}
								</Tag>
							</Show>
							<Show when={airport().website}>
								<LinkTag href={airport().website}>
									<CgWebsite class="my-auto mr-1" />
									Website
									<FiExternalLink class="my-auto ml-1" />
								</LinkTag>
							</Show>
						</div>
					</div>
					<div class="flex flex-col justify-between md:flex-row">
						<Show when={airport().station.metars.edges.length > 0}>
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
					<WeatherElements class="mt-4" airport={airport()}></WeatherElements>
					<div class="flex flex-col gap-4 py-16">
						<Show when={airport() && airport().station.metars.edges[0]}>
							<p aria-label="METAR" class="text-center text-xl dark:text-white-dark">
								{airport().station.metars.edges[0].node.rawText}
							</p>
						</Show>
					</div>
				</Show>
			</ErrorBoundary>
		</PageContent>
	)
}

export default AirportSearchDetail
