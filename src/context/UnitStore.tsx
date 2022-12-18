import { createContext, ParentComponent, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { UnitConfiguration, Unit, SpeedUnit, LengthUnit, HeightUnit, TemperatureUnit, PressureUnit } from '../models/units'

interface UnitStore {
	speed: UnitConfiguration
	length: UnitConfiguration
	height: UnitConfiguration
	temperature: UnitConfiguration
	pressure: UnitConfiguration
}

const createUnitStore = () => {
	const knots: Unit = {
		symbol: SpeedUnit.Knots,
		name: 'Knots',
		conversionFunction: (value: number) => value,
	}

	const milesPerHour: Unit = {
		symbol: SpeedUnit.MilesPerHour,
		name: 'Miles per hour',
		conversionFunction: (value: number) => value * 1.15078,
	}

	const kilometersPerHour: Unit = {
		symbol: SpeedUnit.KilometersPerHour,
		name: 'Kilometers per hour',
		conversionFunction: (value: number) => value * 1.852,
	}

	const metersPerSecond: Unit = {
		symbol: SpeedUnit.MetersPerSecond,
		name: 'Meters per second',
		conversionFunction: (value: number) => value * 0.514444,
	}

	const kilometers: Unit = {
		symbol: LengthUnit.Kilometers,
		name: 'Kilometers',
		conversionFunction: (value: number) => value,
	}

	const meters: Unit = {
		symbol: LengthUnit.Meters,
		name: 'Meters',
		conversionFunction: (value: number) => value * 1000,
	}

	const miles: Unit = {
		symbol: LengthUnit.Miles,
		name: 'Miles',
		conversionFunction: (value: number) => value * 0.621371,
	}

	const nauticalMiles: Unit = {
		symbol: LengthUnit.NauticalMiles,
		name: 'Nautical Miles',
		conversionFunction: (value: number) => value * 0.539957,
	}

	const feet: Unit = {
		symbol: HeightUnit.Feet,
		name: 'Feet',
		conversionFunction: (value: number) => value,
	}

	const metersHeight: Unit = {
		symbol: HeightUnit.Meters,
		name: 'Meters',
		conversionFunction: (value: number) => value / 3.28084,
	}

	const kilometersHeight: Unit = {
		symbol: HeightUnit.Kilometers,
		name: 'Kilometers',
		conversionFunction: (value: number) => value / 3280.84,
	}

	const celsius: Unit = {
		symbol: TemperatureUnit.Celsius,
		name: 'Celsius',
		conversionFunction: (value: number) => value,
	}

	const fahrenheit: Unit = {
		symbol: TemperatureUnit.Fahrenheit,
		name: 'Fahrenheit',
		conversionFunction: (value: number) => value * 1.8 + 32,
	}

	const hectopascal: Unit = {
		symbol: PressureUnit.Hectopascals,
		name: 'Hectopascal',
		conversionFunction: (value: number) => value,
	}

	const inchesOfMercury: Unit = {
		symbol: PressureUnit.InchesOfMercury,
		name: 'Inches of Mercury',
		conversionFunction: (value: number) => value * 0.029529983071445,
	}

	const [store, setStore] = createStore<UnitStore>({
		speed: {
			selected: 0,
			units: [knots, metersPerSecond, kilometersPerHour, milesPerHour],
		},
		length: {
			selected: 0,
			units: [kilometers, meters, miles, nauticalMiles],
		},
		height: {
			selected: 0,
			units: [feet, metersHeight, kilometersHeight],
		},
		temperature: {
			selected: 0,
			units: [celsius, fahrenheit],
		},
		pressure: {
			selected: 0,
			units: [hectopascal, inchesOfMercury],
		},
	})

	return {
		store,
		setStore,
	}
}

type UnitStoreContext = [
	UnitStore,
	{
		selectUnit: (type: keyof UnitStore, identifier: string) => void
	}
]

const UnitStoreContext = createContext<UnitStoreContext>(undefined as unknown as UnitStoreContext)

const UnitStoreProvider: ParentComponent = props => {
	const { store, setStore } = createUnitStore()

	const selectUnit = (type: keyof UnitStore, identifier: string) => {
		setStore(
			type,
			'selected',
			store[type].units.findIndex(unit => unit.symbol === identifier)
		)
	}

	return <UnitStoreContext.Provider value={[store, { selectUnit }]}>{props.children}</UnitStoreContext.Provider>
}

function useUnitStore() {
	return useContext<UnitStoreContext>(UnitStoreContext)
}

export { UnitStoreProvider, useUnitStore }
export type { UnitConfiguration, Unit, UnitStore }
