import { get, ref, set, update } from 'firebase/database'

import { database } from '@/database/firebase'

export const UserService = {
	getUserFields: async <T>(telegramUserId: string, fieldArg: string = '') => {
		const fieldRef = ref(database, `users/${telegramUserId}/${fieldArg}`)

		const field: T = (await get(fieldRef)).val()

		return field
	},

	startTimer: async (telegramUserId: string) => {
		const userTimerRef = ref(database, `users/${telegramUserId}/timer`)

		return await update(userTimerRef, {
			isProcessing: true,
			dateStartingTimer: Date.now()
		})
	},

	stopTimer: async (telegramUserId: string) => {
		const userTimerRef = ref(database, `users/${telegramUserId}/timer`)

		return await set(userTimerRef, {
			isProcessing: false,
			duration: 28800,
			durationExit: 28800
		})
	},
	setIsHadNft: async (telegramUserId: string) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			isHadNft: true
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
	setDurationExit: async (telegramUserId: string, durationExit: number) => {
		const userTimerRef = ref(database, `users/${telegramUserId}/timer`)

		await update(userTimerRef, { durationExit })
	}
}
