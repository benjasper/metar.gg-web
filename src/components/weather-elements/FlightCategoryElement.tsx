import { BiRegularCategoryAlt } from 'solid-icons/bi'
import { Component } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { MetarFlightCategory, MetarFragment } from '../../queries/generated/graphql'

interface FlightCategoryElementProps {
	latestMetar: MetarFragment
}

const FlightCategoryElement: Component<FlightCategoryElementProps> = props => {
	return (
		<WeatherElementLayout name="Flight category" icon={<BiRegularCategoryAlt />}>
			<div class="flex flex-col text-center">
				<div
					class="relative mx-auto mb-2 h-5 w-5 rounded-full"
					classList={{
						'bg-green-400 dark:bg-green-600': props.latestMetar.flightCategory === MetarFlightCategory.Vfr,
						'bg-blue-400 dark:bg-blue-600': props.latestMetar.flightCategory === MetarFlightCategory.Mvfr,
						'bg-red-400 dark:bg-red-600': props.latestMetar.flightCategory === MetarFlightCategory.Ifr,
						'bg-purple-400 dark:bg-purple-600':
							props.latestMetar.flightCategory === MetarFlightCategory.Lifr,
					}}>
					<div
						class="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
						classList={{
							'bg-green-600 dark:bg-green-800':
								props.latestMetar.flightCategory === MetarFlightCategory.Vfr,
							'bg-blue-600 dark:bg-blue-800':
								props.latestMetar.flightCategory === MetarFlightCategory.Mvfr,
							'bg-red-600 dark:bg-red-800': props.latestMetar.flightCategory === MetarFlightCategory.Ifr,
							'bg-purple-600 dark:bg-purple-800':
								props.latestMetar.flightCategory === MetarFlightCategory.Lifr,
						}}></div>
				</div>
				<p class="mx-auto text-center text-base dark:text-white-dark">{props.latestMetar.flightCategory}</p>
			</div>
		</WeatherElementLayout>
	)
}

export default FlightCategoryElement
