import { useQuery } from '@tanstack/react-query'

import { TonService } from '@/services/ton/ton.service'

import { useWallet } from '@/hooks/useWallet'

export const useBalanceNeurons = () => {
	const { wallet } = useWallet()
	const { data: myCountNft, isLoading: isLoadingMyCountNft } = useQuery({
		queryKey: ['get-my-count-nfts'],
		queryFn: () => TonService.getNfts(wallet!),
		enabled: !!wallet
	})

	const { data: availableCountNfts, isLoading: isLoadingAvailableCountNft } =
		useQuery({
			queryKey: ['get-available-count-nfts'],
			queryFn: () =>
				TonService.getNfts(import.meta.env.VITE_OWNER_WALLET_ADDRESS)
		})
	const { data: countAllNfts, isLoading: isLoadingCountAllNfts } = useQuery({
		queryKey: ['get-count-all-nfts'],
		queryFn: () => TonService.getCountAllNfts()
	})

	const isLoadingCountNfts = isLoadingCountAllNfts || isLoadingAvailableCountNft

	return {
		myCountNft: myCountNft.length ? myCountNft.length : 0,
		availableCountNfts: availableCountNfts?.length!,
		countAllNfts,
		isLoadingCountNfts,
		isLoadingMyCountNft
	}
}
