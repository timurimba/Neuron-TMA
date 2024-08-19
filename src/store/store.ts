import { create } from 'zustand'

interface ITimerStore {
	points: number
	updatePoints: (points: number) => void
	timerValue: string
	updateTimerValue: (timerValue: string) => void
}

export const useTimerStore = create<ITimerStore>(set => ({
	timerValue: '',
	updateTimerValue: timerValue => set(() => ({ timerValue })),
	points: 0,
	updatePoints: points => set(() => ({ points }))
}))
