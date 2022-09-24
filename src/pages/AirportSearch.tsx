import SearchBar from '../components/SearchBar'
import { Outlet, Route, Routes, useNavigate, useParams } from '@solidjs/router'
import AirportSearchDetail from './AirportSearchDetail'

const AirportSearch = () => {
	const navigate = useNavigate()

	const doSearch = (airportIdentifier: string) => {
		if (airportIdentifier.length === 0) {
			// TODO return to search page
			return
		}

		navigate(`/${airportIdentifier}`)
	}

	return (
		<>
			<div class="flex flex-col gap-8 transition-all h-1/6 pt-8">
				<h2 class="text-center mt-auto">What's the weather like in...</h2>
				<SearchBar onSearch={doSearch}></SearchBar>
			</div>
			<div class="flex flex-col h-5/6 transition-all">
				<Routes>
					<Route path="/:airportIdentifier" component={AirportSearchDetail} />
				</Routes>
			</div>
		</>
	)
}

export default AirportSearch
