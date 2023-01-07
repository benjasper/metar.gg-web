import { BsArrowUp } from 'solid-icons/bs'
import { TbWindsock } from 'solid-icons/tb'
import { Component, createMemo, Show } from 'solid-js'
import { useUnitStore } from '../../context/UnitStore'
import WeatherElementLayout, { ParsedWeatherElementLayoutProps } from '../../layouts/WeatherElementLayout'
import { AirportSearchFragment, MetarFragment } from '../../queries/generated/graphql'
import RunwayAndWindRenderer from '../special/RunwayAndWindRenderer'

interface WindElementProps {
	airport: AirportSearchFragment

	windDirection: MetarFragment['windDirection']
	windSpeed: MetarFragment['windSpeed']
	windGust: MetarFragment['windGust']
	variableWindDirection?: string

	size: 'large' | 'small'
}
export interface VariableWind {
	from: number
	to: number
}

const WindElement: Component<WindElementProps> = props => {
	const [unitStore] = useUnitStore()

	const variableWind = createMemo((): VariableWind | undefined => {
		const result = props.variableWindDirection?.match(/\d{3}V\d{3}/g)
		const vWindString = result ? result[0] : undefined

		if (vWindString === undefined) {
			return undefined
		}

		const fromTo = vWindString.split('V').map(v => parseInt(v))

		return {
			from: fromTo[0],
			to: fromTo[1],
		}
	})

	const selected = () => unitStore.speed.units[unitStore.speed.selected]
	const windSpeed = () => Math.round(selected().conversionFunction(props.windSpeed!))
	const windGust = () => Math.round(selected().conversionFunction(props.windGust!))

	const unitConfigurations = () => {
		const configurations: ParsedWeatherElementLayoutProps['unitType'] = []

		if (props.windSpeed || props.windGust) {
			configurations.push({
				name: 'Wind speed',
				unitType: 'speed',
			})
		}

		configurations.push({
			name: 'Runway length and width',
			unitType: 'smallLength',
		})

		return configurations
	}

	return (
		<WeatherElementLayout name="Wind" class="flex-shrink-0" icon={<TbWindsock />} unitType={unitConfigurations()}>
			<Show when={props.size === 'large'}>
				<RunwayAndWindRenderer
					airport={props.airport}
					windDirection={props.windDirection!}
					windSpeed={props.windSpeed!}
					variableWind={variableWind()}
				/>
			</Show>
			<Show when={props.size === 'small'}>
				<Show when={props.windDirection! > 0}>
					<BsArrowUp
						class="mx-auto origin-center transform"
						size={24}
						style={{
							rotate: `${(props.windDirection! + 180) % 360}deg`,
						}}
					/>
				</Show>
			</Show>
			<div class="flex flex-col text-center dark:text-white-dark">
				<span class="text-lg">
					<Show when={props.windSpeed !== 0} fallback="Wind calm">
						<Show when={props.windDirection !== 0} fallback="Variable">
							{props.windDirection}°
						</Show>{' '}
						at {windSpeed()} {selected().symbol}
					</Show>
				</span>
				<Show when={variableWind()}>
					<span>
						variable from {variableWind()!.from}° to {variableWind()!.to}°
					</span>
				</Show>
				<Show when={props.windGust}>
					<span>
						with gusts up to {windGust()} {selected().symbol}
					</span>
				</Show>
			</div>
		</WeatherElementLayout>
	)
}

export default WindElement
