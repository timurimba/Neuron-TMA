import { useQuery } from '@tanstack/react-query'
import type { FC } from 'react'

import { UserService } from '@/services/user/user.service'

import pointsImg from '@/assets/images/home/neuron-points.png'

import styles from './Points.module.scss'
import { useTimerStore } from '@/store/store'

const Points: FC = () => {
	const { data: user, isLoading } = useQuery({
		queryKey: ['get-user'],
		queryFn: () =>
			UserService.getUser(`${window.Telegram.WebApp.initDataUnsafe.user!.id}`)
	})

	const { points } = useTimerStore(state => state)

	return (
		<div className={styles.points}>
			<div>
				<img src={pointsImg} alt='Points Img' />
				<span>Neuron Points</span>
			</div>
			<span>
				{isLoading
					? 'Loading...'
					: points
						? points.toFixed(2)
						: user?.points.toFixed(2)}
			</span>
		</div>
	)
}

export default Points
