import { Tab, TabGroup, TabList } from 'solid-headless'
import { BsMoonStars } from 'solid-icons/bs'
import { WiDaySunny } from 'solid-icons/wi'
import { Component } from 'solid-js'
import { ThemeMode, useSettingsStore } from '../context/SettingsStore'

interface TabGroupProps {
	class?: string
}

const DarkModeToggle: Component<TabGroupProps> = props => {
	const [settingsStore, { setTheme }] = useSettingsStore()

	return (
		<TabGroup horizontal defaultValue={settingsStore.theme} class="flex" onChange={x => setTheme(x as ThemeMode)}>
			{({ isSelected }) => (
				<TabList
					class={`flex rounded-xl bg-gray-background p-1 dark:bg-black-200 dark:text-white-light ${
						props.class ?? ''
					}`}>
					<Tab
						class="flex cursor-pointer rounded-lg py-2 px-4 text-sm font-medium"
						value={ThemeMode.Dark}
						classList={{
							'bg-white dark:bg-black-100 dark:text-white-light bg-opacity-75 text-black cursor-default shadow-sm':
								isSelected(ThemeMode.Dark),
						}}>
						<BsMoonStars class="my-auto" size={16}></BsMoonStars>
					</Tab>
					<Tab
						class="flex cursor-pointer rounded-lg py-2 px-4 align-middle text-sm font-medium"
						value={ThemeMode.Light}
						classList={{
							'bg-white dark:bg-black-100 dark:text-white-light bg-opacity-75 text-black cursor-default shadow-sm':
								isSelected(ThemeMode.Light),
						}}>
						<WiDaySunny class="my-auto" size={26}></WiDaySunny>
					</Tab>
					<Tab
						class="flex cursor-pointer rounded-lg py-2 px-4 align-middle text-sm font-medium"
						value={ThemeMode.System}
						classList={{
							'bg-white dark:bg-black-100 dark:text-white bg-opacity-75 text-black cursor-default shadow-sm':
								isSelected(ThemeMode.System),
						}}>
						<span class="my-auto">System</span>
					</Tab>
				</TabList>
			)}
		</TabGroup>
	)
}

export default DarkModeToggle
