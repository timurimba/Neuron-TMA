import { type FC } from 'react'

import styles from './ProgressBar.module.scss'
import { useTimerStore } from '@/store/store'
import { formatTime } from '@/utils/format-time.utils'

const ProgressBar: FC = () => {
	const { timerValue } = useTimerStore(state => state)
	return (
		<div className={styles.progress}>
			<div>
				<div
					style={{
						width: `${timerValue.length ? (Number(timerValue) / 28800) * 100 : 0}%`
					}}
				/>
				<span>
					{timerValue.length ? formatTime(Number(timerValue)) : 'Loading..'}
				</span>
			</div>
		</div>
	)
}

export default ProgressBar
