import { type FC } from 'react'

import refs from '@/assets/images/home/refs.svg'

import styles from './Referrals.module.scss'
import { useRefferals } from './useReferrals'

const Referrals: FC = () => {
	const { getReferralsCount, isLoading, inviteFriend } = useRefferals()

	return (
		<div className={styles.referrals}>
			<div>
				<img src={refs} alt='' />
				<span>{isLoading ? 'Loading...' : getReferralsCount()}</span>
			</div>
			<button onClick={inviteFriend}>
				Invite a friend
				<span></span>
			</button>
		</div>
	)
}

export default Referrals
