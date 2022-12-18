import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import { BsThreeDotsVertical } from 'solid-icons/bs'
import { CgArrowsExchange } from 'solid-icons/cg'
import { createSignal, For, JSX, ParentComponent, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import usePopper from 'solid-popper'
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

	const [anchor, setAnchor] = createSignal<HTMLElement>()
	const [popper, setPopper] = createSignal<HTMLElement>()

	usePopper(anchor, popper, {
		placement: 'auto',
	})

	return (
		<div
			class={`relative flex h-auto w-auto flex-grow flex-col justify-center gap-2 rounded-2xl bg-gray-50 px-6 py-6 text-black shadow-sm transition-colors dark:bg-black-200 dark:text-white-light md:mx-0 md:px-12 ${
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
								ref={setAnchor}
								class="group inline-flex items-center rounded-md p-2 text-base font-medium text-black dark:text-white-darker">
								<BsThreeDotsVertical></BsThreeDotsVertical>
							</PopoverButton>
							<Portal mount={document.getElementById('modal')!}>
								<PopoverPanel ref={setPopper} unmount={true} class="relative z-30 px-4">
									<Transition
										show={isOpen()}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-75">
										<Menu class="flex flex-shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md dark:bg-black-150 dark:shadow-xl">
											<span class="px-4 pt-2 text-xs font-semibold text-black dark:text-white-darker">
												Unit conversion
											</span>
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
															class="flex gap-1 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black transition-all hover:bg-gray-light dark:text-white-darker hover:dark:bg-black-100">
															<CgArrowsExchange class="my-auto" />
															<span>
																Display in {unit.name} ({unit.symbol})
															</span>
														</MenuItem>
													</Show>
												)}
											</For>
										</Menu>
									</Transition>
								</PopoverPanel>
							</Portal>
						</>
					)}
				</Popover>
			</Show>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout
