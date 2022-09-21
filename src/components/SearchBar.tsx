import { useKeyDownList } from '@solid-primitives/keyboard'
import { Component, createEffect, createSignal, For, mergeProps, onCleanup, Show, untrack } from 'solid-js'
import { useGraphQL } from '../context/GraphQLClient'
import { AirportSearchQuery, AirportSearchQueryVariables } from '../generated/graphql'
import { AIRPORT_SEARCH } from '../queries/AirportQueries'

const placeholders = ['KSFO', 'EDDF', 'LEBL', 'EGLL', 'LFPG']

interface SearchBarProps {
	class?: string
	onSearch: (airportIdentifier: string) => void
}

const SearchBar: Component<SearchBarProps> = (properties: SearchBarProps) => {
	const props = mergeProps({ class: '' }, properties)

	const [placeholder, setPlaceholder] = createSignal(placeholders[0])
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

	const interval = setInterval(() => {
		if (airportResults() && airportResults().getAirports.edges.length > 0) {
			return
		}

		setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)])
	}, 3000)

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement

		setCurrentInput(target.value)

		if (target.value.length === 0) {
			setQueryVars(false)
			refetch.mutate(undefined)
			return
		}

		setQueryVars({ search: target.value.toUpperCase() })
		setSelectedAirportId(0)
	}

	const onSubmit = (airportIdentifier: string) => {
		props.onSearch(airportIdentifier)
		input.blur()
		setIsFocused(false)
	}

	const onFocusLeave = (e: Event) => {
		if (root.contains(e.target as Node)) {
			return
		}

		setIsFocused(false)
	}

	createEffect(() => {
		const id = untrack(selectedAirportId)
		const untrackedEvent = untrack(event)

		if (keys().length === 0) {
			return
		}

		if (document.activeElement !== input) {
			input.focus()
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
			if (id === undefined) {
				return
			}

			onSubmit(airportResults().getAirports.edges[id].node.identifier)
		}
	})

	onCleanup(() => {
		clearInterval(interval)
	})

	return (
		<div ref={root} class={`relative w-full max-w-md mx-auto ${props.class}`}>
			<div class="flex flex-col">
				<input
					ref={input}
					type="search"
					autofocus={true}
					spellcheck={false}
					tabIndex={1}
					role="combobox"
					autocomplete="off"
					placeholder={placeholder()}
					onInput={e => handleInput(e)}
					onFocus={e => setIsFocused(true)}
					onFocusOut={e => onFocusLeave(e)}
					class={`w-full text-left bg-gray-100 text-gray-700 text-xl px-6 py-2 rounded-lg transition-all outline-none`}
				/>
			</div>
			<Show when={isFocused() && currentInput() !== '' && airportResults.latest}>
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
			</Show>
		</div>
	)
}

export default SearchBar
