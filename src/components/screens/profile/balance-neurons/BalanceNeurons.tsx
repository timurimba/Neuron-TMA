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
				<h2>My NEURONs</h2>
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
					<p>Open NEURONs</p>
					<p >
						<span>Get</span> 
						<span>x5 NP</span>
					</p>
					<p>Get 5000 NEUR</p>
					<span>
						{isLoadingCountNfts
							? 'Loading...'
							: `${availableCountNfts}/${countAllNfts}`}
					</span>
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
