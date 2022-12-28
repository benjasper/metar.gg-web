import { ParentComponent } from 'solid-js'

type ButtonProps = {
	onClick?: () => void
}

const Button: ParentComponent<ButtonProps> = props => {
	return (
		<button
			class="rounded-md bg-primary px-4 py-2 text-base font-semibold text-white transition-all hover:opacity-75 dark:bg-primary-light"
			onClick={props.onClick}>
			{props.children}
		</button>
	)
}

export default Button
