import { cva, VariantProps } from 'class-variance-authority'
import { Match, ParentComponent, Switch } from 'solid-js'
import Tooltip from './Tooltip'

const tag = cva('flex gap-1 rounded-full px-3 py-1 text-xs transition-all', {
	variants: {
		intent: {
			standard: 'bg-white text-black dark:bg-black-200 dark:text-white-dark',
			successful: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-white-dark',
			warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-white-dark',
			danger: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-white-dark',
			neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white-dark',
		},
	},
	defaultVariants: {
		intent: 'standard',
	},
})

interface TagProps extends VariantProps<typeof tag> {
	tooltip?: string
}

interface LinkTagProps extends TagProps {
	href: string
}

const Tag: ParentComponent<TagProps> = props => {
	return (
		<Switch>
			<Match when={props.tooltip}>
				<Tooltip text={props.tooltip} delay={1000}>
					<span class={`${tag({ intent: props.intent })}`}>{props.children}</span>
				</Tooltip>
			</Match>
			<Match when={true}>
				<span class={`${tag({ intent: props.intent })}`}>{props.children}</span>
			</Match>
		</Switch>
	)
}

const LinkTag: ParentComponent<LinkTagProps> = props => {
	return (
		<a
			href={props.href}
			class={`cursor-pointer ${tag({ intent: props.intent })}`}
			title={props.tooltip}
			target="_blank">
			{props.children}
		</a>
	)
}

export { Tag, LinkTag }
