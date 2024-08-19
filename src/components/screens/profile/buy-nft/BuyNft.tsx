import { type FC } from 'react'

import Button from '@/components/shared/button/Button'

import tonImage from '@/assets/images/ton.png'

import styles from './BuyNft.module.scss'
import { useBuyNft } from './useBuyNft'

const BuyNft: FC = () => {
	const { randomImage, buyNft } = useBuyNft()
	return (
		<div className={styles.wrapper}>
			<img src={randomImage} alt='' />
			<p>
				PRICE: 0.01 <img className='w-7 h-7' src={tonImage} alt='' />
			</p>
			<Button onClick={buyNft}>buy</Button>
		</div>
	)
}

export default BuyNft
