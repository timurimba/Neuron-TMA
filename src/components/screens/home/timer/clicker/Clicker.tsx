import { type FC } from 'react'

import Face2 from '@/assets/images/home/face2.png'
import Face from '@/assets/images/home/face.png'
import Info from '@/assets/images/home/info.svg'
import LeftArm from '@/assets/images/home/left hand.png'
import RightArm from '@/assets/images/home/right hand.png'

import styles from './Clicker.module.scss'
import { useClicker } from './useClicker'
import { telegramId } from '@/consts/consts'

const Clicker: FC = () => {
	const { user, mutate, isPending } = useClicker()
	// const { isProcessingTimer, setIsProcessingTimer } = useIsProcessingTimerStore(
	// 	state => state
	// )

	return (
		<div className={styles.clicker}>
 <a href="https://t.me/Neuron_terms_channel" target="_blank" rel="noopener noreferrer">
            <img className={styles.info} src={Info} alt='Info' />
        </a>			<div className={styles.container}>
				<img
					onClick={() => {
						if (!isPending && user && !user.startTimer) {
							mutate(telegramId)
						}
					}}
					src={user?.startTimer ? Face2 : Face}
					alt='Face'
				/>
				<img src={LeftArm} alt='Left Arm' />
				<img src={RightArm} alt='Right Arm' />
			</div>
		</div>
	)
}

export default Clicker
