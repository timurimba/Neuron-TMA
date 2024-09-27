import { useMutation, useQuery } from '@tanstack/react-query'
import { Address } from '@ton/core'
import { useEffect } from 'react'

import { TonService } from '@/services/ton/ton.service'
import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { IUser } from '@/types/user.types'

import { usePageVisibility } from '@/hooks/usePageVisibility'
import { useStartInterval } from '@/hooks/useStartInterval'
import { useWallet } from '@/hooks/useWallet'

import { DURATION_TIMER, telegramId } from '@/consts/consts'
import {
	useForceUpdate,
	useIntervalStore,
	usePointsStore,
	useTimerStore
} from '@/store/store'

export const useLayout = () => {
	const { wallet } = useWallet()

	const { setTimer } = useTimerStore(state => state)
	const { setPoints } = usePointsStore(state => state)
	const { forceUpdate, setForceUpdate } = useForceUpdate(state => state)
	const isVisible = usePageVisibility()

	const { startInterval } = useStartInterval()
	const { intervalId } = useIntervalStore(state => state)

	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
	})

	const { mutateAsync: mutateVerifyTimer } = useMutation({
		mutationFn: (telegramId: string) => UserService.verifyEndTimer(telegramId),
		mutationKey: ['verify-timer']
	})

	useEffect(() => {
		const initIsHadNft = async () => {
			if (wallet && user) {
				UserService.setAddressWallet(
					telegramId,
					Address.parse(wallet!).toString({
						bounceable: false
					})
				)

				const nfts = await TonService.getNfts(wallet)

				if (nfts.length && !user.isHadNft) {
					UserService.setIsHadNft(telegramId, true)
					queryClient.invalidateQueries({
						queryKey: ['get-is-had-nft']
					})
					if (user.startTimer) {
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

						UserService.awardPointsToUser(telegramId, points)

						UserService.setCountDownTimer(telegramId)

						UserService.updatePoints(
							telegramId,
							usePointsStore.getState().points
						)

						clearInterval(intervalId!)
						startInterval(0.01)
					}
				}
				if (!nfts.length && user.isHadNft) {
					UserService.setIsHadNft(telegramId, false)
					queryClient.invalidateQueries({
						queryKey: ['get-is-had-nft']
					})
					if (user.startTimer) {
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

						UserService.awardPointsToUser(telegramId, points)
						UserService.setCountDownTimer(telegramId)
						UserService.updatePoints(
							telegramId,
							usePointsStore.getState().points
						)

						clearInterval(intervalId!)
						startInterval(0.002)
					}
				}
			}

			if (!wallet && user && user.isHadNft) {
				UserService.setIsHadNft(telegramId, false)
				queryClient.invalidateQueries({
					queryKey: ['get-is-had-nft']
				})
				if (user.startTimer) {
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

					UserService.awardPointsToUser(telegramId, points)
					UserService.setCountDownTimer(telegramId)
					UserService.updatePoints(telegramId, usePointsStore.getState().points)

					clearInterval(intervalId!)
					startInterval(0.002)
				}
			}
		}

		initIsHadNft()
	}, [wallet, user])

	useEffect(() => {
		if (!isVisible) {
			clearInterval(intervalId!)
		} else {
			setForceUpdate()
		}
	}, [isVisible])

	useEffect(() => {
		clearInterval(intervalId!)
		if (user) {
			if (user.startTimer) {
				const init = async () => {
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
						const data = await mutateVerifyTimer(telegramId)
						if (data.isVerify) {
							UserService.resetStartTimer(telegramId)

							UserService.updatePoints(telegramId, points + user.points)
							UserService.awardPointsToUser(telegramId, points)
							queryClient.invalidateQueries({
								queryKey: ['get-user']
							})
						} else {
							setPoints(data.points + user.points)

							setTimer(data.timer)

							startInterval(user.isHadNft ? 0.01 : 0.002)
						}
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
	}, [user, forceUpdate])
}
