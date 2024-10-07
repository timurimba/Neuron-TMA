import { type FC } from 'react'

import Button from '@/components/shared/button/Button'

import tonImage from '@/assets/images/ton.png'

import { useWallet } from '@/hooks/useWallet'

import styles from './BuyNft.module.scss'
import { useBuyNft } from './useBuyNft'

const BuyNft: FC = () => {
	const { randomImage, buyNft } = useBuyNft()
	const { connected } = useWallet()
	return (
		<div className={styles.wrapper}>
			<img src={randomImage} alt='' />
			<p>
				PRICE: 7 <img className='w-7 h-7' src={tonImage} alt='' />
			</p>
			<Button disabled={!connected} onClick={buyNft}>
				buy
			</Button>
		</div>
	)
}

export default BuyNft
