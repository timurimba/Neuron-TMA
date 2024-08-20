import { onValue, ref, update } from 'firebase/database'
import { useEffect } from 'react'

import { TonService } from '@/services/ton/ton.service'
import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { useWallet } from '@/hooks/useWallet'

import { telegramId } from '@/consts/consts'
import { database } from '@/database/firebase'
import { useTimerStore } from '@/store/store'

export const useTimer = () => {
	const { updateTimerValue, updatePoints } = useTimerStore(state => state)
	const { wallet } = useWallet()

	useEffect(() => {
		if (wallet) {
			const setIsHadNft = async () => {
				const nfts = await TonService.getNfts(wallet)
				if (nfts.length) {
					UserService.setIsHadNft(`${telegramId}`)
				}
			}
			setIsHadNft()
		}
	}, [wallet])

	const initTimer = async () => {
		const userRef = ref(database, `users/${telegramId}`)
		let intervalId: NodeJS.Timeout | null = null

		onValue(userRef, async snapshot => {
			const user = snapshot.val()

			if (intervalId) {
				clearInterval(intervalId)
			}

			if (user.timer && user.timer.isProcessing && user.timer.value > 0) {
				const timeLeft = Date.now() - user.timer.exitTime

				const timerValue = Math.floor(user.timer.value - timeLeft / 1000)

				let points = 0

				if (timeLeft / 1000 >= 1) {
					points = user.isHadHft
						? user.points + 0.01 * (timeLeft / 1000)
						: user.points + 0.002 * (timeLeft / 1000)
				} else {
					points = user.isHadHft ? user.points + 0.01 : user.points + 0.002
				}

				intervalId = setInterval(async () => {
					update(userRef, {
						timer: {
							value: timerValue,
							exitTime: Date.now(),
							isProcessing: true
						},
						points
					})
					updateTimerValue(timerValue.toString())
					updatePoints(points)
				}, 1000)
			} else {
				await update(userRef, {
					timer: {
						value: 28800,
						isProcessing: false
					}
				})
				updateTimerValue('28800')
				queryClient.invalidateQueries({
					queryKey: ['get-user']
				})
			}
		})
	}

	useEffect(() => {
		initTimer()
	}, [])
}
