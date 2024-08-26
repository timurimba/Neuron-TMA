import { useMutation, useQuery } from '@tanstack/react-query'

import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { IUser } from '@/types/user.types'

import { telegramId } from '@/consts/consts'

export const useClicker = () => {
	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
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
