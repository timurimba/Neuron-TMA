import TonWeb from 'tonweb'
import { mnemonicToKeyPair } from 'tonweb-mnemonic'

import { apiBlockchain } from '@/api/api'

const tonweb = new TonWeb(
	new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC')
)

export const TonService = {
	getBalance: async (walletAddress: string) => {
		const { data } = await apiBlockchain.get(`/accounts/${walletAddress}`)
		return data.balance
	},

	getNfts: async (walletAddress: string) => {
		const { data } = await apiBlockchain.get(
			`/accounts/${walletAddress}/nfts?collection=${import.meta.env.VITE_COLLECTION_ADDRESS}`
		)

		return data.nft_items
	},

	getCountAllNfts: async () => {
		const { data } = await apiBlockchain.get(
			`/nfts/collections/${import.meta.env.VITE_COLLECTION_ADDRESS}/items`
		)

		return data.nft_items.length
	},

	transferNft: async (
		newOwnerAddress: string,
		nftAddress: string,
		telegramUserId: string
	) => {
		// const messageBody = beginCell()
		// 	.storeUint(0x5fcc3d14, 32)
		// 	.storeAddress(Address.parse(newOwnerAddress))
		// 	.endCell()
		// const boc = beginCell()
		// 	.storeUint(0, 1)
		// 	.storeAddress(Address.parse(nftAddress))
		// 	.storeCoins(toNano('0.05'))
		// 	.storeRef(messageBody)
		// 	.endCell()
		// 	.toBoc()
		// const { secretKey } = await mnemonicToKeyPair(
		// 	import.meta.env.VITE_MNEMONIC.split(' ')
		// )
		// const signedBoc = Buffer.from(sign(boc, Buffer.from(secretKey))).toString(
		// 	'base64'
		// )
		// await apiBlockchain.post('/blockchain/message', {
		// 	boc: signedBoc

		// })
		const mnemonicParts = import.meta.env.VITE_MNEMONIC.split(' ')
		const keyPair = await mnemonicToKeyPair(mnemonicParts)
		const WalletClass = tonweb.wallet.all['v4R2']
		const wallet = new WalletClass(tonweb.provider, {
			publicKey: keyPair.publicKey,
			wc: 0
		})
		const nftItem = new TonWeb.token.nft.NftItem(tonweb.provider, {
			address: nftAddress
		})
		const seqno = parseInt(String(await wallet.methods.seqno().call())) || 0
		const amount = TonWeb.utils.toNano('0.02')
		const toAddress = new TonWeb.utils.Address(newOwnerAddress)
		const forwardAmount = TonWeb.utils.toNano('0.01')
		await wallet.methods
			.transfer({
				secretKey: keyPair.secretKey,
				toAddress: nftAddress,
				amount: amount,
				seqno: seqno,
				payload: await nftItem.createTransferBody({
					newOwnerAddress: toAddress,
					forwardAmount: forwardAmount,
					forwardPayload: new TextEncoder().encode('gift'),
					responseAddress: toAddress
				}),
				sendMode: 3
			})
			.send()
	}
}
