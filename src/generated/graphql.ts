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
  /** Where the airport is (primarily) located. */
  continent: AirportContinent;
  country: Scalars['String'];
  /** Elevation of the airport, in feet. */
  elevation?: Maybe<Scalars['Int']>;
  frequencies?: Maybe<Array<Frequency>>;
  /** The code that an aviation GPS database (such as Jeppesen's or Garmin's) would normally use for the airport. This will always be the ICAO code if one exists. Note that, unlike the ident column, this is not guaranteed to be globally unique. */
  gpsCode?: Maybe<Scalars['String']>;
  /** Whether the airport has weather reporting and a metar by the airport is available. */
  hasWeather: Scalars['Boolean'];
  /** The three-letter IATA code for the airport. */
  iataCode?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** This will be the ICAO code if available. Otherwise, it will be a local airport code (if no conflict), or if nothing else is available, an internally-generated code starting with the ISO2 country code, followed by a dash and a four-digit number. */
  identifier: Scalars['String'];
  /** Extra keywords/phrases to assist with search. May include former names for the airport, alternate codes, names in other languages, nearby tourist destinations, etc. */
  keywords: Array<Scalars['String']>;
  lastUpdated: Scalars['Time'];
  /** Latitude of the airport in decimal degrees (positive is north). */
  latitude: Scalars['Float'];
  /** The local country code for the airport, if different from the gps_code and iata_code fields (used mainly for US airports). */
  localCode?: Maybe<Scalars['String']>;
  /** Longitude of the airport in decimal degrees (positive is east). */
  longitude: Scalars['Float'];
  /** Returns last METARs reported by this airport. */
  metars: MetarConnection;
  /** Returns the closest METAR to the airport, within the given radius (in km). */
  metarsVicinity: Array<MetarWithDistance>;
  /** The primary municipality that the airport serves (when available). Note that this is not necessarily the municipality where the airport is physically located. */
  municipality?: Maybe<Scalars['String']>;
  /** The official airport name, including "Airport", "Airstrip", etc. */
  name: Scalars['String'];
  region: Scalars['String'];
  /** Returns all Runways for this Airport. They can be filtered with the closed parameter. */
  runways: Array<Runway>;
  /** Whether the airport has scheduled airline service. */
  scheduledService: Scalars['Boolean'];
  /** Type of airport. */
  type: AirportType;
  /** The URL of the airport's website. */
  website?: Maybe<Scalars['String']>;
  /** The URL of the airport's Wikipedia page. */
  wikipedia?: Maybe<Scalars['String']>;
};


export type AirportMetarsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AirportMetarsVicinityArgs = {
  first?: InputMaybe<Scalars['Int']>;
  radius?: InputMaybe<Scalars['Float']>;
};


export type AirportRunwaysArgs = {
  closed?: InputMaybe<Scalars['Boolean']>;
};

export type AirportConnection = {
  __typename?: 'AirportConnection';
  edges: Array<AirportEdge>;
  /** A structured list of the edges without a cursor. Use this to quickly explore the API. */
  nodes: Array<Airport>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** AirportContinent is enum for the field continent */
export enum AirportContinent {
  Af = 'AF',
  An = 'AN',
  As = 'AS',
  Eu = 'EU',
  Na = 'NA',
  Oc = 'OC',
  Sa = 'SA'
}

export type AirportEdge = {
  __typename?: 'AirportEdge';
  cursor: Scalars['Cursor'];
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

export type Frequency = {
  __typename?: 'Frequency';
  airport?: Maybe<Airport>;
  /** A description of the frequency. */
  description: Scalars['String'];
  /** Radio frequency in megahertz. Note that the same frequency may appear multiple times for an airport, serving different functions */
  frequency: Scalars['Float'];
  id: Scalars['ID'];
  lastUpdated: Scalars['Time'];
  /** A code for the frequency type. Some common values are "TWR" (tower), "ATF" or "CTAF" (common traffic frequency), "GND" (ground control), "RMP" (ramp control), "ATIS" (automated weather), "RCO" (remote radio outlet), "ARR" (arrivals), "DEP" (departures), "UNICOM" (monitored ground station), and "RDO" (a flight-service station). */
  type: Scalars['String'];
};

export type Metar = {
  __typename?: 'Metar';
  airport?: Maybe<Airport>;
  /** The altimeter setting in inches of mercury. */
  altimeter: Scalars['Float'];
  /** The dewpoint in Celsius. */
  dewpoint: Scalars['Float'];
  /** The elevation in meters of the station. */
  elevation?: Maybe<Scalars['Float']>;
  flightCategory?: Maybe<MetarFlightCategory>;
  /** The latitude in decimal degrees of the station. */
  latitude?: Maybe<Scalars['Float']>;
  /** The longitude in decimal degrees of the station. */
  longitude?: Maybe<Scalars['Float']>;
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
  /** The precipitation in inches from since the last observation. 0.0005 in = trace precipitation */
  precipitation?: Maybe<Scalars['Float']>;
  /** The precipitation in inches from the past 3 hours. 0.0005 in = trace precipitation */
  precipitation3?: Maybe<Scalars['Float']>;
  /** The precipitation in inches from the past 6 hours. 0.0005 in = trace precipitation */
  precipitation6?: Maybe<Scalars['Float']>;
  /** The precipitation in inches from the past 24 hours. 0.0005 in = trace precipitation */
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
  /** The sea level pressure in hectopascal.s */
  seaLevelPressure?: Maybe<Scalars['Float']>;
  skyConditions?: Maybe<Array<SkyCondition>>;
  /** The snow depth in inches. */
  snowDepth?: Maybe<Scalars['Float']>;
  /** The ICAO identifier of the station that provided the METAR or identifier of the weather station. */
  stationID: Scalars['String'];
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
  edges: Array<MetarEdge>;
  /** A structured list of the edges without a cursor. Use this to quickly explore the API. */
  nodes: Array<Metar>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MetarEdge = {
  __typename?: 'MetarEdge';
  cursor: Scalars['Cursor'];
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

export type MetarWithDistance = {
  __typename?: 'MetarWithDistance';
  distance?: Maybe<Scalars['Float']>;
  metar?: Maybe<Metar>;
};

/** Possible directions in which to order a list of items when provided an `orderBy` argument. */
export enum OrderDirection {
  /** Specifies an ascending order for a given `orderBy` argument. */
  Asc = 'ASC',
  /** Specifies a descending order for a given `orderBy` argument. */
  Desc = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor to the last element of the current page */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** Whether there is at least one more page */
  hasNextPage: Scalars['Boolean'];
  /** Whether there is a previous page */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor to the first element of the current page */
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type Query = {
  __typename?: 'Query';
  getAirports: AirportConnection;
};


export type QueryGetAirportsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  hasWeather?: InputMaybe<Scalars['Boolean']>;
  identifier?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
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
  id: Scalars['ID'];
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
  metar: Metar;
  skyCover: SkyConditionSkyCover;
};

/** SkyConditionSkyCover is enum for the field sky_cover */
export enum SkyConditionSkyCover {
  Bkn = 'BKN',
  Cavok = 'CAVOK',
  Clr = 'CLR',
  Few = 'FEW',
  Ovc = 'OVC',
  Ovx = 'OVX',
  Sct = 'SCT',
  Skc = 'SKC'
}

export type AirportSearchFragment = { __typename?: 'Airport', identifier: string, name: string, runways: Array<{ __typename?: 'Runway', closed: boolean, surface?: string | null, lowRunwayHeading?: number | null, lowRunwayIdentifier: string, lowRunwayLatitude?: number | null, lowRunwayLongitude?: number | null, highRunwayHeading?: number | null, highRunwayIdentifier: string, highRunwayLatitude?: number | null, highRunwayLongitude?: number | null }> };

export type GetAirportsQueryVariables = Exact<{
  identifier: Scalars['String'];
}>;


export type GetAirportsQuery = { __typename?: 'Query', getAirports: { __typename?: 'AirportConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, edges: Array<{ __typename?: 'AirportEdge', cursor: any, node: { __typename?: 'Airport', identifier: string, name: string, runways: Array<{ __typename?: 'Runway', closed: boolean, surface?: string | null, lowRunwayHeading?: number | null, lowRunwayIdentifier: string, lowRunwayLatitude?: number | null, lowRunwayLongitude?: number | null, highRunwayHeading?: number | null, highRunwayIdentifier: string, highRunwayLatitude?: number | null, highRunwayLongitude?: number | null }> } }> } };


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    