import { BiRegularCategoryAlt } from 'solid-icons/bi'
import { Component } from 'solid-js'
import WeatherElementLayout from '../../layouts/WeatherElementLayout'
import { MetarFragment } from '../../queries/generated/graphql'
import FlightCategorySymbol from '../FlightCategorySymbol'

interface FlightCategoryElementProps {
	latestMetar: MetarFragment
}

const FlightCategoryElement: Component<FlightCategoryElementProps> = props => {
	return (
		<WeatherElementLayout name="Flight category" icon={<BiRegularCategoryAlt />}>
			<div class="flex flex-col text-center">
				<FlightCategorySymbol size='large' class="mb-2" flightCategory={props.latestMetar.flightCategory!}></FlightCategorySymbol>
				<p class="mx-auto text-center text-base dark:text-white-dark">{props.latestMetar.flightCategory}</p>
			</div>
		</WeatherElementLayout>
	)
}

export default FlightCategoryElement
