import { SenderArguments } from '@ton/core'
import { CHAIN } from '@tonconnect/protocol'
import {
	SendTransactionResponse,
	useTonConnectUI,
	useTonWallet
} from '@tonconnect/ui-react'

export function useWallet(): {
	sender: {
		send: (args: SenderArguments) => Promise<SendTransactionResponse>
	}
	connected: boolean
	wallet: string | null
	network: CHAIN | null
} {
	const [tonConnectUI] = useTonConnectUI()
	const wallet = useTonWallet()
	return {
		sender: {
			send: async (args: SenderArguments) => {
				return await tonConnectUI.sendTransaction({
					messages: [
						{
							address: args.to.toString(),
							amount: args.value.toString(),
							payload: args.body?.toBoc().toString('base64')
						}
					],
					validUntil: Date.now() + 5 * 60 * 1000
				})
			}
		},
		connected: !!wallet?.account.address,
		wallet: wallet?.account.address ?? null,
		network: wallet?.account.chain ?? null
	}
}
