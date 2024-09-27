import { type FC } from 'react'

import support from '@/assets/images/profile/support.svg'

import styles from './BalanceNeurons.module.scss'
import { useBalanceNeurons } from './useBalanceNeurons'

const BalanceNeurons: FC = () => {
	const {
		isLoadingCountNfts,
		isLoadingMyCountNft,
		myCountNft,
		availableCountNfts,
		countAllNfts
	} = useBalanceNeurons()

	return (
		<div className={styles.wrapper}>
			<div>
				<h2>My <br /> NEURONs</h2>
				<strong>
					{isLoadingMyCountNft ? 'Loading...' : myCountNft ? myCountNft : 0}
				</strong>
				<a href='https://t.me/StudyLabs_team'>
					<img className='h-10 w-10' src={support} alt='' />
					<span>Support</span>
				</a>
			</div>
			<div>
				<div>
					<p>Open <br /> NEURONs</p>
					
					<span>
					<strong>
						{isLoadingCountNfts
							? 'Loading...'
							: `${availableCountNfts}/${countAllNfts}`}
							</strong>
					</span>
					<div className={styles.amountNeuronWrapper}>
					<p >
						<span>Get:</span> 
						<span>x5 on NP</span>
					</p>
					<p className={styles.amountNeuron}>5000 NEUR</p>
					</div>
				</div>
				<div>
					<div
						style={{
							height: `${(availableCountNfts / countAllNfts) * 100}%`
						}}
					></div>
				</div>
			</div>
		</div>
	)
}

export default BalanceNeurons
