import { useQuery } from '@tanstack/react-query'
import { type FC } from 'react'

import { UserService } from '@/services/user/user.service'

import { IUser } from '@/types/user.types'

import styles from './ProgressBar.module.scss'
import { telegramId } from '@/consts/consts'
import { useTimerStore } from '@/store/store'
import { formatTime } from '@/utils/format-time.utils'

const ProgressBar: FC = () => {
	const { timer } = useTimerStore()
	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
	})

	return (
		<div className={styles.progress}>
			<div>
				<div
					style={{
						width: `${timer ? (timer / user!.timer.duration) * 100 : 0}%`
					}}
				/>
				<span>{timer ? formatTime(timer) : 'Loading..'}</span>
			</div>
		</div>
	)
}

export default ProgressBar
