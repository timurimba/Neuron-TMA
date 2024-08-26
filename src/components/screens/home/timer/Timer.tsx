import { type FC } from 'react'

import styles from './Timer.module.scss'
import Clicker from './clicker/Clicker'
import ProgressBar from './progress-bar/ProgressBar'

const Timer: FC = () => {
	return (
		<div className={styles.timer}>
			<ProgressBar />
			<Clicker />
		</div>
	)
}

export default Timer
