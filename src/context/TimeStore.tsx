import { Accessor, createContext, createSignal, onCleanup, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

const TimeStoreContext = createContext<Accessor<Date>>()

export function TimeStoreProvider(props: { children: any }) {
	const [store, setStore] = createSignal<Date>(new Date())

	const interval = setInterval(() => {
		setStore(new Date())
	}, 2000)

	onCleanup(() => {
		clearInterval(interval)
	})

	return <TimeStoreContext.Provider value={store}>{props.children}</TimeStoreContext.Provider>
}

export function useTimeStore() {
	return useContext<Accessor<Date>>(TimeStoreContext)
}
