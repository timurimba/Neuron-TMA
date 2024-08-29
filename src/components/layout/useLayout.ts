import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { TonService } from '@/services/ton/ton.service'
import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { IUser } from '@/types/user.types'

import { useStartInterval } from '@/hooks/useStartInterval'
import { useWallet } from '@/hooks/useWallet'

import { DURATION_TIMER, telegramId } from '@/consts/consts'
import { useIntervalStore, usePointsStore, useTimerStore } from '@/store/store'

export const useLayout = () => {
	const { wallet } = useWallet()

	const { setTimer } = useTimerStore(state => state)
	const { setPoints } = usePointsStore(state => state)
	// const { isProcessingTimer, setIsProcessingTimer } = useIsProcessingTimerStore(
	// 	state => state
	// )

	const { startInterval } = useStartInterval()
	const { intervalId } = useIntervalStore(state => state)
	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
	})

	useEffect(() => {
		const initIsHadNft = async () => {
			if (wallet && user && user.startTimer && !user.isHadNft) {
				const nfts = await TonService.getNfts(wallet)
				if (nfts.length) {
					UserService.setIsHadNft(telegramId)
					UserService.setCountDownTimer(telegramId)
					UserService.updatePoints(telegramId, usePointsStore.getState().points)
					clearInterval(intervalId!)
					startInterval(0.01)
				}
			}
		}
		initIsHadNft()
	}, [wallet, user])

	useEffect(() => {
		window.addEventListener('blur', () => {
			clearInterval(intervalId!)
		})
		window.addEventListener('focus', () => {
			queryClient.invalidateQueries({
				queryKey: ['get-user']
			})
		})
	}, [])

	// useEffect(() => {
	// 	const initTimer = async () => {
	// 		const isProcessingTimer = await cloudStorage.get('isProcessingTimer')

	// 		if (!!isProcessingTimer) {
	// 			setIsProcessingTimer(true)
	// 		}
	// 	}

	// 	initTimer()
	// }, [])

	useEffect(() => {
		clearInterval(intervalId!)
		if (user) {
			if (user.startTimer) {
				const init = () => {
					const elapsedTime = Math.floor(
						Math.min((Date.now() - user.startTimer) / 1000, DURATION_TIMER)
					)

					const remainingTime = DURATION_TIMER - elapsedTime

					const remainingTimeCountDownTime =
						DURATION_TIMER * 1000 - (user.startTimer - user.countDownTime)

					const elapsedTimeForPoints =
						Math.floor(
							Math.min(
								Date.now() - user.countDownTime,
								remainingTimeCountDownTime
							)
						) / 1000

					const points = user.isHadNft
						? elapsedTimeForPoints * 0.01
						: elapsedTimeForPoints * 0.002

					if (remainingTime === 0) {
						UserService.resetStartTimer(telegramId)
						UserService.updatePoints(telegramId, points + user.points)
						queryClient.invalidateQueries({
							queryKey: ['get-user']
						})
						return
					}

					setPoints(points + user.points)

					setTimer(remainingTime)

					startInterval(user.isHadNft ? 0.01 : 0.002)
				}
				init()
			} else {
				setTimer(DURATION_TIMER)
				setPoints(user.points)
			}
		}
	}, [user])
}
