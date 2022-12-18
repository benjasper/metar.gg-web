import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import { BiSolidLockAlt, BiSolidLockOpenAlt } from 'solid-icons/bi'
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
	const [unitStore, { selectUnit, lockUnit, unlockUnit }] = useUnitStore()

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
				<div class="absolute right-2 top-[1.4rem] flex gap-1">
					<Show when={unitConfiguration()!.locked !== ''}>
						<div
							class="my-auto invisible md:visible"
							title={`The unit of this component is locked to ${unitConfiguration()!.locked}. It will persist across different airports.`}>
							<BiSolidLockAlt></BiSolidLockAlt>
						</div>
					</Show>
					<Popover defaultOpen={false} class="flex">
						{({ isOpen }) => (
							<>
								<PopoverButton
									ref={setAnchor}
									class="group my-auto inline-flex items-center rounded-md text-base font-medium text-black dark:text-white-darker">
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
																disabled={unitStore[props.unitType!].locked !== ''}
																onClick={() => selectUnit(props.unitType!, unit.symbol)}
																class="flex gap-1 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black transition-all hover:bg-gray-light disabled:opacity-60 dark:text-white-darker hover:dark:bg-black-100">
																<CgArrowsExchange class="my-auto" />
																<span>
																	Display in {unit.name} ({unit.symbol})
																</span>
															</MenuItem>
														</Show>
													)}
												</For>
												<MenuItem
													as="button"
													onClick={() =>
														unitStore[props.unitType!].locked === ''
															? lockUnit(
																	props.unitType!,
																	unitStore[props.unitType!].units[
																		unitStore[props.unitType!].selected
																	].symbol
															  )
															: unlockUnit(props.unitType!)
													}
													class="flex gap-1 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black transition-all hover:bg-gray-light dark:text-white-darker hover:dark:bg-black-100">
													<Show
														when={unitStore[props.unitType!].locked === ''}
														fallback={<BiSolidLockOpenAlt class="my-auto" />}>
														<BiSolidLockAlt class="my-auto" />
													</Show>
													<span>
														{unitStore[props.unitType!].locked === '' ? 'Lock' : 'Unlock'}{' '}
														current unit (
														{
															unitStore[props.unitType!].units[
																unitStore[props.unitType!].selected
															].symbol
														}
														)
													</span>
												</MenuItem>
											</Menu>
										</Transition>
									</PopoverPanel>
								</Portal>
							</>
						)}
					</Popover>
				</div>
			</Show>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout
