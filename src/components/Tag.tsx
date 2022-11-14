import { mergeProps, ParentComponent } from 'solid-js'

interface TagProps {
	colorClasses?: string
	class?: string
}

interface LinkTagProps extends TagProps {
	href: string
}

const classes = 'flex rounded-full px-3 py-1 text-xs'

const Tag: ParentComponent<TagProps> = props => {
	props = mergeProps<[TagProps, TagProps]>(
		{ colorClasses: 'bg-white text-black dark:bg-black-200 dark:text-white-dark', class: '' },
		props
	)

	return <span class={`cursor-default ${classes} ${props.colorClasses} ${props.class}`}>{props.children}</span>
}

const LinkTag: ParentComponent<LinkTagProps> = props => {
	props = mergeProps<[LinkTagProps, LinkTagProps]>(
		{ colorClasses: 'bg-white text-black dark:bg-black-200 dark:text-white-dark', class: '', href: '' },
		props
	)

	return (
		<a href={props.href} class={`${classes} ${props.colorClasses} ${props.class}`} target="_blank">
			{props.children}
		</a>
	)
}

export { Tag, LinkTag }
