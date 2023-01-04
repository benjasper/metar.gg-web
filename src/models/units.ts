// Unit symbols from https://en.wikipedia.org/wiki/International_System_of_Units
// Speed
enum SpeedUnit {
	Knots = 'kt',
	MilesPerHour = 'mph',
	KilometersPerHour = 'km/h',
	MetersPerSecond = 'm/s',
	Beaufort = 'Bft',
}

// Length
enum LengthUnit {
	Miles = 'mi',
	Feet = 'ft',
	Kilometers = 'km',
	Meters = 'm',
	NauticalMiles = 'NM',
}

// Height
enum HeightUnit {
	Feet = 'ft',
	Meters = 'm',
	Kilometers = 'km',
}

// Temperature
enum TemperatureUnit {
	Fahrenheit = '°F',
	Celsius = '°C',
	Kelvin = 'K',
}

// Pressure
enum PressureUnit {
	InchesOfMercury = 'inHg',
	Hectopascals = 'hPa',
}

type UnitType = SpeedUnit | LengthUnit | HeightUnit | TemperatureUnit | PressureUnit

interface Unit {
	symbol: UnitType
	name: string

	/**
	 * The function that converts the value to the specified unit from the base unit
	 */
	conversionFunction: (value: number) => number
}

interface UnitConfiguration {
	selected: number
	locked: string
	units: Unit[]
}

export { SpeedUnit, LengthUnit, HeightUnit, TemperatureUnit, PressureUnit }
export type { Unit, UnitConfiguration, UnitType }
