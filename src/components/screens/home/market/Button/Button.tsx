import React from 'react'

import Loader from '@/components/shared/loader/Loader'

import styles from './Button.module.scss'

type ButtonProps = {
	active: boolean
	onClick: () => void
	shortText: string
	fullText: string
	type: 'buy' | 'sale'
	isAnyButtonActive: boolean
	isDisabled?: boolean // Новое свойство для состояния активности
}

export const Button: React.FC<ButtonProps> = ({
	active,
	onClick,
	shortText,
	fullText,
	type,
	isAnyButtonActive,
	isDisabled = false
}) => {
	const buttonClass = type === 'buy' ? styles.buyButton : styles.saleButton
	const displayText = active ? fullText : shortText

	// Применяем промежуточный класс только если кнопка не активна и активна другая кнопка
	const buttonClasses = `${styles.button} ${buttonClass} ${active ? '' : styles.intermediate}`

	return (
		<button disabled={isDisabled} className={buttonClasses} onClick={onClick}>
			{isDisabled ? (
				<Loader isBlack={type === 'sale'} />
			) : (
				<span
					className={styles.buttonText}
					style={{ width: isAnyButtonActive && !active ? '1ch' : 'auto' }}
				>
					{displayText}
				</span>
			)}
		</button>
	)
}
