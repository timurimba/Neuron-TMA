import { useMutation, useQuery } from '@tanstack/react-query'
import { toNano } from '@ton/core'
import { useMemo } from 'react'

import { TonService } from '@/services/ton/ton.service'
import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { IUser } from '@/types/user.types'

import { useStartInterval } from '@/hooks/useStartInterval'
import { useWallet } from '@/hooks/useWallet'

import { telegramId } from '@/consts/consts'
import { useIntervalStore, usePointsStore } from '@/store/store'

const images: any = import.meta.glob('@/assets/images/nft/*.png', {
	eager: true
})

export const useBuyNft = () => {
	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
	})

	const { intervalId } = useIntervalStore(state => state)

	const { startInterval } = useStartInterval()

	const randomImage: any = useMemo(() => {
		const keys = Object.keys(images)
		const randomIndex = Math.floor(Math.random() * keys.length)
		const randomKey = keys[randomIndex]
		return images[randomKey].default
	}, [])

	const { mutate: transferNft } = useMutation({
		mutationKey: ['transfer-nft'],
		mutationFn: (data: { wallet: string; randomNftAddress: string }) =>
			TonService.transferNft(data.wallet, data.randomNftAddress)
	})

	const { sender, wallet } = useWallet()

	const buyNft = async () => {
		try {
			await sender.send({
				to: import.meta.env.VITE_OWNER_WALLET_ADDRESS,
				value: toNano(7)
			})

			const availableNfts = await TonService.getNfts(
				import.meta.env.VITE_OWNER_WALLET_ADDRESS
			)

			if (availableNfts.length) {
				const randomNftAddress =
					availableNfts[Math.floor(Math.random() * availableNfts.length)]
						.address

				transferNft({
					wallet: wallet!,
					randomNftAddress
				})
				await UserService.setIsHadNft(telegramId, true)
				queryClient.invalidateQueries({
					queryKey: ['get-is-had-nft']
				})
				if (user && user.startTimer) {
					UserService.updatePoints(telegramId, usePointsStore.getState().points)
					clearInterval(intervalId!)
					startInterval(0.01)
				}
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	return { randomImage, buyNft }
}
