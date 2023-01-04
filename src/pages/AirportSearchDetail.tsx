import { debounce } from '@solid-primitives/scheduled'
import { createScriptLoader } from '@solid-primitives/script-loader'
import { useNavigate, useParams } from '@solidjs/router'
import { CgWebsite } from 'solid-icons/cg'
import { FiExternalLink } from 'solid-icons/fi'
import { HiSolidClock } from 'solid-icons/hi'
import { ImSpinner5 } from 'solid-icons/im'
import { IoLocationSharp } from 'solid-icons/io'
import { TbMountain } from 'solid-icons/tb'
import { Component, createEffect, createMemo, createSignal, Match, onCleanup, Show, Switch } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import AirportClassification from '../components/AirportClassification'
import AirportsInVicinity from '../components/AirportsInVicinity'
import DarkModeToggle from '../components/DarkModeToggle'
import ForecastElements from '../components/ForecastElements'
import Logo from '../components/Logo'
import SearchBar from '../components/SearchBar'
import { LinkTag, Tag } from '../components/Tag'
import WeatherElements from '../components/WeatherElements'
import { useGraphQL } from '../context/GraphQLClient'
import { useTimeStore } from '../context/TimeStore'
import { useUnitStore } from '../context/UnitStore'
import PageContent from '../layouts/PageContent'
import { LengthUnit, PressureUnit, SpeedUnit } from '../models/units'
import { AIRPORT_SINGLE } from '../queries/AirportQueries'
import {
	AirportSearchFragment,
	GetSingleAirportQuery,
	GetSingleAirportQueryVariables,
} from '../queries/generated/graphql'

const AirportSearchDetail: Component = () => {
	const params = useParams()
	const navigate = useNavigate()
	const newQuery = useGraphQL()

	const [unitStore, { selectUnit }] = useUnitStore()
	const selectedHeightUnit = () => unitStore.height.units[unitStore.height.selected]

	const now = useTimeStore()

	const [airportStore, setAirportStore] = createStore<{ airport: AirportSearchFragment | undefined }>({
		airport: undefined,
	})

	const [lastRefreshed, setLastRefreshed] = createSignal<Date>(new Date())
	const [airportIdentifier, setAirportIdentifier] = createSignal<GetSingleAirportQueryVariables | false>(false)
	const [airportRequest, { mutate, refetch: refetchAirport }] = newQuery<
		GetSingleAirportQuery,
		GetSingleAirportQueryVariables
	>(AIRPORT_SINGLE, () => airportIdentifier())

	const throttledLoading = debounce((id: string) => setAirportIdentifier({ identifier: id }), 100)

	createEffect(() => {
		if (airportRequest() && airportRequest()!.getAirport) {
			setAirportStore(reconcile({ airport: airportRequest()!.getAirport! }))
		}
	})

	const title = createMemo(() => {
		if (airportStore.airport === undefined) {
			return `Loading ${params.airportIdentifier}...`
		}

		if (airportStore.airport.icaoCode && airportStore.airport.iataCode) {
			return `${airportStore.airport.icaoCode} / ${airportStore.airport.iataCode} - ${airportStore.airport.name} weather`
		}

		if (airportStore.airport.icaoCode) {
			return `${airportStore.airport.icaoCode} - ${airportStore.airport.name} weather`
		}

		if (airportStore.airport.iataCode) {
			return `${airportStore.airport.iataCode} - ${airportStore.airport.name} weather`
		}

		return `${airportStore.airport.identifier} - ${airportStore.airport.name} weather`
	})

	const description = createMemo(() => {
		return airportStore.airport
			? `Get real time METAR and TAF updates for ${airportStore.airport.name} (${
					airportStore.airport.identifier
			  }${airportStore.airport.iataCode ? ' / ' + airportStore.airport.iataCode : ''}) located in ${
					airportStore.airport.municipality ? airportStore.airport.municipality + ',' : ''
			  } ${airportStore.airport.country?.name ?? ''}.`
			: ''
	})

	const refetchInterval = setInterval(() => {
		refreshAirport()
	}, 1000 * 30)

	const doSearch = (airportIdentifier: string) => {
		setAirportStore('airport', undefined)
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

	createEffect(() => {
		// Check raw METAR for different units
		if (!airportStore.airport || airportStore.airport.station!.metars.edges.length === 0) {
			return
		}

		const rawMetar = airportStore.airport.station!.metars.edges[0].node.rawText

		// Check for visibility unit
		if (unitStore['length'].locked === '') {
			if (rawMetar.includes('SM')) {
				selectUnit('length', LengthUnit.Miles)
				selectUnit('smallLength', LengthUnit.Feet)
			} else {
				selectUnit('length', LengthUnit.Kilometers)
				selectUnit('smallLength', LengthUnit.Meters)
			}
		}

		// Check for wind speed unit
		if (unitStore['speed'].locked === '') {
			if (rawMetar.includes('MPS')) {
				selectUnit('speed', SpeedUnit.MetersPerSecond)
			} else {
				selectUnit('speed', SpeedUnit.Knots)
			}
		}

		// Check if altimeter is in inches
		if (unitStore['pressure'].locked === '') {
			const regexAltimeter = new RegExp(/A\d{4}/)
			if (regexAltimeter.test(rawMetar)) {
				selectUnit('pressure', PressureUnit.InchesOfMercury)
			} else {
				selectUnit('pressure', PressureUnit.Hectopascals)
			}
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
				addressCountry: airportStore.airport?.country?.name ?? '',
				addressLocality: airportStore.airport?.municipality ?? '',
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
		clearTimeout(refetchInterval)
		removeJsonLdAirport()
	})

	return (
		<PageContent title={title()} description={description()} contentFullHeight={true}>
			<div class="flex w-full flex-col justify-between gap-6 md:flex-row">
				<Logo class="mx-auto md:mx-0 md:w-1/4"></Logo>
				<SearchBar
					class="my-auto mb-auto flex-grow justify-center"
					onSearch={navigateTo}
					placeholder="Search for another airport"></SearchBar>
				<div class="flex flex-col items-end md:w-1/4">
					<DarkModeToggle class="hidden md:flex"></DarkModeToggle>
				</div>
			</div>
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
						<Switch>
							<Match when={airportStore.airport!.icaoCode && airportStore.airport!.iataCode}>
								{airportStore.airport!.icaoCode} / {airportStore.airport!.iataCode}
							</Match>
							<Match when={airportStore.airport!.icaoCode}>{airportStore.airport!.icaoCode}</Match>
							<Match when={airportStore.airport!.gpsCode}>{airportStore.airport!.gpsCode}</Match>
							<Match when={true}>{airportStore.airport!.identifier}</Match>
						</Switch>
					</h2>
					<span class="mt-1 text-lg">{airportStore.airport!.name}</span>

					<div class="flex max-w-md flex-wrap justify-center gap-2 pt-4">
						<Tag>
							<IoLocationSharp class="my-auto"></IoLocationSharp>
							<Show when={airportStore.airport!.municipality}>
								{airportStore.airport!.municipality},
							</Show>{' '}
							{airportStore.airport!.country!.name}
						</Tag>
						<Show when={airportStore.airport!.timezone}>
							<Tag>
								<HiSolidClock class="my-auto"></HiSolidClock>
								Local time{' '}
								{now().toLocaleTimeString([], {
									hour: 'numeric',
									minute: '2-digit',
									timeZone: airportStore.airport!.timezone ?? 'UTC',
								})}
							</Tag>
						</Show>
						<Tag>
							<AirportClassification type={airportStore.airport!.type}></AirportClassification>
						</Tag>
						<Show when={airportStore.airport!.elevation}>
							<Tag>
								<TbMountain class="my-auto" />
								Elevation{' '}
								{Math.round(
									selectedHeightUnit().conversionFunction(airportStore.airport!.elevation!)
								)}{' '}
								{selectedHeightUnit().symbol}
							</Tag>
						</Show>
						<Show when={airportStore.airport!.website}>
							<LinkTag href={airportStore.airport!.website!}>
								<CgWebsite class="my-auto" />
								Website
								<FiExternalLink class="my-auto" />
							</LinkTag>
						</Show>
					</div>
				</div>
				<WeatherElements airport={airportStore.airport!} lastRefreshed={lastRefreshed()}></WeatherElements>
				<ForecastElements
					airport={airportStore.airport!}
					taf={airportStore.airport!.station?.tafs.edges[0]?.node}></ForecastElements>
				<AirportsInVicinity
					airportCoordinates={{
						latitude: airportStore.airport!.latitude,
						longitude: airportStore.airport!.longitude,
					}}
					stations={airportStore.airport!.stationsVicinity}></AirportsInVicinity>
			</Show>
		</PageContent>
	)
}

export default AirportSearchDetail
