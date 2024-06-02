import { autoUpdate, flip, offset } from '@floating-ui/dom'
import { useFloating } from 'solid-floating-ui'
import { Menu, MenuItem } from 'solid-headless'
import { BiSolidLockAlt, BiSolidLockOpenAlt } from 'solid-icons/bi'
import { BsThreeDotsVertical } from 'solid-icons/bs'
import {
	For,
	JSX,
	Match,
	ParentComponent,
	Show,
	Switch,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import Tooltip from '../components/Tooltip'
import { UnitStore, useUnitStore } from '../context/UnitStore'

export enum UpdatePing {
	Worse = -1,
	Neutral = 0,
	Better = 1,
}

export interface ParsedWeatherElementLayoutProps {
	name: string
	class?: string
	unitType?: { name?: string; unitType: keyof UnitStore }[]
	icon?: JSX.Element

	updatePingOldValue?: string
	updatePingNewValue?: string
	updatePing?: UpdatePing
}

const WeatherElementLayout: ParentComponent<ParsedWeatherElementLayoutProps> = props => {
	const [unitStore, { selectUnit, lockUnit, unlockUnit }] = useUnitStore()
	const [isOpen, setIsOpen] = createSignal(false)

	// ID from sanitized name
	const id = () => props.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

	const unitConfigurations = createMemo(() => {
		if (props.unitType === undefined) {
			return []
		}

		return props.unitType.map(item => {
			return { name: item.name, type: item.unitType, configuration: unitStore[item.unitType] }
		})
	})

	const lockedUnits = createMemo(() => {
		return unitConfigurations()
			.map(x => x)
			.filter(item => item.configuration.locked !== '')
	})

	const hasUpdate = () => props.updatePing !== undefined && props.updatePingOldValue && props.updatePingNewValue

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

	const [triggerPing, setTriggerPing] = createSignal(false)
	const isDifferent = () => props.updatePingOldValue !== props.updatePingNewValue

	const ping = () => {
		if (triggerPing()) {
			return
		}

		setTriggerPing(true)
		setTimeout(() => {
			setTriggerPing(false)
		}, 3000)
	}

	createEffect<string | undefined>(previous => {
		if (previous && props.updatePingNewValue && props.updatePingNewValue !== previous) {
			ping()
		}

		return props.updatePingNewValue
	})

	return (
		<div
			class={`relative flex h-auto w-auto flex-grow flex-col justify-center gap-2 rounded-2xl bg-gray-50 px-8 py-6 text-black shadow-sm transition-colors dark:bg-black-200 dark:text-white-light md:mx-0 lg:px-12 ${
				props.class ?? ''
			}`}>
			<label class="mx-auto flex gap-1 text-xs font-semibold uppercase text-gray-500 transition-colors dark:text-white-darker">
				<Show when={props.icon}>
					<div class="my-auto">{props.icon}</div>
				</Show>
				<span class="my-auto whitespace-nowrap">{props.name}</span>
				<Show when={hasUpdate()}>
					<Tooltip text={`Previously ${props.updatePingOldValue}`}>
						<span
							class="relative z-10 my-auto ml-1 inline-flex h-2 w-2 rounded-full transition-all"
							classList={{
								'bg-sky-500': props.updatePing === UpdatePing.Neutral && isDifferent(),
								'bg-gray-500': props.updatePing === UpdatePing.Neutral && !isDifferent(),
								'bg-green-400': props.updatePing === UpdatePing.Better,
								'bg-red-500': props.updatePing === UpdatePing.Worse,
							}}>
							<span
								class="absolute my-auto inline-flex h-full w-full rounded-full opacity-80 transition-all"
								classList={{
									'animate-ping-large': triggerPing(),
									'bg-sky-500': props.updatePing === UpdatePing.Neutral && isDifferent(),
									'bg-gray-500': props.updatePing === UpdatePing.Neutral && !isDifferent(),
									'bg-green-400': props.updatePing === UpdatePing.Better,
									'bg-red-500': props.updatePing === UpdatePing.Worse,
								}}
							/>
						</span>
					</Tooltip>
				</Show>
			</label>
			<Show when={unitConfigurations().length > 0 || hasUpdate()}>
				<div class="absolute right-2 top-[1rem] flex gap-1 px-2 md:right-0">
					<Show when={unitConfigurations().length > 0}>
						<Show when={lockedUnits().length > 0}>
							<div class="invisible my-auto md:visible">
								<Tooltip
									text={`The unit${lockedUnits().length > 1 ? 's' : ''} of this component ${
										lockedUnits().length > 1 ? 'are' : 'is'
									} locked to ${lockedUnits()
										.map(x => unitStore[x.type].units[unitStore[x.type].selected].symbol)
										.join(', ')}. It will persist across different airports. You can unlock ${
										lockedUnits().length > 1 ? 'them' : 'it'
									} by opening the context menu.`}>
									<BiSolidLockAlt />
								</Tooltip>
							</div>
						</Show>
						<button
							type="button"
							aria-expanded={isOpen()}
							aria-haspopup="true"
							aria-controls={`context-menu-${id()}`}
							aria-label={`Context menu for ${props.name}. Includes unit conversions.`}
							onClick={() => setIsOpen(!isOpen())}
							ref={setReference}
							class="group my-auto inline-flex items-center rounded-full p-2 text-base font-medium text-black transition-all hover:bg-gray-light dark:text-white-darker dark:hover:bg-black-100"
							classList={{ 'bg-gray-light dark:bg-black-100': isOpen() }}>
							<BsThreeDotsVertical />
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
										id={`context-menu-${id()}`}
										class="flex flex-shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md dark:bg-black-150 dark:shadow-xl">
										<For each={unitConfigurations()}>
											{(unitConfiguration, index) => (
												<>
													<span class="px-4 pt-2 text-xs font-semibold text-black dark:text-white-darker">
														{unitConfiguration.name ?? props.name} unit conversion
													</span>
													<For each={unitConfiguration.configuration!.units}>
														{unit => (
															<MenuItem
																as="button"
																disabled={
																	unitStore[unitConfiguration.type!].locked !== ''
																}
																onClick={() =>
																	selectUnit(unitConfiguration.type!, unit.symbol)
																}
																class="flex gap-1 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black transition-all disabled:opacity-60 dark:text-white-darker"
																classList={{
																	'cursor-default ':
																		unitStore[unitConfiguration.type!].units[
																			unitStore[unitConfiguration.type!].selected
																		].symbol === unit.symbol,
																	'enabled:hover:bg-gray-light enabled:hover:dark:bg-black-100':
																		unitStore[unitConfiguration.type!].units[
																			unitStore[unitConfiguration.type!].selected
																		].symbol !== unit.symbol,
																}}>
																<div class="flex items-center gap-2">
																	<div
																		class="h-2 w-2 rounded-full bg-gray-300 transition-all duration-300 dark:bg-white-darker"
																		classList={{
																			'!bg-primary dark:!bg-primary-light':
																				unitStore[unitConfiguration.type!]
																					.units[
																					unitStore[unitConfiguration.type!]
																						.selected
																				].symbol === unit.symbol,
																		}}
																	/>
																	<span class="text-sm font-medium text-gray-900 dark:text-white-darker">
																		Display in {unit.name} ({unit.symbol})
																	</span>
																</div>
															</MenuItem>
														)}
													</For>
													<MenuItem
														as="button"
														onClick={() =>
															unitStore[unitConfiguration.type!].locked === ''
																? lockUnit(
																		unitConfiguration.type!,
																		unitStore[unitConfiguration.type!].units[
																			unitStore[unitConfiguration.type!].selected
																		].symbol
																	)
																: unlockUnit(unitConfiguration.type!)
														}
														class="flex gap-2 whitespace-nowrap rounded px-4 py-2 text-left text-sm text-black transition-all hover:bg-gray-light dark:text-white-darker hover:dark:bg-black-100">
														<div
															class="my-auto flex flex-col items-center text-gray-300 transition-all duration-300 dark:text-white-darker"
															classList={{
																'!text-primary dark:!text-primary-light':
																	unitStore[unitConfiguration.type!].locked !== '',
															}}>
															<Switch>
																<Match
																	when={
																		unitStore[unitConfiguration.type!].locked === ''
																	}>
																	<BiSolidLockAlt class="my-auto w-2 scale-[1.6]" />
																</Match>
																<Match
																	when={
																		unitStore[unitConfiguration.type!].locked !== ''
																	}>
																	<BiSolidLockOpenAlt class="my-auto w-2 scale-[1.6]" />
																</Match>
															</Switch>
														</div>
														<span>
															{unitStore[unitConfiguration.type!].locked === ''
																? 'Lock'
																: 'Unlock'}{' '}
															current unit (
															{
																unitStore[unitConfiguration.type!].units[
																	unitStore[unitConfiguration.type!].selected
																].symbol
															}
															)
														</span>
													</MenuItem>
													<Show
														when={
															index() !== (unitConfigurations().length ?? 0) - 1 &&
															(unitConfigurations().length ?? 0) > 0
														}>
														<hr class="border-gray-300 dark:border-gray-600" />
													</Show>
												</>
											)}
										</For>
									</Menu>
								</div>
							</Portal>
						</Show>
					</Show>
				</div>
			</Show>
			{props.children}
		</div>
	)
}

export default WeatherElementLayout
