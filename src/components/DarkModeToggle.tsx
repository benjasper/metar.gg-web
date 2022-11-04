import { Tab, TabGroup, TabList } from 'solid-headless'
import { Component, createEffect, createSignal, onCleanup } from 'solid-js'
import { BsMoonStars } from 'solid-icons/bs'
import { WiDaySunny } from 'solid-icons/wi'

interface TabGroupProps {
	class?: string
}

enum Modes {
	Light = 'light',
	Dark = 'dark',
	System = 'system',
}

const DarkModeToggle: Component<TabGroupProps> = props => {
	const [currentMode, setCurrentMode] = createSignal<Modes>(Modes.System)

	setCurrentMode(localStorage.theme ?? Modes.System)

	const onSystemChange = (e: MediaQueryListEvent) => {
		if (currentMode() === Modes.System) {
			evaluateColorScheme()
		}
	}

	const evaluateColorScheme = (updatedColorScheme?: Modes) => {
		if (
			updatedColorScheme === Modes.Dark ||
			(updatedColorScheme === Modes.System && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark')
			// Set Meta Tag Theme Color
			document
				.querySelector('meta[name="theme-color"]')
				?.setAttribute('content', '#000212')

			localStorage.theme = Modes.Dark
		} else if (
			updatedColorScheme === Modes.Light ||
			(updatedColorScheme === Modes.System && !window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.remove('dark')
			document
				.querySelector('meta[name="theme-color"]')
				?.setAttribute('content', '#f9f8f9')

			localStorage.theme = Modes.Light
		}
	}

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onSystemChange)

	createEffect(() => {
		evaluateColorScheme(currentMode())
	})

	onCleanup(() => {
		window.removeEventListener('change', onSystemChange)
	})

	return (
		<TabGroup horizontal defaultValue={currentMode()} class="flex" onChange={x => setCurrentMode(x)}>
			{({ isSelected, isActive }) => (
				<TabList
					class={`flex rounded-xl bg-gray-background p-1 dark:bg-black-200 dark:text-white-light ${
						props.class ?? ''
					}`}>
					<Tab
						class="flex cursor-pointer rounded-lg py-2 px-4 text-sm font-medium"
						value={Modes.Dark}
						classList={{
							'bg-white dark:bg-black-100 dark:text-white-light bg-opacity-75 text-black cursor-default shadow-sm':
								isSelected(Modes.Dark),
						}}>
						<BsMoonStars class="my-auto" size={16}></BsMoonStars>
					</Tab>
					<Tab
						class="flex cursor-pointer rounded-lg py-2 px-4 align-middle text-sm font-medium"
						value="light"
						classList={{
							'bg-white dark:bg-black-100 dark:text-white-light bg-opacity-75 text-black cursor-default shadow-sm':
								isSelected(Modes.Light),
						}}>
						<WiDaySunny class="my-auto" size={26}></WiDaySunny>
					</Tab>
					<Tab
						class="flex cursor-pointer rounded-lg py-2 px-4 align-middle text-sm font-medium"
						value={Modes.System}
						classList={{
							'bg-white dark:bg-black-100 dark:text-white bg-opacity-75 text-black cursor-default shadow-sm':
								isSelected(Modes.System),
						}}>
						<span class="my-auto">System</span>
					</Tab>
				</TabList>
			)}
		</TabGroup>
	)
}

export default DarkModeToggle
