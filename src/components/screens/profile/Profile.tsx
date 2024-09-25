import type { FC } from 'react'

import styles from './Profile.module.scss'
import BalanceNeurons from './balance-neurons/BalanceNeurons'
import Balance from './balance/Balance'
import BuyNft from './buy-nft/BuyNft'

const Profile: FC = () => {
	return (
		<div className={styles.profile}>
			<Balance />

			<BalanceNeurons />
			<BuyNft />
		</div>
	)
}

export default Profile
