import cn from 'clsx'
import type { FC, PropsWithChildren } from 'react'

import styles from './Button.module.scss'
import { IButtonProps } from './button.types'

const Button: FC<PropsWithChildren<IButtonProps>> = ({
	children,
	className,
	...rest
}) => {
	return (
		<button {...rest} className={cn(styles.button, className)}>
			{children}
		</button>
	)
}

export default Button
