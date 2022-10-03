import { useKeyDownList } from '@solid-primitives/keyboard'
import { Transition } from 'solid-headless'
import { Component, createEffect, createSignal, For, mergeProps, onCleanup, Show, untrack } from 'solid-js'
import { useGraphQL } from '../context/GraphQLClient'
import { AirportSearchQuery, AirportSearchQueryVariables } from '../queries/generated/graphql'
import { AIRPORT_SEARCH } from '../queries/AirportQueries'
import { debounce } from '@solid-primitives/scheduled'

interface SearchBarProps {
	class?: string
	onSearch: (airportIdentifier: string) => void
}

const SearchBar: Component<SearchBarProps> = (properties: SearchBarProps) => {
	const props = mergeProps({ class: '' }, properties)

	const [isFocused, setIsFocused] = createSignal(false)
	const [queryVars, setQueryVars] = createSignal<AirportSearchQueryVariables | false>(false)
	const [currentInput, setCurrentInput] = createSignal<string>('')

	let root!: HTMLInputElement
	let input!: HTMLInputElement

	const [selectedAirportId, setSelectedAirportId] = createSignal<number | undefined>(undefined)
	const [keys, { event }] = useKeyDownList()

	const newQuery = useGraphQL()

	const [airportResults, refetch] = newQuery<AirportSearchQuery, AirportSearchQueryVariables>(
		AIRPORT_SEARCH,
		queryVars
	)

	const throttledSearch = debounce((queryVars: AirportSearchQueryVariables | false) => setQueryVars(queryVars), 200)

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement

		setCurrentInput(target.value)

		if (target.value.length === 0) {
			setQueryVars(false)
			refetch.mutate(undefined)
			return
		}

		throttledSearch({ search: target.value })
		setSelectedAirportId(0)
	}

	const onSubmit = (airportIdentifier: string) => {
		props.onSearch(airportIdentifier)
		input.blur()
		setIsFocused(false)
		input.value = ''
	}

	const onFocusLeave = (e: Event) => {
		setIsFocused(false)
	}

	createEffect(() => {
		const id = untrack(selectedAirportId)
		const untrackedEvent = untrack(event)

		if (keys().length === 0) {
			return
		}

		if (keys().includes('ESCAPE')) {
			setIsFocused(false)
			input.blur()
			return
		}

		if (keys().includes('ARROWDOWN')) {
			untrackedEvent.preventDefault()
			setSelectedAirportId(prev =>
				prev === undefined || prev < airportResults().getAirports.edges.length - 1 ? (prev ?? -1) + 1 : prev
			)
			return
		}

		if (keys().includes('ARROWUP')) {
			untrackedEvent.preventDefault()
			setSelectedAirportId(prev => (prev === undefined || prev > 0 ? (prev ?? 1) - 1 : prev))
			return
		}

		if (keys().includes('ENTER')) {
			if (id === undefined || airportResults() === undefined || !airportResults().getAirports.edges[id] || airportResults().getAirports.totalCount === 0) {
				return
			}

			onSubmit(airportResults().getAirports.edges[id].node.identifier)
		}

		// If it doesn't have focus we want to give it focus when we detect letters and numbers
		if (document.activeElement !== input && ((untrackedEvent.key.length === 1 && untrackedEvent.key.match(/[a-z0-9]/i)) || keys().includes('BACKSPACE'))) {
			input.focus()
			return
		}
	})

	return (
		<div ref={root} class={`relative w-full max-w-md mx-auto ${props.class}`}>
			<div class="flex flex-col">
				<input
					ref={input}
					type="text"
					autofocus={true}
					spellcheck={false}
					tabIndex={1}
					role="combobox"
					autocomplete="off"
					placeholder="Search for an airport"
					onInput={e => handleInput(e)}
					onFocus={e => setIsFocused(true)}
					onFocusOut={e => onFocusLeave(e)}
					class={`w-full text-left bg-gray-100 text-gray-700 text-xl px-6 py-2 rounded-lg transition-all outline-none`}
				/>
				<Transition
					show={airportResults.loading}
					enter="transition duration-[25ms]"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="duration-200 transition ease-in-out"
					leaveFrom="opacity-100"
					leaveTo="opacity-0">
					<div class="absolute right-0 top-1/2 transform -translate-y-1/2">
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					</div>
				</Transition>
			</div>
			<Transition
				class="my-auto flex flex-col gap-32"
				show={isFocused() && currentInput() !== '' && airportResults.latest !== undefined}
				enter="transform transition duration-[200ms]"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transform duration-200 transition ease-in-out"
				leaveFrom="opacity-100 rotate-0"
				leaveTo="opacity-0">
				<div
					class="absolute w-full overflow-y-auto left-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabindex="-1">
					<div class="py-1" role="none">
						<Show when={airportResults.latest && airportResults().getAirports.totalCount > 0}>
							<For each={airportResults().getAirports.edges}>
								{(airportNode, i) => (
									<a
										href="#"
										class="w-full text-gray-700 block px-6 py-2 text-sm"
										classList={{ 'bg-gray-100': i() === selectedAirportId() }}
										onMouseEnter={e => setSelectedAirportId(i())}
										onClick={e => onSubmit(airportNode.node.identifier)}
										role="menuitem"
										tabindex={i()}>
										{airportNode.node.icaoCode} / {airportNode.node.iataCode} •{' '}
										{airportNode.node.name}
									</a>
								)}
							</For>
						</Show>
						<Show when={airportResults() && airportResults().getAirports.totalCount === 0}>
							<a
								href="#"
								class="w-full text-gray-700 block px-6 py-2 text-sm pointer-events-none"
								role="menuitem">
								Nothing found.
							</a>
						</Show>
					</div>
				</div>
			</Transition>
		</div>
	)
}

export default SearchBar
