import { useMutation } from '@tanstack/react-query'
import { Address, Cell, toNano } from '@ton/core'
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
			const tx = await sender.send({
				// to: import.meta.env.VITE_OWNER_WALLET_ADDRESS,
				to: Address.parse(wallet!),
				value: toNano(0.01)
			})

			const binaryData = Buffer.from(tx.boc, 'base64')
			const transactionId = Cell.fromBoc(binaryData)[0].hash().toString('hex')

			let isSuccess = false

			await new Promise(resolve => {
				setTimeout(async () => {
					isSuccess = await TonService.getTransaction(transactionId)
					resolve(null)
				}, 30000)
			})

			if (isSuccess) {
				const availableNfts = await TonService.getNfts(
					import.meta.env.VITE_OWNER_WALLET_ADDRESS
				)

				const randomNftAddress =
					availableNfts[Math.floor(Math.random() * availableNfts.length)]
						.address

				transferNft({
					wallet: wallet!,
					randomNftAddress
				})
			}
		} catch (error: any) {
			console.log(error.messages)
		}
	}

	return { randomImage, buyNft }
}
