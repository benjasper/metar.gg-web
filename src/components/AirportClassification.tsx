import { BiSolidPlaneTakeOff } from 'solid-icons/bi'
import { IoWaterOutline } from 'solid-icons/io'
import { TbHelicopterLanding } from 'solid-icons/tb'
import { Component, Match, Switch } from 'solid-js'
import { AirportType } from '../queries/generated/graphql'
import { Tag } from './Tag'

const AirportClassification: Component<{ type: AirportType }> = props => {
	return (
		<Switch>
			<Match when={props.type === AirportType.LargeAirport}>
				<BiSolidPlaneTakeOff class="my-auto"></BiSolidPlaneTakeOff>
				Large airport
			</Match>
			<Match when={props.type === AirportType.MediumAirport}>
				<BiSolidPlaneTakeOff class="my-auto"></BiSolidPlaneTakeOff>
				Medium airport
			</Match>
			<Match when={props.type === AirportType.SmallAirport}>
				<BiSolidPlaneTakeOff class="my-auto"></BiSolidPlaneTakeOff>
				Small airport
			</Match>
			<Match when={props.type === AirportType.SeaplaneBase}>
				<IoWaterOutline class="my-auto"></IoWaterOutline>
				Seaplane base
			</Match>
			<Match when={props.type === AirportType.Heliport}>
				<TbHelicopterLanding class="my-auto"></TbHelicopterLanding>
				Heliport
			</Match>
			<Match when={props.type === AirportType.ClosedAirport}>Closed</Match>
		</Switch>
	)
}

export default AirportClassification
