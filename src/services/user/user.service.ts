import { get, ref, set, update } from 'firebase/database'

import { apiTelegramBot } from '@/api/api'

import { database } from '@/database/firebase'

export const UserService = {
	getUserFields: async <T>(telegramUserId: string, fieldArg: string = '') => {
		const fieldRef = ref(database, `users/${telegramUserId}/${fieldArg}`)

		const field: T = (await get(fieldRef)).val()

		return field
	},

	stopTimer: async (telegramUserId: string) => {
		const userTimerRef = ref(database, `users/${telegramUserId}/timer`)

		return await set(userTimerRef, {
			isProcessing: false,
			duration: 28800,
			durationExit: 28800
		})
	},

	setIsHadNft: async (telegramUserId: string, value: boolean) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			isHadNft: value
		})
	},

	setAddressWallet: async (telegramUserId: string, addressWallet: string) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			addressWallet
		})
	},

	updatePoints: async (telegramUserId: string, points: number) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			points
		})
	},

	startTimer: async (telegramUserId: string) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			startTimer: Date.now(),
			countDownTime: Date.now()
		})
	},

	resetStartTimer: async (telegramUserId: string) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			startTimer: 0,
			countDownTime: 0
		})
	},
	setCountDownTimer: async (telegramUserId: string) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			countDownTime: Date.now()
		})
	},
	awardPointsToUser: async (telegramUserId: string, points: number) => {
		return await apiTelegramBot.post('/api/award-points', {
			telegramId: telegramUserId,
			points
		})
	},
	completeTask: async (telegramUserId: string, link: string) => {
		const userCompletedTasksRef = ref(
			database,
			`users/${telegramUserId}/completedTasks`
		)

		const tasks =
			(await get(userCompletedTasksRef)).val() !== null || undefined
				? Object.values((await get(userCompletedTasksRef)).val())
				: []

		tasks.push(link)

		await update(userCompletedTasksRef, {
			...tasks
		})
	}
}
