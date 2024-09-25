import { useQuery } from '@tanstack/react-query'
import { type FC } from 'react'

import { UserService } from '@/services/user/user.service'

import pointsImg from '@/assets/images/home/neuron-points.svg'

import styles from './Points.module.scss'
import { telegramId } from '@/consts/consts'
import { usePointsStore } from '@/store/store'

const Points: FC = () => {
	const { points } = usePointsStore(state => state)
	const { data: isHadNft } = useQuery({
		queryKey: ['get-is-had-nft'],
		queryFn: () => UserService.getUserFields<boolean>(telegramId, 'isHadNft')
	})

	const renderPoints = () => {
		const truncatedPoints = Math.floor(points * 100) / 100
		return truncatedPoints.toFixed(2)
	}

	return (
		<div className={styles.points}>
			<div>
				<img src={pointsImg} alt='Points Img' />
				<p>
					Neuron Points <span>{isHadNft ? 'X5' : 'X1'}</span>
				</p>
			</div>
			<span>{renderPoints()}</span>
		</div>
	)
}

export default Points
