import type { FC } from 'react'

import Layout from '@/components/layout/Layout'

import styles from './Profile.module.scss'
import BalanceNeurons from './balance-neurons/BalanceNeurons'
import Balance from './balance/Balance'
import BuyNft from './buy-nft/BuyNft'

const Profile: FC = () => {
	return (
		<Layout>
			<div className={styles.profile}>
				<Balance />
				<BalanceNeurons />
				<BuyNft />
			</div>
		</Layout>
	)
}

export default Profile
