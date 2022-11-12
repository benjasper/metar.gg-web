import { gql } from '@solid-primitives/graphql'

export const AIRPORT_SEARCH = gql`
	query AirportSearch($search: String!) {
		getAirports(search: $search, hasWeather: true, first: 10) {
			pageInfo {
				hasNextPage
				endCursor
			}
			totalCount
			edges {
				cursor
				node {
					identifier
					icaoCode
					iataCode
					name
				}
			}
		}
	}
`

const WEATHER_FRAGMENT = gql`
	fragment Metar on Metar {
		observationTime
		importTime
		nextImportTimePrediction
		rawText
		temperature
		dewpoint
		altimeter
		visibility
		windDirection
		windSpeed
		windGust
		flightCategory
		presentWeather
		skyConditions {
			skyCover
			cloudBase
		}
	}

	fragment AirportWeather on Airport {
		station {
			metars(first: 1) {
				edges {
					node {
						...Metar
					}
				}
			}
		}
	}
`

export const AIRPORT_WEATHER = WEATHER_FRAGMENT + gql`
	query AirportWeather($icao: String!) {
		getAirport(icao: $icao) {
			...AirportWeather
		}
	}
`

export const AIRPORT_SINGLE = WEATHER_FRAGMENT + gql`
	fragment AirportSearch on Airport {
		identifier
		icaoCode
		iataCode
		name
		timezone
		elevation
		website
		runways(closed: false) {
			closed
			surface
			lowRunwayHeading
			lowRunwayIdentifier
			lowRunwayLatitude
			lowRunwayLongitude

			highRunwayHeading
			highRunwayIdentifier
			highRunwayLatitude
			highRunwayLongitude
		}
		municipality
		country {
			name
		}
		...AirportWeather
	}

	query GetSingleAirport($identifier: String!) {
		getAirport(identifier: $identifier) {
			...AirportSearch
		}
	}
`
