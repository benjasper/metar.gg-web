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
	fragment SkyCondition on SkyCondition {
		skyCover
		cloudType
		cloudBase
	}

	fragment Forecast on Forecast {
		fromTime
		toTime
		changeIndicator
		changeTime
		changeProbability
		windDirection
		windShearDirection
		weather
		skyConditions {
			skyCover
			cloudType
			cloudBase(unit: FOOT)
		}
		turbulenceConditions {
			intensity
			minAltitude(unit: FOOT)
			maxAltitude(unit: FOOT)
		}
		icingConditions {
			intensity
			minAltitude(unit: FOOT)
			maxAltitude(unit: FOOT)
		}
		temperatureData {
			validTime
			temperature(unit: CELSIUS)
			minTemperature(unit: CELSIUS)
			maxTemperature(unit: CELSIUS)
		}
		altimeter(unit: HECTOPASCAL)
		windSpeed(unit: KNOT)
		windGust(unit: KNOT)
		visibilityHorizontal(unit: KILOMETER)
		visibilityVertical(unit: FOOT)
		windShearHeight(unit: FOOT)
		windShearSpeed(unit: KNOT)
	}

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
			...SkyCondition
		}
	}

	fragment Taf on Taf {
		bulletinTime
		rawText
		remarks
		validFromTime
		validToTime
		forecast {
			...Forecast
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
			tafs(first: 1) {
				edges {
					node {
						...Taf
					}
				}
			}
		}
	}
`

export const AIRPORT_WEATHER =
	WEATHER_FRAGMENT +
	gql`
		query AirportWeather($icao: String!) {
			getAirport(icao: $icao) {
				...AirportWeather
			}
		}
	`

export const AIRPORT_SINGLE =
	WEATHER_FRAGMENT +
	gql`
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
