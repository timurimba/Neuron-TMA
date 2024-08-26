import { useMutation, useQuery } from '@tanstack/react-query'
import { Address } from '@ton/core'
import { useEffect } from 'react'

import { TonService } from '@/services/ton/ton.service'
import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { IUser } from '@/types/user.types'

import { useWallet } from '@/hooks/useWallet'

import { telegramId } from '@/consts/consts'
import { restartIntervalWhenIsHadNft } from '@/helpers/helper'
import { useIntervalStore, usePointsStore, useTimerStore } from '@/store/store'

export const useLayout = () => {
	const { wallet } = useWallet()

	const { mutate: mutateAddressWallet } = useMutation({
		mutationKey: ['set-address-wallet'],
		mutationFn: (data: { telegramId: string; wallet: string }) =>
			UserService.setAddressWallet(data.telegramId, data.wallet)
	})

	const { mutate: mutateIsHadNft } = useMutation({
		mutationKey: ['set-is-had-nft'],
		mutationFn: (telegramId: string) => UserService.setIsHadNft(telegramId)
	})

	const { intervalId, setIntervalId } = useIntervalStore(state => state)
	const { setTimer, decreaseTimer } = useTimerStore()
	const { setPoints, increasePoints } = usePointsStore()
	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
	})

	useEffect(() => {
		if (wallet && user && !user.isHadNft) {
			const seeIfThereIsNft = async () => {
				mutateAddressWallet({
					telegramId,
					wallet: Address.parse(wallet).toString()
				})
				const nfts = await TonService.getNfts(wallet)
				if (nfts.length) {
					mutateIsHadNft(telegramId)
					clearInterval(intervalId!)

					restartIntervalWhenIsHadNft()
				}
			}
			seeIfThereIsNft()
		}
	}, [wallet, user])

	useEffect(() => {}, [])

	const { mutate: mutateStopTimer } = useMutation({
		mutationKey: ['stop-timer'],
		mutationFn: (telegramId: string) => UserService.stopTimer(telegramId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-user']
			})
		}
	})

	useEffect(() => {
		window.addEventListener('unload', () => {
			// if (document.hidden) {
			// 	const safePoints = JSON.stringify({
			// 		telegramId,
			// 		points: usePointsStore.getState().points
			// 	})
			// 	const safeDurationExit = JSON.stringify({
			// 		telegramId,
			// 		durationExit: useTimerStore.getState().timer
			// 	})
			// 	navigator.sendBeacon(import.meta.env.VITE_API_SAFE_POINTS, safePoints)
			// 	navigator.sendBeacon(
			// 		import.meta.env.VITE_API_SAFE_DURATION_EXIT,
			// 		safeDurationExit
			// 	)
			// }
			localStorage.setItem('test', 'From Local Storage Unload')
		})
	}, [])

	useEffect(() => {
		if (intervalId) {
			clearInterval(intervalId)
		}

		if (user) {
			if (user.timer.isProcessing) {
				const pastTimeForTimer = Math.min(
					Math.floor((Date.now() - user.timer.dateStartingTimer) / 1000),
					user.timer.duration
				)

				const remainingTime = user.timer.duration - pastTimeForTimer

				const pastTimeForPoints =
					user.timer.duration -
					remainingTime -
					(user.timer.duration - user.timer.durationExit)

				const points = user.isHadNft
					? 0.01 * pastTimeForPoints
					: 0.002 * pastTimeForPoints

				setPoints(user.points + points)

				if (remainingTime === 0) {
					mutateStopTimer(telegramId)
					UserService.updatePoints(telegramId, usePointsStore.getState().points)
					return
				}

				setTimer(remainingTime)

				const intervalId = setInterval(() => {
					if (useTimerStore.getState().timer <= 0) {
						UserService.updatePoints(
							telegramId,
							usePointsStore.getState().points
						)
						mutateStopTimer(telegramId)
						clearInterval(intervalId)
						return
					}
					increasePoints(user.isHadNft ? 0.01 : 0.002)
					decreaseTimer()
				}, 1000)

				setIntervalId(intervalId)
			} else {
				setTimer(user.timer.duration)
				setPoints(user.points)
			}
		}
	}, [user])
}
