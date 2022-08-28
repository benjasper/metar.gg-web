import { Component, createSignal, onCleanup, Show } from 'solid-js'
import { Transition } from 'solid-headless'
import WeatherParsed from './components/WeatherParsed'

const placeholders = ['KSFO', 'EDDF', 'LEBL', 'EGLL', 'LFPG']

const App: Component = () => {
	const [result, setResult] = createSignal(false)
	const [placeholder, setPlaceholder] = createSignal(placeholders[0])

	const interval = setInterval(() => {
		if (result()) {
			return
		}

		setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)])
	}, 3000)

	onCleanup(() => {
		clearInterval(interval)
	})

	const checkResult = (event: InputEvent) => {
		const result = (event.target as HTMLInputElement).value
		if (result.length < 4) {
			setResult(false)
			return
		}

		setResult(true)
	}

	return (
		<div class="container mx-auto w-screen h-screen">
			<div class="flex flex-col gap-8 h-1/2 transition-all" classList={{ 'h-1/3': result() }}>
				<h2 class="text-center mt-auto">What's the weather like in...</h2>
				<input
					type="text"
					placeholder={placeholder()}
					onInput={checkResult}
					class="mx-auto max-w-xs text-center bg-blue-50 text-2xl w-8/12 px-4 py-2 rounded-lg transition-all"
				/>
			</div>
			<div class="flex flex-col h-1/2 transition-all" classList={{ 'h-2/3': result() }}>
				<Transition
					show={result()}
					enter="transform transition duration-[200ms]"
					enterFrom="opacity-0 scale-50"
					enterTo="opacity-100 scale-100"
					leave="transform duration-200 transition ease-in-out"
					leaveFrom="opacity-100 rotate-0 scale-100 "
					leaveTo="opacity-0 scale-95">
					<WeatherParsed></WeatherParsed>
					<p class="text-xl text-blue-400 text-center py-20">
						KSFO 280956Z 20003KT 10SM FEW007 FEW012 15/12 A2982 RMK AO2 SLP097 T01500122
					</p>
				</Transition>
			</div>
		</div>
	)
}

export default App
