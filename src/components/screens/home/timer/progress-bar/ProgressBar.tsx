import { type FC } from 'react'

import styles from './ProgressBar.module.scss'
import { DURATION_TIMER } from '@/consts/consts'
import { useTimerStore } from '@/store/store'
import { formatTime } from '@/utils/format-time.utils'

const ProgressBar: FC = () => {
	const { timer } = useTimerStore()
	// const { data: user } = useQuery({
	// 	queryKey: ['get-user'],
	// 	queryFn: () => UserService.getUserFields<IUser>(telegramId)
	// })

	return (
		<div className={styles.progress}>
			<div>
				<div
					style={{
						width: `${timer ? (timer / DURATION_TIMER) * 100 : 0}%`
					}}
				/>
				<span>{timer ? formatTime(timer) : 'Loading..'}</span>
			</div>
		</div>
	)
}

export default ProgressBar
