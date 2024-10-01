import '@ton/core'
import {
	Address,
	WalletContractV4,
	beginCell,
	internal,
	toNano
} from '@ton/ton'
import { mnemonicToWalletKey } from 'ton-crypto'

import { apiBlockchain, client } from '@/api/api'

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

	getSeqnoWallet: async () => {
		const { data } = await apiBlockchain.get(
			`/wallet/${import.meta.env.VITE_OWNER_WALLET_ADDRESS}/seqno`
		)

		return data.seqno
	},

	transferNft: async (newOwnerAddress: string, nftContractAddress: string) => {
		const mnemonicParts = import.meta.env.VITE_MNEMONIC.split(' ')

		const keyPair = await mnemonicToWalletKey(mnemonicParts)

		const seqno = await TonService.getSeqnoWallet()

		const wallet = WalletContractV4.create({
			publicKey: keyPair.publicKey,
			walletId: 698983191,
			workchain: 0
		})

		const internalMessageCustomPayload = beginCell()
			.storeUint(0, 32)
			.storeStringTail('You received an NFT from Neuron')
			.endCell()

		const internalMessageBody = beginCell()
			.storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
			.storeUint(0, 64) // query_id
			.storeAddress(Address.parse(newOwnerAddress)) // new_owner
			.storeAddress(Address.parse(import.meta.env.VITE_OWNER_WALLET_ADDRESS)) // response_destination for excesses
			.storeBit(1)
			.storeCoins(toNano(0.01)) // forward_amount
			.storeBit(1) // we  have custom_payload
			.storeRef(internalMessageCustomPayload)
			.endCell()

		const walletContract = client.open(wallet)

		return await walletContract.sendTransfer({
			secretKey: keyPair.secretKey,
			seqno,
			messages: [
				internal({
					value: toNano(0.03),
					to: nftContractAddress,
					body: internalMessageBody
				})
			]
		})
	},

	sellTon: async (responseWallet: string) => {
		const mnemonicParts = import.meta.env.VITE_MNEMONIC_MARKET.split(' ')

		const keyPair = await mnemonicToWalletKey(mnemonicParts)

		const seqno = await TonService.getSeqnoWallet()

		const wallet = WalletContractV4.create({
			publicKey: keyPair.publicKey,
			walletId: 698983191,
			workchain: 0
		})

		const walletContract = client.open(wallet)

		return await walletContract.sendTransfer({
			secretKey: keyPair.secretKey,
			seqno,
			messages: [
				internal({
					value: toNano(10),
					to: responseWallet,
					body: 'You received TON from Neuron'
				})
			]
		})
	},

	getTransaction: async (transactionId: string) => {
		const { data } = await apiBlockchain.get(
			`/blockchain/transactions/${transactionId}`
		)

		return data.success
	}
}
