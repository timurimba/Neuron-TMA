import { Address, beginCell, external, storeMessage, toNano } from '@ton/core'
import { sign } from 'ton-crypto'
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

	transferNft: async (newOwnerAddress: string, nftContractAddress: string) => {
		const payload = beginCell()
			.storeUint(0x5fcc3d14, 32) // selector для transfer
			.storeUint(0, 64) // query_id
			.storeAddress(Address.parse(nftContractAddress))
			.storeAddress(Address.parse(newOwnerAddress)) // Адрес получателя
			.storeAddress(Address.parse(import.meta.env.VITE_OWNER_WALLET_ADDRESS)) // Адрес отправителя (оставляется для обработки)
			.storeAddress(null) // forward_payload - в данном случае пустой
			.storeBit(0) // forward_fee - 0
			.storeCoins(toNano(0)) // forward_amount - 0
			.endCell()

		const externalMessage = beginCell()
			.store(
				storeMessage(
					external({
						to: import.meta.env.VITE_OWNER_WALLET_ADDRESS,
						body: payload
					})
				)
			)
			.endCell()
			.toBoc()

		const mnemonicParts = import.meta.env.VITE_MNEMONIC.split(' ')
		const keyPair = await mnemonicToKeyPair(mnemonicParts)

		const signature = sign(externalMessage, Buffer.from(keyPair.secretKey))

		const signedExternalMessage = beginCell()
			.storeBuffer(signature)
			.storeBuffer(externalMessage)
			.endCell()
			.toBoc()
			.toString('base64')
		await apiBlockchain.post('/blockchain/message', {
			boc: signedExternalMessage
		})

		const WalletClass = tonweb.wallet.all['v4R2']
		const wallet = new WalletClass(tonweb.provider, {
			publicKey: keyPair.publicKey,
			wc: 0
		})
		const nftItem = new TonWeb.token.nft.NftItem(tonweb.provider, {
			address: nftContractAddress
		})
		const seqno = parseInt(String(await wallet.methods.seqno().call())) || 0
		const amount = TonWeb.utils.toNano('0.02')
		const toAddress = new TonWeb.utils.Address(newOwnerAddress)
		const forwardAmount = TonWeb.utils.toNano('0.01')
		await wallet.methods
			.transfer({
				secretKey: keyPair.secretKey,
				toAddress: nftContractAddress,
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
	},

	getTransaction: async (transactionId: string) => {
		const { data } = await apiBlockchain.get(
			`/blockchain/transactions/${transactionId}`
		)

		return data.success
	}
}
