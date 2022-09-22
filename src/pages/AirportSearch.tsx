import { gql } from '@solid-primitives/graphql'
import { Transition } from 'solid-headless'
import { createSignal, onCleanup, createEffect, createMemo, createResource, Resource, Show, Suspense } from 'solid-js'
import { useGraphQL } from '../context/GraphQLClient'
import {
	Airport,
	AirportSearchFragment,
	GetSingleAirportQuery,
	GetSingleAirportQueryVariables,
} from '../queries/generated/graphql'
import SearchBar from '../components/SearchBar'
import { Outlet, Route, Routes, useNavigate, useParams } from '@solidjs/router'
import AirportSearchDetail from './AirportSearchDetail'

const AirportSearch = () => {
	const navigate = useNavigate()
	const params = useParams()
	const [airportIdentifier, setAirportIdentifier] = createSignal<string>('')

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			// TODO return to search page
			setAirportIdentifier('')
			return
		}

		setAirportIdentifier(airportIdentifier)
		navigate(`/${airportIdentifier}`)
	}

	return (
		<>
			<div class="flex flex-col gap-8 transition-all h-1/4">
				<h2 class="text-center mt-auto">What's the weather like in...</h2>
				<SearchBar onSearch={doSearch}></SearchBar>
			</div>
			<div class="flex flex-col h-3/4 transition-all">
				<Routes>
					<Route path="/:airportIdentifier" component={AirportSearchDetail} />
				</Routes>
			</div>
		</>
	)
}

export default AirportSearch
