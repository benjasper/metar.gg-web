import { createSignal } from "solid-js"

const placeholders = ['KSFO', 'EDDF', 'LEBL', 'EGLL', 'LFPG']

const SearchBar = () => {
	const [placeholder, setPlaceholder] = createSignal(placeholders[0])
	
	const interval = setInterval(() => {

		setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)])
	}, 3000)

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement
	}

	return (
		<div class="search-bar">
			<input
					type="text"
					autofocus={true}
					spellcheck={false}
					autocomplete="off"
					placeholder={placeholder()}
					onInput={e => handleInput(e)}
					class="mx-auto max-w-xs text-center bg-blue-50 text-3xl w-8/12 px-4 py-2 rounded-lg transition-all"
				/>
		</div>
	)
}

export default SearchBar