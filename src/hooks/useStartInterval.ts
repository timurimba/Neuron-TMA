import {
	useForceUpdate,
	useIntervalStore,
	usePointsStore,
	useTimerStore
} from '@/store/store'

export const useStartInterval = () => {
	const { decreaseTimer } = useTimerStore(state => state)
	const { increasePoints } = usePointsStore(state => state)
	const { setIntervalId } = useIntervalStore(state => state)
	const { setForceUpdate } = useForceUpdate(state => state)

	const startInterval = (coefficient: number) => {
		const id = setInterval(() => {
			if (useTimerStore.getState().timer <= 0) {
				setForceUpdate()
				return
			}
			decreaseTimer()
			increasePoints(coefficient)
		}, 1000)
		setIntervalId(id)
	}

	return { startInterval }
}
