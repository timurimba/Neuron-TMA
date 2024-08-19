import { get, ref, update } from 'firebase/database'
import { Address } from 'ton-core'

import { IUser } from '@/types/user.types'

import { database } from '@/database/firebase'

export const UserService = {
	getUser: async (telegramUserId: string) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		const user: IUser = (await get(userRef)).val()

		return user
	},
	startTimer: async (telegramUserId: string) => {
		const userTimerRef = ref(database, `users/${telegramUserId}/timer`)

		return await update(userTimerRef, {
			isProcessing: true,
			exitTime: Date.now()
		})
	},
	setIsHadNft: async (telegramUserId: string) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			isHadNft: true
		})
	},
	setAddressWallet: async (telegramUserId: string, addressWallet: Address) => {
		const userRef = ref(database, `users/${telegramUserId}`)

		await update(userRef, {
			addressWallet
		})
	}
}
