import { useQuery } from '@tanstack/react-query'
import { fromNano } from '@ton/core'
import { type FC } from 'react'

import { TonService } from '@/services/ton/ton.service'

import tonImg from '@/assets/images/ton.png'

import { useWallet } from '@/hooks/useWallet'

import styles from './Balance.module.scss'

const Balance: FC = () => {
	const { wallet } = useWallet()
	const { data: balance } = useQuery({
		queryKey: ['get-balance'],
		queryFn: () => TonService.getBalance(wallet!),
		enabled: !!wallet
	})

	return (
		<div className={styles.balance}>
			<div>
				<img src={tonImg} alt='' />
				TON
			</div>
			<span>{balance ? fromNano(balance) : '--'}</span>
		</div>
	)
}

export default Balance
