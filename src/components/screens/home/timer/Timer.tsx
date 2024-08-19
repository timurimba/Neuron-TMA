import { type FC } from 'react'

import { useTimer } from '../useTimer'

import styles from './Timer.module.scss'
import Clicker from './clicker/Clicker'
import ProgressBar from './progress-bar/ProgressBar'

const Timer: FC = () => {
	useTimer()
	return (
		<div className={styles.timer}>
			<ProgressBar />
			<Clicker />
		</div>
	)
}

export default Timer
