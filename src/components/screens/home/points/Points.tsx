import { type FC } from 'react'

import pointsImg from '@/assets/images/home/neuron-points.png'

import styles from './Points.module.scss'
import { usePointsStore } from '@/store/store'

const Points: FC = () => {
	const { points } = usePointsStore(state => state)

	const renderPoints = () => {
		const truncatedPoints = Math.floor(points * 100) / 100
		return truncatedPoints.toFixed(2)
	}

	return (
		<div className={styles.points}>
			<div>
				<img src={pointsImg} alt='Points Img' />
				<span>Neuron Points</span>
			</div>
			<span>{renderPoints()}</span>
		</div>
	)
}

export default Points
