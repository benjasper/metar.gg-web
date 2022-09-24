export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
  Time: any;
};

export type Airport = {
  __typename?: 'Airport';
  country?: Maybe<Country>;
  /** Elevation of the airport, in feet. */
  elevation?: Maybe<Scalars['Int']>;
  frequencies?: Maybe<Array<Frequency>>;
  /** The code that an aviation GPS database (such as Jeppesen's or Garmin's) would normally use for the airport. This will always be the ICAO code if one exists. Note that, unlike the ident column, this is not guaranteed to be globally unique. */
  gpsCode?: Maybe<Scalars['String']>;
  /** The three-letter IATA code for the airport. */
  iataCode?: Maybe<Scalars['String']>;
  /** The four-letter ICAO code of the airport. */
  icaoCode?: Maybe<Scalars['String']>;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** This will be the ICAO code if available. Otherwise, it will be a local airport code (if no conflict), or if nothing else is available, an internally-generated code starting with the ISO2 country code, followed by a dash and a four-digit number. */
  identifier: Scalars['String'];
  /** The unique identifier of the import. */
  importID: Scalars['Int'];
  /** Extra keywords/phrases to assist with search. May include former names for the airport, alternate codes, names in other languages, nearby tourist destinations, etc. */
  keywords: Array<Scalars['String']>;
  /** The last time the record was updated/created. */
  lastUpdated: Scalars['Time'];
  /** Latitude of the airport in decimal degrees (positive is north). */
  latitude: Scalars['Float'];
  /** The local country code for the airport, if different from the gps_code and iata_code fields (used mainly for US airports). */
  localCode?: Maybe<Scalars['String']>;
  /** Longitude of the airport in decimal degrees (positive is east). */
  longitude: Scalars['Float'];
  /** The primary municipality that the airport serves (when available). Note that this is not necessarily the municipality where the airport is physically located. */
  municipality?: Maybe<Scalars['String']>;
  /** The official airport name, including "Airport", "Airstrip", etc. */
  name: Scalars['String'];
  region?: Maybe<Region>;
  /** Returns all Runways for this Airport. They can be filtered with the closed parameter. */
  runways: Array<Runway>;
  /** Whether the airport has scheduled airline service. */
  scheduledService: Scalars['Boolean'];
  station?: Maybe<WeatherStation>;
  /** Returns the closest weather stations to the airport, within the given radius (in km). */
  stationsVicinity: Array<StationWithDistance>;
  /** Type of airport. */
  type: AirportType;
  /** The URL of the airport's website. */
  website?: Maybe<Scalars['String']>;
  /** The URL of the airport's Wikipedia page. */
  wikipedia?: Maybe<Scalars['String']>;
};


export type AirportRunwaysArgs = {
  closed?: InputMaybe<Scalars['Boolean']>;
};


export type AirportStationsVicinityArgs = {
  first?: InputMaybe<Scalars['Int']>;
  radius?: InputMaybe<Scalars['Float']>;
};

export type AirportConnection = {
  __typename?: 'AirportConnection';
  /** List of airport edges. */
  edges: Array<AirportEdge>;
  /** Page info of this connection. */
  pageInfo: PageInfo;
  /** Total number of airports. */
  totalCount: Scalars['Int'];
};

export type AirportEdge = {
  __typename?: 'AirportEdge';
  /** The cursor of this airport. */
  cursor: Scalars['Cursor'];
  /** The airport object. */
  node: Airport;
};

/** AirportType is enum for the field type */
export enum AirportType {
  ClosedAirport = 'closed_airport',
  Heliport = 'heliport',
  LargeAirport = 'large_airport',
  MediumAirport = 'medium_airport',
  SeaplaneBase = 'seaplane_base',
  SmallAirport = 'small_airport'
}

export type Country = {
  __typename?: 'Country';
  /** The ISO 3166-1 alpha-2 code of the country. A handful of unofficial, non-ISO codes are also in use, such as "XK" for Kosovo. */
  code: Scalars['String'];
  /** Where the airport is (primarily) located. */
  continent: CountryContinent;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The unique identifier of the import. */
  importID: Scalars['Int'];
  /** Keywords that can be used to search for the country. */
  keywords: Array<Scalars['String']>;
  /** The last time the record was updated/created. */
  lastUpdated: Scalars['Time'];
  /** The name of the country. */
  name: Scalars['String'];
  /** The wikipedia link of the country. */
  wikipediaLink: Scalars['String'];
};

/** CountryContinent is enum for the field continent */
export enum CountryContinent {
  Af = 'AF',
  An = 'AN',
  As = 'AS',
  Eu = 'EU',
  Na = 'NA',
  Oc = 'OC',
  Sa = 'SA'
}

export type Forecast = {
  __typename?: 'Forecast';
  /** The altimeter in inches of mercury. */
  altimeter?: Maybe<Scalars['Float']>;
  /** The change indicator. */
  changeIndicator?: Maybe<ForecastChangeIndicator>;
  /** The probability of the change. */
  changeProbability?: Maybe<Scalars['Int']>;
  /** The time of the change. */
  changeTime?: Maybe<Scalars['Time']>;
  /** The start time of the forecast period. */
  fromTime: Scalars['Time'];
  icingConditions?: Maybe<Array<IcingCondition>>;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The not decoded string. */
  notDecoded?: Maybe<Scalars['String']>;
  skyConditions?: Maybe<Array<SkyCondition>>;
  temperatureData?: Maybe<Array<TemperatureData>>;
  /** The end time of the forecast period. */
  toTime: Scalars['Time'];
  turbulenceConditions?: Maybe<Array<TurbulenceCondition>>;
  /** The visibility in statute miles. */
  visibilityHorizontal?: Maybe<Scalars['Float']>;
  /** The vertical visibility in feet. */
  visibilityVertical?: Maybe<Scalars['Int']>;
  /** The weather string. */
  weather?: Maybe<Scalars['String']>;
  /** The wind direction in degrees. */
  windDirection?: Maybe<Scalars['Int']>;
  /** The wind gust in knots. */
  windGust?: Maybe<Scalars['Int']>;
  /** The wind shear direction in degrees. */
  windShearDirection?: Maybe<Scalars['Int']>;
  /** The height of the wind shear in feet above ground level. */
  windShearHeight?: Maybe<Scalars['Int']>;
  /** The wind shear speed in knots. */
  windShearSpeed?: Maybe<Scalars['Int']>;
  /** The wind speed in knots. */
  windSpeed?: Maybe<Scalars['Int']>;
};

/** ForecastChangeIndicator is enum for the field change_indicator */
export enum ForecastChangeIndicator {
  Becmg = 'BECMG',
  Fm = 'FM',
  Prob = 'PROB',
  Tempo = 'TEMPO'
}

export type Frequency = {
  __typename?: 'Frequency';
  airport?: Maybe<Airport>;
  /** A description of the frequency. */
  description: Scalars['String'];
  /** Radio frequency in megahertz. Note that the same frequency may appear multiple times for an airport, serving different functions */
  frequency: Scalars['Float'];
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The unique identifier of the import. */
  importID: Scalars['Int'];
  /** The last time the record was updated/created. */
  lastUpdated: Scalars['Time'];
  /** A code for the frequency type. Some common values are "TWR" (tower), "ATF" or "CTAF" (common traffic frequency), "GND" (ground control), "RMP" (ramp control), "ATIS" (automated weather), "RCO" (remote radio outlet), "ARR" (arrivals), "DEP" (departures), "UNICOM" (monitored ground station), and "RDO" (a flight-service station). */
  type: Scalars['String'];
};

export type IcingCondition = {
  __typename?: 'IcingCondition';
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The intensity of the icing. */
  intensity: Scalars['String'];
  /** The maximum altitude in feet that the icing is present. */
  maxAltitude?: Maybe<Scalars['Int']>;
  /** The minimum altitude in feet that the icing is present. */
  minAltitude?: Maybe<Scalars['Int']>;
};

export type Metar = {
  __typename?: 'Metar';
  /** The altimeter setting in inches of mercury. */
  altimeter: Scalars['Float'];
  /** The dewpoint in Celsius. */
  dewpoint: Scalars['Float'];
  flightCategory?: Maybe<MetarFlightCategory>;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The maximum air temperature in Celsius from the past 6 hours. */
  maxTemp6?: Maybe<Scalars['Float']>;
  /** The maximum air temperature in Celsius from the past 24 hours. */
  maxTemp24?: Maybe<Scalars['Float']>;
  /** The type of METAR. */
  metarType: MetarMetarType;
  /** The minimum air temperature in Celsius from the past 6 hours. */
  minTemp6?: Maybe<Scalars['Float']>;
  /** The minimum air temperature in Celsius from the past 24 hours. */
  minTemp24?: Maybe<Scalars['Float']>;
  /** The time the METAR was observed. */
  observationTime: Scalars['Time'];
  /** The precipitation in inches from since the last observation. 0.0005 in = trace precipitation. */
  precipitation?: Maybe<Scalars['Float']>;
  /** The precipitation in inches from the past 3 hours. 0.0005 in = trace precipitation. */
  precipitation3?: Maybe<Scalars['Float']>;
  /** The precipitation in inches from the past 6 hours. 0.0005 in = trace precipitation. */
  precipitation6?: Maybe<Scalars['Float']>;
  /** The precipitation in inches from the past 24 hours. 0.0005 in = trace precipitation. */
  precipitation24?: Maybe<Scalars['Float']>;
  /** The present weather string. */
  presentWeather?: Maybe<Scalars['String']>;
  /** The pressur_6e tendency in hectopascals. */
  pressureTendency?: Maybe<Scalars['Float']>;
  /** Whether it's an automated station, of one of the following types A01|A01A|A02|A02A|AOA|AWOS. */
  qualityControlAutoStation: Scalars['Boolean'];
  /** Quality control corrected. */
  qualityControlCorrected?: Maybe<Scalars['Boolean']>;
  /** Whether Freezing rain sensor is off. */
  qualityControlFreezingRainSensorOff: Scalars['Boolean'];
  /** Whether Lightning sensor is off. */
  qualityControlLightningSensorOff: Scalars['Boolean'];
  /** Maintenance check indicator - maintenance is needed. */
  qualityControlMaintenanceIndicatorOn: Scalars['Boolean'];
  /** No signal. */
  qualityControlNoSignal: Scalars['Boolean'];
  /** Whether Present weather sensor is off. */
  qualityControlPresentWeatherSensorOff: Scalars['Boolean'];
  /** The raw METAR text. */
  rawText: Scalars['String'];
  /** The sea level pressure in hectopascals. */
  seaLevelPressure?: Maybe<Scalars['Float']>;
  skyConditions?: Maybe<Array<SkyCondition>>;
  /** The snow depth in inches. */
  snowDepth?: Maybe<Scalars['Float']>;
  station: WeatherStation;
  /** The temperature in Celsius. */
  temperature: Scalars['Float'];
  /** The vertical visibility in feet. */
  vertVis?: Maybe<Scalars['Float']>;
  /** The visibility in statute miles. */
  visibility: Scalars['Float'];
  /** The wind direction in degrees, or 0 if calm. */
  windDirection: Scalars['Int'];
  /** The wind gust in knots. */
  windGust: Scalars['Int'];
  /** The wind speed in knots, or 0 if calm. */
  windSpeed: Scalars['Int'];
};

export type MetarConnection = {
  __typename?: 'MetarConnection';
  /** List of metar edges. */
  edges: Array<MetarEdge>;
  /** Page info of this connection. */
  pageInfo: PageInfo;
  /** Total number of airports. */
  totalCount: Scalars['Int'];
};

export type MetarEdge = {
  __typename?: 'MetarEdge';
  /** The cursor of this metar. */
  cursor: Scalars['Cursor'];
  /** The metar object. */
  node: Metar;
};

/** MetarFlightCategory is enum for the field flight_category */
export enum MetarFlightCategory {
  Ifr = 'IFR',
  Lifr = 'LIFR',
  Mvfr = 'MVFR',
  Vfr = 'VFR'
}

/** MetarMetarType is enum for the field metar_type */
export enum MetarMetarType {
  Metar = 'METAR',
  Speci = 'SPECI'
}

/** Possible directions in which to order a list of items when provided an `orderBy` argument. */
export enum OrderDirection {
  /** Specifies an ascending order for a given `orderBy` argument. */
  Asc = 'ASC',
  /** Specifies a descending order for a given `orderBy` argument. */
  Desc = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor to the last element of the current page. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** Whether there is at least one more page. */
  hasNextPage: Scalars['Boolean'];
  /** Whether there is a previous page. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor to the first element of the current page. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type Query = {
  __typename?: 'Query';
  /** Get a single airport by it's id, identifier, icao code or iata code. */
  getAirport?: Maybe<Airport>;
  /** Search for airports by a variety of criteria. */
  getAirports: AirportConnection;
  /** Get a single weather station by it's id or identifier. */
  getStation?: Maybe<WeatherStation>;
  /** Search for weather stations by it's identifier. */
  getStations: WeatherStationConnection;
};


export type QueryGetAirportArgs = {
  iata?: InputMaybe<Scalars['String']>;
  icao?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  identifier?: InputMaybe<Scalars['String']>;
};


export type QueryGetAirportsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  hasWeather?: InputMaybe<Scalars['Boolean']>;
  iata?: InputMaybe<Scalars['String']>;
  icao?: InputMaybe<Scalars['String']>;
  identifier?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<AirportType>;
};


export type QueryGetStationArgs = {
  id?: InputMaybe<Scalars['String']>;
  identifier?: InputMaybe<Scalars['String']>;
};


export type QueryGetStationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  identifier?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type Region = {
  __typename?: 'Region';
  /** local_code prefixed with the country code to make a globally-unique identifier. */
  code: Scalars['String'];
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The unique identifier of the import. */
  importID: Scalars['Int'];
  /** Keywords that can be used to search for the region. */
  keywords: Array<Scalars['String']>;
  /** The last time the record was updated/created. */
  lastUpdated: Scalars['Time'];
  /** The local code for the administrative subdivision. Whenever possible, these are official ISO 3166:2, at the highest level available, but in some cases OurAirports has to use unofficial codes. There is also a pseudo code "U-A" for each country, which means that the airport has not yet been assigned to a region (or perhaps can't be, as in the case of a deep-sea oil platform). */
  localCode: Scalars['String'];
  name: Scalars['String'];
  /** The wikipedia link of the region. */
  wikipediaLink: Scalars['String'];
};

export type Runway = {
  __typename?: 'Runway';
  airport?: Maybe<Airport>;
  /** Whether the runway is currently closed or not. */
  closed: Scalars['Boolean'];
  /** Displaced threshold length of the higher numbered runway end, in feet. */
  highRunwayDisplacedThreshold?: Maybe<Scalars['Int']>;
  /** Elevation of the high numbered runway end, in feet. */
  highRunwayElevation?: Maybe<Scalars['Int']>;
  /** True (not magnetic) heading of the higher numbered runway. */
  highRunwayHeading?: Maybe<Scalars['Float']>;
  /** High numbered runway identifier, like 01L. */
  highRunwayIdentifier: Scalars['String'];
  /** Latitude of the high numbered runway end, in decimal degrees (positive is north). */
  highRunwayLatitude?: Maybe<Scalars['Float']>;
  /** Longitude of the high numbered runway end, in decimal degrees (positive is east). */
  highRunwayLongitude?: Maybe<Scalars['Float']>;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The unique identifier of the import. */
  importID: Scalars['Int'];
  /** The last time the record was updated/created. */
  lastUpdated: Scalars['Time'];
  /** Length of the runway in feet. */
  length: Scalars['Int'];
  /** Whether the runway is lighted at night or not. */
  lighted: Scalars['Boolean'];
  /** Displaced threshold length of the lower numbered runway end, in feet. */
  lowRunwayDisplacedThreshold?: Maybe<Scalars['Int']>;
  /** Elevation of the low numbered runway end, in feet. */
  lowRunwayElevation?: Maybe<Scalars['Int']>;
  /** True (not magnetic) heading of the lower numbered runway. */
  lowRunwayHeading?: Maybe<Scalars['Float']>;
  /** Low numbered runway identifier, like 18R. */
  lowRunwayIdentifier: Scalars['String'];
  /** Latitude of the low numbered runway end, in decimal degrees (positive is north). */
  lowRunwayLatitude?: Maybe<Scalars['Float']>;
  /** Longitude of the low numbered runway end, in decimal degrees (positive is east). */
  lowRunwayLongitude?: Maybe<Scalars['Float']>;
  /** Code for the runway surface type. This is not yet a controlled vocabulary, but probably will be soon. Some common values include "ASP" (asphalt), "TURF" (turf), "CON" (concrete), "GRS" (grass), "GRE" (gravel), "WATER" (water), and "UNK" (unknown). */
  surface?: Maybe<Scalars['String']>;
  /** Width of the runway surface in feet. */
  width: Scalars['Int'];
};

export type SkyCondition = {
  __typename?: 'SkyCondition';
  /** Cloud base in feet. */
  cloudBase?: Maybe<Scalars['Int']>;
  /** Cloud type. Only present in TAFs. */
  cloudType?: Maybe<SkyConditionCloudType>;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  skyCover: SkyConditionSkyCover;
};

/** SkyConditionCloudType is enum for the field cloud_type */
export enum SkyConditionCloudType {
  Cb = 'CB',
  Cu = 'CU',
  Tcu = 'TCU'
}

/** SkyConditionSkyCover is enum for the field sky_cover */
export enum SkyConditionSkyCover {
  Bkn = 'BKN',
  Cavok = 'CAVOK',
  Clr = 'CLR',
  Few = 'FEW',
  Nsc = 'NSC',
  Ovc = 'OVC',
  Ovcx = 'OVCX',
  Ovx = 'OVX',
  Sct = 'SCT',
  Skc = 'SKC'
}

export type StationWithDistance = {
  __typename?: 'StationWithDistance';
  /** The distance in meters from the given location to the airport. */
  distance: Scalars['Float'];
  /** The METAR for the station. */
  station: WeatherStation;
};

export type Taf = {
  __typename?: 'Taf';
  /** TAF bulletin time. */
  bulletinTime: Scalars['Time'];
  forecast?: Maybe<Array<Forecast>>;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The time the TAF was issued. */
  issueTime: Scalars['Time'];
  /** The raw TAF text. */
  rawText: Scalars['String'];
  /** Remarks. */
  remarks: Scalars['String'];
  skyConditions?: Maybe<Array<SkyCondition>>;
  station: WeatherStation;
  /** The start time of the TAF validity period. */
  validFromTime: Scalars['Time'];
  /** The end time of the TAF validity period. */
  validToTime: Scalars['Time'];
};

export type TafConnection = {
  __typename?: 'TafConnection';
  /** List of taf edges. */
  edges: Array<TafEdge>;
  /** Page info of this connection. */
  pageInfo: PageInfo;
  /** Total number of tafs. */
  totalCount: Scalars['Int'];
};

export type TafEdge = {
  __typename?: 'TafEdge';
  /** The cursor of this taf. */
  cursor: Scalars['Cursor'];
  /** The taf object. */
  node: Taf;
};

/** Ordering options for Taf connections */
export type TafOrder = {
  /** The ordering direction. */
  direction?: OrderDirection;
  /** The field by which to order Tafs. */
  field: TafOrderField;
};

/** Properties by which Taf connections can be ordered. */
export enum TafOrderField {
  ValidFromTime = 'valid_from_time'
}

export type TemperatureData = {
  __typename?: 'TemperatureData';
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The maximum temperature in degrees Celsius. */
  maxTemperature?: Maybe<Scalars['Float']>;
  /** The minimum temperature in degrees Celsius. */
  minTemperature?: Maybe<Scalars['Float']>;
  /** The surface temperature in degrees Celsius. */
  temperature: Scalars['Float'];
  /** The time the temperature data is valid. */
  validTime: Scalars['Time'];
};

export type TurbulenceCondition = {
  __typename?: 'TurbulenceCondition';
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The intensity of the turbulence. */
  intensity: Scalars['String'];
  /** The maximum altitude in feet that the turbulence is present. */
  maxAltitude: Scalars['Int'];
  /** The minimum altitude in feet that the turbulence is present. */
  minAltitude: Scalars['Int'];
};

export type WeatherStation = {
  __typename?: 'WeatherStation';
  airport?: Maybe<Airport>;
  /** The elevation in meters of the station. */
  elevation?: Maybe<Scalars['Float']>;
  /** The unique identifier of the record. */
  id: Scalars['ID'];
  /** The latitude in decimal degrees of the station. */
  latitude?: Maybe<Scalars['Float']>;
  /** The longitude in decimal degrees of the station. */
  longitude?: Maybe<Scalars['Float']>;
  /** Returns the latest METARs for this station sorted by their observation time. */
  metars: MetarConnection;
  /** The ICAO identifier of the station that provided the weather data or identifier of the weather station. */
  stationID: Scalars['String'];
  /** Returns the latest TAFs for this station sorted by their issued time. */
  tafs: TafConnection;
};


export type WeatherStationMetarsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type WeatherStationTafsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type WeatherStationConnection = {
  __typename?: 'WeatherStationConnection';
  /** List of weather station edges. */
  edges: Array<WeatherStationEdge>;
  /** Page info of this connection. */
  pageInfo: PageInfo;
  /** Total number of weather stations. */
  totalCount: Scalars['Int'];
};

export type WeatherStationEdge = {
  __typename?: 'WeatherStationEdge';
  /** The cursor of this weather station. */
  cursor: Scalars['Cursor'];
  /** The weather station object. */
  node: WeatherStation;
};

export type AirportSearchQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type AirportSearchQuery = { __typename?: 'Query', getAirports: { __typename?: 'AirportConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, edges: Array<{ __typename?: 'AirportEdge', cursor: any, node: { __typename?: 'Airport', identifier: string, icaoCode?: string | null, iataCode?: string | null, name: string } }> } };

export type MetarFragment = { __typename?: 'Metar', observationTime: any, rawText: string, temperature: number, dewpoint: number, altimeter: number, visibility: number, windDirection: number, windSpeed: number, windGust: number, flightCategory?: MetarFlightCategory | null, presentWeather?: string | null, skyConditions?: Array<{ __typename?: 'SkyCondition', skyCover: SkyConditionSkyCover, cloudBase?: number | null }> | null };

export type AirportSearchFragment = { __typename?: 'Airport', identifier: string, icaoCode?: string | null, iataCode?: string | null, name: string, municipality?: string | null, runways: Array<{ __typename?: 'Runway', closed: boolean, surface?: string | null, lowRunwayHeading?: number | null, lowRunwayIdentifier: string, lowRunwayLatitude?: number | null, lowRunwayLongitude?: number | null, highRunwayHeading?: number | null, highRunwayIdentifier: string, highRunwayLatitude?: number | null, highRunwayLongitude?: number | null }>, country?: { __typename?: 'Country', name: string } | null, station?: { __typename?: 'WeatherStation', metars: { __typename?: 'MetarConnection', edges: Array<{ __typename?: 'MetarEdge', node: { __typename?: 'Metar', observationTime: any, rawText: string, temperature: number, dewpoint: number, altimeter: number, visibility: number, windDirection: number, windSpeed: number, windGust: number, flightCategory?: MetarFlightCategory | null, presentWeather?: string | null, skyConditions?: Array<{ __typename?: 'SkyCondition', skyCover: SkyConditionSkyCover, cloudBase?: number | null }> | null } }> } } | null };

export type GetSingleAirportQueryVariables = Exact<{
  identifier: Scalars['String'];
}>;


export type GetSingleAirportQuery = { __typename?: 'Query', getAirport?: { __typename?: 'Airport', identifier: string, icaoCode?: string | null, iataCode?: string | null, name: string, municipality?: string | null, runways: Array<{ __typename?: 'Runway', closed: boolean, surface?: string | null, lowRunwayHeading?: number | null, lowRunwayIdentifier: string, lowRunwayLatitude?: number | null, lowRunwayLongitude?: number | null, highRunwayHeading?: number | null, highRunwayIdentifier: string, highRunwayLatitude?: number | null, highRunwayLongitude?: number | null }>, country?: { __typename?: 'Country', name: string } | null, station?: { __typename?: 'WeatherStation', metars: { __typename?: 'MetarConnection', edges: Array<{ __typename?: 'MetarEdge', node: { __typename?: 'Metar', observationTime: any, rawText: string, temperature: number, dewpoint: number, altimeter: number, visibility: number, windDirection: number, windSpeed: number, windGust: number, flightCategory?: MetarFlightCategory | null, presentWeather?: string | null, skyConditions?: Array<{ __typename?: 'SkyCondition', skyCover: SkyConditionSkyCover, cloudBase?: number | null }> | null } }> } } | null } | null };


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    