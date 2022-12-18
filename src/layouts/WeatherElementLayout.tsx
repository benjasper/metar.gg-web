import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import { BsThreeDotsVertical } from 'solid-icons/bs'
import { CgArrowsExchange } from 'solid-icons/cg'
import { For, JSX, ParentComponent, Show } from 'solid-js'
import { UnitStore, useUnitStore } from '../context/UnitStore'

interface ParsedWeatherElementLayoutProps {
	name: string
	class?: string
	unitType?: keyof UnitStore
	icon?: JSX.Element
}

const WeatherElementLayout: ParentComponent<ParsedWeatherElementLayoutProps> = props => {
	const [unitStore, { selectUnit }] = useUnitStore()

	const unitConfiguration = () => (props.unitType ? unitStore[props.unitType] : undefined)

	return (
		<div
			class={`relative flex h-auto w-auto flex-grow flex-col justify-center gap-2 rounded-2xl bg-gray-50 px-4 py-6 text-black shadow-sm transition-colors dark:bg-black-200 dark:text-white-light md:mx-0 md:px-12 ${
				props.class ?? ''
			}`}>
			<label class="mx-auto flex gap-1 text-xs font-semibold uppercase text-gray-500 transition-colors dark:text-white-darker">
				<Show when={props.icon}>
					<div class="my-auto">{props.icon}</div>
				</Show>
				<span class="my-auto">{props.name}</span>
			</label>
			<Show when={unitConfiguration() && props.unitType}>
				<Popover defaultOpen={false} class="absolute right-4 top-4">
					{({ isOpen }) => (
						<>
							<PopoverButton
								classList={{ 'text-opacity-90': isOpen() }}
								class="group inline-flex items-center rounded-md p-2 text-base font-medium text-black dark:text-white-darker">
								<BsThreeDotsVertical></BsThreeDotsVertical>
							</PopoverButton>
							<PopoverPanel
								unmount={true}
								class="absolute right-0 md:right-auto md:left-1/2 z-50 mt-2 md:-translate-x-1/2 transform px-4">
								<Transition
									show={isOpen()}
									enter="transition duration-100"
									enterFrom="opacity-0 scale-50"
									enterTo="opacity-100 scale-100"
									leave="transition duration-100"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-50">
									<Menu class="flex flex-shrink-0 flex-col overflow-hidden rounded-lg bg-white dark:bg-black-200 shadow-md dark:shadow-xl">
										<span class='text-xs font-semibold px-4 pt-2'>Unit conversion</span>
										<For each={unitConfiguration()!.units}>
											{unit => (
												<Show
													when={
														unitStore[props.unitType!].units[
															unitStore[props.unitType!].selected
														].symbol !== unit.symbol
													}>
													<MenuItem
														as="button"
														onClick={() => selectUnit(props.unitType!, unit.symbol)}
														class="flex gap-1 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black dark:text-white-darker transition-all hover:bg-gray-light hover:dark:bg-black-100">
														<CgArrowsExchange class='my-auto' />
														<span>Display in {unit.name} ({unit.symbol})</span>
													</MenuItem>
												</Show>
											)}
										</For>
									</Menu>
								</Transition>
							</PopoverPanel>
						</>
					)}
				</Popover>
			</Show>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout
