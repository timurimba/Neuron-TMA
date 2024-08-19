import { useMutation, useQuery } from '@tanstack/react-query'

import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

export const useClicker = () => {
	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () =>
			UserService.getUser(`${window.Telegram.WebApp.initDataUnsafe.user!.id}`)
	})

	const { mutate } = useMutation({
		mutationKey: ['start-timer'],
		mutationFn: (telegramUserId: string) =>
			UserService.startTimer(telegramUserId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-user']
			})
		}
	})

	return { mutate, user }
}
