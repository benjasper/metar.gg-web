import { createContext, ParentComponent, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import {
	HeightUnit, LengthUnit, PressureUnit, SpeedUnit, TemperatureUnit, Unit, UnitConfiguration
} from '../models/units'

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

	const beaufort: Unit = {
		symbol: SpeedUnit.Beaufort,
		name: 'Beaufort',
		conversionFunction: (value: number) => {
			if (value < 0.3) {
				return 0
			} else if (value < 1.6) {
				return 1
			} else if (value < 3.4) {
				return 2
			} else if (value < 5.5) {
				return 3
			} else if (value < 8) {
				return 4
			} else if (value < 10.8) {
				return 5
			} else if (value < 13.9) {
				return 6
			} else if (value < 17.2) {
				return 7
			} else if (value < 20.8) {
				return 8
			} else if (value < 24.5) {
				return 9
			} else if (value < 28.5) {
				return 10
			} else if (value < 32.7) {
				return 11
			} else {
				return 12
			}
		},
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

	const feetFromKilometers: Unit = {
		symbol: LengthUnit.Feet,
		name: 'Feet',
		conversionFunction: (value: number) => value * 3280.84,
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

	const kelvin: Unit = {
		symbol: TemperatureUnit.Kelvin,
		name: 'Kelvin',
		conversionFunction: (value: number) => value + 273.15,
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
			units: [knots, metersPerSecond, kilometersPerHour, milesPerHour, beaufort],
			locked: '',
		},
		length: {
			selected: 0,
			units: [kilometers, meters, miles, feetFromKilometers, nauticalMiles],
			locked: '',
		},
		height: {
			selected: 0,
			units: [feet, metersHeight, kilometersHeight],
			locked: '',
		},
		temperature: {
			selected: 0,
			units: [celsius, fahrenheit, kelvin],
			locked: '',
		},
		pressure: {
			selected: 0,
			locked: '',
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
		lockUnit: (type: keyof UnitStore, identifier: string) => void
		unlockUnit: (type: keyof UnitStore) => void
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

	const lockUnit = (type: keyof UnitStore, identifier: string) => {
		setStore(type, 'locked', identifier)
		localStorage.setItem(type, identifier)
	}

	const unlockUnit = (type: keyof UnitStore) => {
		localStorage.removeItem(type)
		setStore(type, 'locked', '')
	}

	// Initialize locked units from local storage
	Object.keys(store).forEach(key => {
		const unit = localStorage.getItem(key)
		if (unit) {
			// Check if key is valid
			if (!store[key as keyof UnitStore]) {
				return
			}
			
			setStore(key as keyof UnitStore, 'locked', unit)
			selectUnit(key as keyof UnitStore, unit)
		}
	})

	return <UnitStoreContext.Provider value={[store, { selectUnit, lockUnit, unlockUnit }]}>{props.children}</UnitStoreContext.Provider>
}

function useUnitStore() {
	return useContext<UnitStoreContext>(UnitStoreContext)
}

export { UnitStoreProvider, useUnitStore }
export type { UnitConfiguration, Unit, UnitStore }

