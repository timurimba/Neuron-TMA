import { useMutation } from '@tanstack/react-query'

import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { telegramId } from '@/consts/consts'
import { useIntervalStore, usePointsStore, useTimerStore } from '@/store/store'

export const restartIntervalWhenIsHadNft = () => {
	const { decreaseTimer } = useTimerStore(state => state)
	const { increasePoints } = usePointsStore(state => state)
	const { setIntervalId } = useIntervalStore(state => state)
	const { mutate: mutateStopTimer } = useMutation({
		mutationKey: ['stop-timer'],
		mutationFn: (telegramId: string) => UserService.stopTimer(telegramId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-user']
			})
		}
	})
	const intervalId = setInterval(() => {
		if (useTimerStore.getState().timer <= 0) {
			UserService.updatePoints(telegramId, usePointsStore.getState().points)
			mutateStopTimer(telegramId)
			clearInterval(intervalId)
			return
		}
		increasePoints(0.01)
		decreaseTimer()
	}, 1000)

	setIntervalId(intervalId)
}
