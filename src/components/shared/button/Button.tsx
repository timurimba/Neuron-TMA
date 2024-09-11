import type { FC, PropsWithChildren } from 'react'

import styles from './Button.module.scss'
import { IButtonProps } from './button.types'

const Button: FC<PropsWithChildren<IButtonProps>> = ({ children, ...rest }) => {
	return (
		<button {...rest} className={styles.button}>
			{children}
		</button>
	)
}

export default Button

