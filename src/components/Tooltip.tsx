import { autoPlacement, autoUpdate, offset } from '@floating-ui/dom'
import { useFloating } from 'solid-floating-ui'
import { children, createEffect, createSignal, JSX, onCleanup, ParentComponent, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

interface TooltipProps {
	text?: string
	component?: JSX.Element
}

const Tooltip: ParentComponent<TooltipProps> = props => {
	const childRef = children(() => props.children)

	const [show, setShow] = createSignal(false)
	const [tooltip, setTooltip] = createSignal<HTMLElement>()

	let position = useFloating(() => childRef() as HTMLElement, tooltip, {
		whileElementsMounted: autoUpdate,
		middleware: [offset(5), autoPlacement()],
	})

	const onHover = () => {
		setShow(true)
	}

	const onLeave = () => {
		setShow(false)
	}

	createEffect(() => {
		const child = childRef() as HTMLElement

		child.addEventListener('mouseover', onHover)
		child.addEventListener('mouseleave', onLeave)
	})

	onCleanup(() => {
		removeEventListener('mouseover', onHover)
		removeEventListener('mouseleave', onLeave)
	})

	return (
		<>
			<Show when={show()}>
				<Portal>
					<div
						style={{
							position: position?.strategy ?? 'absolute',
							top: `${position?.y ?? 0}px`,
							left: `${position?.x ?? 0}px`,
						}}
						ref={setTooltip}
						class="max-w-xs rounded-2xl bg-white px-3 py-2 text-sm text-black shadow-xl dark:bg-black-150 dark:text-white-darker">
						{props.text}
						{props.component}
					</div>
				</Portal>
			</Show>
			{childRef()}
		</>
	)
}

export default Tooltip
