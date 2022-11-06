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
	// Represents the state of the toggle
	const [selected, setSelected] = createSignal<Modes>(localStorage.getItem('theme') as Modes ?? Modes.System)

	const evaluateColorScheme = () => {

		// If the toggle has selected a specific mode, use that, otherwise (if system is selected) use the system preference
		if (selected() === Modes.Dark || (window.matchMedia('(prefers-color-scheme: dark)').matches && selected() === Modes.System)) {
			document.documentElement.classList.add('dark')
			// Set Meta Tag Theme Color
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000212')
		} else if (selected() === Modes.Light || (!window.matchMedia('(prefers-color-scheme: dark)').matches && selected() === Modes.System)) {
			document.documentElement.classList.remove('dark')
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f9f8f9')
		}

		// Save the current mode
		localStorage.theme = selected()
	}

	createEffect(evaluateColorScheme)

	// If the system preference changes, re-evaluate the color scheme
	const onSystemChange = (e: MediaQueryListEvent) => {
		evaluateColorScheme()
	}

	// Listen for system changes
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onSystemChange)

	onCleanup(() => {
		window.removeEventListener('change', onSystemChange)
	})

	return (
		<TabGroup horizontal defaultValue={selected()} class="flex" onChange={x => setSelected(x as Modes)}>
			{({ isSelected }) => (
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
