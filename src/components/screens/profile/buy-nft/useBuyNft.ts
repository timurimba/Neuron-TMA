import { useMutation } from '@tanstack/react-query'
import { toNano } from '@ton/core'
import { useMemo } from 'react'

import { TonService } from '@/services/ton/ton.service'

import { useWallet } from '@/hooks/useWallet'

const images: any = import.meta.glob('@/assets/images/nft/*.png', {
	eager: true
})

export const useBuyNft = () => {
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
				value: toNano(0.01)
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
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	return { randomImage, buyNft }
}
