import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { telegramId } from '@/consts/consts'
import { useIntervalStore, usePointsStore, useTimerStore } from '@/store/store'

export const useStartInterval = () => {
	const { decreaseTimer } = useTimerStore(state => state)
	const { increasePoints } = usePointsStore(state => state)
	const { setIntervalId } = useIntervalStore(state => state)
	const startInterval = (coefficient: number) => {
		const id = setInterval(() => {
			if (useTimerStore.getState().timer <= 0) {
				UserService.resetStartTimer(telegramId)
				UserService.updatePoints(telegramId, usePointsStore.getState().points)
				queryClient.invalidateQueries({
					queryKey: ['get-user']
				})
				clearInterval(id)
				return
			}
			decreaseTimer()
			increasePoints(coefficient)
		}, 1000)
		setIntervalId(id)
	}

	return { startInterval }
}
