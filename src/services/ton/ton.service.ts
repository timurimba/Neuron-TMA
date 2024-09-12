import '@ton/core'
import { Address, beginCell, toNano } from '@ton/core'
import { sign } from 'ton-crypto'
import { mnemonicToKeyPair } from 'tonweb-mnemonic'

import { apiBlockchain } from '@/api/api'

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

		const keyPair = await mnemonicToKeyPair(mnemonicParts)

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

		const internalMessage = beginCell()
			.storeUint(0x18, 6) // bounce
			.storeAddress(Address.parse(nftContractAddress))
			.storeCoins(toNano(0.02))
			.storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1 that means we have body as a reference
			.storeRef(internalMessageBody)
			.endCell()

		const seqno = await TonService.getSeqnoWallet()

		const toSign = beginCell()
			.storeUint(698983191, 32) // subwallet_id
			.storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
			.storeUint(seqno, 32) // store seqno
			.storeUint(0, 8)
			.storeUint(3, 8)
			.storeRef(internalMessage)

		const signature = sign(
			toSign.endCell().hash(),
			Buffer.from(keyPair.secretKey)
		)

		const body = beginCell()
			.storeBuffer(signature)
			.storeBuilder(toSign)
			.endCell()

		// const externalMessage = external({
		// 	to: import.meta.env.VITE_OWNER_WALLET_ADDRESS,
		// 	body
		// })

		// internal({
		// 	to: nftContractAddress,
		// 	value: toNano(0.02),
		// 	body: internalMessageBody
		// })

		const externalMessage = beginCell()
			.storeUint(0b10, 2) // ext_in_msg_info$10
			.storeUint(0, 2) // src -> addr_none
			.storeAddress(Address.parse(import.meta.env.VITE_OWNER_WALLET_ADDRESS)) // Destination address
			.storeCoins(0) // Import Fee
			.storeBit(0) // No State Init
			.storeBit(1) // We store Message Body as a reference
			.storeRef(body) // Store Message Body as a reference
			.endCell()

		return await apiBlockchain.post('/blockchain/message', {
			boc: externalMessage.toBoc().toString('base64')
		})
	},

	getTransaction: async (transactionId: string) => {
		const { data } = await apiBlockchain.get(
			`/blockchain/transactions/${transactionId}`
		)

		return data.success
	}
}
