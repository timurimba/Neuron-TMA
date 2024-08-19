import { useQuery } from '@tanstack/react-query'

import { UserService } from '@/services/user/user.service'

export const useRefferals = () => {
	const { data: user, isLoading } = useQuery({
		queryKey: ['get-user'],
		queryFn: () =>
			UserService.getUser(`${window.Telegram.WebApp.initDataUnsafe.user!.id}`)
	})

	const inviteFriend = () => {
		window.open(
			`https://t.me/share/url?url=${encodeURIComponent(`Hi, here is a referral link to our App: https://t.me/Neuron_ton_bot?start=${window.Telegram.WebApp.initDataUnsafe.user!.id}`)}`,
			'_blank'
		)
	}

	const getReferralsCount = () => {
		if (user?.referrals) {
			return user.referrals.length
		}
		return 0
	}

	return { user, isLoading, getReferralsCount, inviteFriend }
}
