import cn from 'clsx'
import { forwardRef } from 'react'

import styles from './Field.module.scss'
import { IField } from './field.types'

const Field = forwardRef<HTMLInputElement, IField>(
	({ className, ...rest }, ref) => {
		return (
			<input
				className={cn(styles.field, className)}
				{...rest}
				ref={ref}
			></input>
		)
	}
)

export default Field
