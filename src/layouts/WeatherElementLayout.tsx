import { autoUpdate, flip, offset } from '@floating-ui/dom'
import { useFloating } from 'solid-floating-ui'
import { Menu, MenuItem } from 'solid-headless'
import { BiSolidLockAlt, BiSolidLockOpenAlt } from 'solid-icons/bi'
import { BsThreeDotsVertical } from 'solid-icons/bs'
import { createSignal, For, JSX, onCleanup, ParentComponent, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { UnitStore, useUnitStore } from '../context/UnitStore'

interface ParsedWeatherElementLayoutProps {
	name: string
	class?: string
	unitType?: keyof UnitStore
	icon?: JSX.Element
}

const WeatherElementLayout: ParentComponent<ParsedWeatherElementLayoutProps> = props => {
	const [unitStore, { selectUnit, lockUnit, unlockUnit }] = useUnitStore()
	const [isOpen, setIsOpen] = createSignal(false)

	// ID from sanitized name
	const id = props.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

	const unitConfiguration = () => (props.unitType ? unitStore[props.unitType] : undefined)

	const [reference, setReference] = createSignal<HTMLElement>()
	const [popper, setPopper] = createSignal<HTMLElement>()

	const position = useFloating(reference, popper, {
		whileElementsMounted: autoUpdate,
		placement: 'right',
		middleware: [offset(10), flip({ fallbackPlacements: ['top', 'bottom', 'left'] })],
	})

	const onClick = (event: MouseEvent) => {
		// Check if the click was outside the menu
		if (isOpen() && !popper()?.contains(event.target as Node) && !reference()?.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}

	window.addEventListener('click', onClick)

	onCleanup(() => {
		window.removeEventListener('click', onClick)
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
				<div class="absolute right-2 top-[1.4rem] flex gap-1 md:right-4">
					<Show when={unitConfiguration()!.locked !== ''}>
						<div
							class="invisible my-auto md:visible"
							title={`The unit of this component is locked to ${
								unitConfiguration()!.locked
							}. It will persist across different airports.`}>
							<BiSolidLockAlt></BiSolidLockAlt>
						</div>
					</Show>
					<button
						type="button"
						aria-expanded={isOpen()}
						aria-haspopup="true"
						aria-controls={`context-menu-${id}`}
						aria-label={`Open context menu for ${props.name}. Includes unit conversion.`}
						onClick={() => setIsOpen(!isOpen())}
						ref={setReference}
						class="group my-auto inline-flex items-center rounded-md text-base font-medium text-black dark:text-white-darker">
						<BsThreeDotsVertical></BsThreeDotsVertical>
					</button>
					<Show when={isOpen()}>
						<Portal>
							<div
								ref={setPopper}
								class="z-30 w-max px-4"
								style={{
									position: position.strategy,
									top: `${position.y ?? 0}px`,
									left: `${position.x ?? 0}px`,
								}}>
								<Menu
									aria-label={`Context menu for ${props.name}. Includes unit conversion.`}
									id={`context-menu-${id}`}
									class="flex flex-shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md dark:bg-black-150 dark:shadow-xl">
									<span class="px-4 pt-2 text-xs font-semibold text-black dark:text-white-darker">
										Unit conversion
									</span>
									<For each={unitConfiguration()!.units}>
										{unit => (
											<MenuItem
												as="button"
												disabled={unitStore[props.unitType!].locked !== ''}
												onClick={() => selectUnit(props.unitType!, unit.symbol)}
												class="flex gap-1 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black transition-all disabled:opacity-60 dark:text-white-darker"
												classList={{
													'cursor-default ':
														unitStore[props.unitType!].units[
															unitStore[props.unitType!].selected
														].symbol === unit.symbol,
													'enabled:hover:bg-gray-light enabled:hover:dark:bg-black-100':
														unitStore[props.unitType!].units[
															unitStore[props.unitType!].selected
														].symbol !== unit.symbol,
												}}>
												<div class="flex items-center gap-2">
													<div
														class="h-2 w-2 rounded-full bg-gray-300 transition-all duration-300 dark:bg-white-darker"
														classList={{
															'!bg-primary dark:!bg-primary-light':
																unitStore[props.unitType!].units[
																	unitStore[props.unitType!].selected
																].symbol === unit.symbol,
														}}></div>
													<span class="text-sm font-medium text-gray-900 dark:text-white-darker">
														Display in {unit.name} ({unit.symbol})
													</span>
												</div>
											</MenuItem>
										)}
									</For>
									<hr class="border-gray-300 dark:border-gray-600" />
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
										class="flex gap-2 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black transition-all hover:bg-gray-light dark:text-white-darker hover:dark:bg-black-100">
										<Show
											when={unitStore[props.unitType!].locked === ''}
											fallback={<BiSolidLockOpenAlt class="my-auto" />}>
											<BiSolidLockAlt class="my-auto w-2 scale-150" />
										</Show>
										<span>
											{unitStore[props.unitType!].locked === '' ? 'Lock' : 'Unlock'} current unit
											(
											{
												unitStore[props.unitType!].units[unitStore[props.unitType!].selected]
													.symbol
											}
											)
										</span>
									</MenuItem>
								</Menu>
							</div>
						</Portal>
					</Show>
				</div>
			</Show>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout
