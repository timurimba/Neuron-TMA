import { type FC } from 'react'

import pointsImg from '@/assets/images/home/neuron-points.png'

import styles from './Points.module.scss'
import { usePointsStore } from '@/store/store'

const Points: FC = () => {
	const { points } = usePointsStore(state => state)

	return (
		<div className={styles.points}>
			<div>
				<img src={pointsImg} alt='Points Img' />
				<span>Neuron Points</span>
				<span>{window.Telegram.WebApp.storage.getItem('test')}</span>
			</div>
			<span>{points?.toFixed(2)}</span>
		</div>
	)
}

export default Points
