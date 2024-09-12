import React, { useState } from 'react'

import {
	BUY_TEXT_FULL,
	BUY_TEXT_SHORT,
	SALE_TEXT_FULL,
	SALE_TEXT_SHORT
} from '../../../../consts/consts'

import styles from './Market.module.scss'
import Button from './button/Button'

const Market: React.FC = () => {
	const [activeButton, setActiveButton] = useState<'buy' | 'sale' | null>(null)

	// Проверяем, активна ли хоть одна кнопка
	const isAnyButtonActive = activeButton !== null

	return (
		<div className={styles.container}>
			<Button
				active={activeButton === 'buy'}
				onClick={() => setActiveButton('buy')}
				shortText={BUY_TEXT_SHORT}
				fullText={BUY_TEXT_FULL}
				type='buy'
				isAnyButtonActive={isAnyButtonActive}
			/>
			<Button
				active={activeButton === 'sale'}
				onClick={() => setActiveButton('sale')}
				shortText={SALE_TEXT_SHORT}
				fullText={SALE_TEXT_FULL}
				type='sale'
				isAnyButtonActive={isAnyButtonActive}
			/>
		</div>
	)
}

export default Market
