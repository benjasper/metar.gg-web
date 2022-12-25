import { createContext, createEffect, onCleanup, ParentComponent, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

interface SettingsStore {
	theme: ThemeMode
}

enum ThemeMode {
	Light = 'light',
	Dark = 'dark',
	System = 'system',
}

type SettingsStoreContextInterface = [
	settingsStore: SettingsStore,
	actions: {
		setTheme: (theme: ThemeMode) => void
	}
]

const createSettingsStore = (): SettingsStore => {
	return {
		theme: ThemeMode.System,
	}
}

const SettingsStoreContext = createContext<SettingsStoreContextInterface>(
	undefined as unknown as SettingsStoreContextInterface
)

const SettingsStoreProvider: ParentComponent = props => {
	const [store, setStore] = createStore<SettingsStore>(createSettingsStore())

	const actions: SettingsStoreContextInterface[1] = {
		setTheme: (darkMode: ThemeMode) => setStore('theme', darkMode),
	}

	const evaluateColorScheme = () => {
		// If the toggle has selected a specific mode, use that, otherwise (if system is selected) use the system preference
		if (
			store.theme === ThemeMode.Dark ||
			(window.matchMedia('(prefers-color-scheme: dark)').matches && store.theme === ThemeMode.System)
		) {
			document.documentElement.classList.add('dark')
			// Set Meta Tag Theme Color
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000212')
		} else if (
			store.theme === ThemeMode.Light ||
			(!window.matchMedia('(prefers-color-scheme: dark)').matches && store.theme === ThemeMode.System)
		) {
			document.documentElement.classList.remove('dark')
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f9f8f9')
		}

		// Save the current mode
		localStorage.theme = store.theme
	}

	createEffect(evaluateColorScheme)

	// If the system preference changes, re-evaluate the color scheme
	const onSystemChange = (e: MediaQueryListEvent) => {
		evaluateColorScheme()
	}

	// Listen for system changes
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onSystemChange)

	onCleanup(() => {
		window.removeEventListener('change', onSystemChange as any)
	})

	return <SettingsStoreContext.Provider value={[store, actions]}>{props.children}</SettingsStoreContext.Provider>
}

function useSettingsStore() {
	return useContext<SettingsStoreContextInterface>(SettingsStoreContext)
}

export { ThemeMode, useSettingsStore, SettingsStoreProvider }
export type { SettingsStoreContextInterface }

