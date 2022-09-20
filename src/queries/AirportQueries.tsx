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

export const AIRPORT_DETAIL = gql`
	fragment Metar on Metar {
		observationTime
		rawText
		temperature
		dewpoint
		altimeter
		visibility
		windDirection
		windSpeed
		windGust
		skyConditions {
			skyCover
			cloudBase
		}
	}

	fragment AirportSearch on Airport {
		icaoCode
		iataCode
		name
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

	query GetAirports($search: String!) {
		getAirports(search: $search, hasWeather: true) {
			pageInfo {
				hasNextPage
				endCursor
			}
			totalCount
			edges {
				cursor
				node {
					...AirportSearch
				}
			}
		}
	}
`
