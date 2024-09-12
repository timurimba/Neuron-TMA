import { useMutation } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import Field from '@/components/shared/field/Field'
import Select from '@/components/shared/select/Select'

import { TaskService } from '@/services/task/task.service'
import { UserService } from '@/services/user/user.service'

import { queryClient } from '@/providers/tanstack/TanstackProvider'

import { ITaskCreateDTO } from '@/types/task.types'

import { budgetData, rewardsData } from './creation-task.data'
import { telegramId } from '@/consts/consts'
import { usePointsStore } from '@/store/store'
import { sleep } from '@/utils/sleep.utils'

export const useCreationTask = () => {
	const [isCreation, setIsCreation] = useState(false)
	const { setPoints } = usePointsStore(state => state)
	const [link, setLink] = useState('')

	const [step, setStep] = useState(1)

	const {
		register,
		setValue,
		getValues,
		watch,
		formState: { errors },
		handleSubmit,
		control
	} = useForm<ITaskCreateDTO>({
		mode: 'onChange'
	})

	const [budget, reward] = watch(['budget', 'reward'])

	useEffect(() => {
		if (budget && reward) {
			setValue('population', budget / reward)
		} else {
			setValue('population', 0)
		}
	}, [budget, reward])

	const { mutate: mutateVerify, isPending: isPendingVerification } =
		useMutation({
			mutationKey: ['bot-verify'],
			mutationFn: (channelId: string) => TaskService.checkBotAdmin(channelId),
			onSuccess: () => {
				toast.success("You've passed verification")
				setStep(3)
			},
			onError: () => {
				toast.error("You haven't passed verification")
			}
		})

	const { mutate: mutateDeploy, isPending: isPendingDeploy } = useMutation({
		mutationKey: ['deploy-task'],
		mutationFn: (task: ITaskCreateDTO) => TaskService.deployTask(task),
		onSuccess: async () => {
			toast.success("You've deployed the task")
			queryClient.invalidateQueries({
				queryKey: ['get-tasks']
			})
			UserService.updatePoints(
				telegramId,
				usePointsStore.getState().points - getValues('budget')!
			)
			setPoints(usePointsStore.getState().points - getValues('budget')!)
			setIsCreation(false)
			await sleep(1000)
			setStep(1)
			setValue('title', '')
			setLink('')
			setValue('link', '')
			setValue('budget', null)
			setValue('reward', null)
		},
		onError: () => {
			toast.error('Oops, try again')
		}
	})

	const isPending = isPendingDeploy || isPendingVerification

	const handleChangeLink = (e: ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value

		if (value.length === 0) {
			setLink('')
			setValue('link', '')
			return
		}

		if (!value.startsWith('@')) {
			value = '@' + value
		}

		setLink(value.trim())
		setValue('link', value.trim())
	}

	const handlerCopyBot = async () => {
		await navigator.clipboard.writeText('@neuron_admin_bot')
		toast.success('Copied!')
	}

	const renderSteps = () => {
		switch (step) {
			case 1: {
				return (
					<Field
						value={link}
						placeholder='@task_channel'
						type='text'
						{...register('link', {
							required: true
						})}
						onChange={handleChangeLink}
					/>
				)
			}
			case 2: {
				return ''
			}
			case 3: {
				return (
					<div className='flex flex-col gap-y-4'>
						<Field
							className={`${errors.title && '!border-red-500'}`}
							placeholder='Title'
							type='text'
							{...register('title', {
								required: true
							})}
						/>
						<Select
							control={control}
							name='budget'
							placeholder='NP Budget'
							options={budgetData}
						/>
						<Select
							control={control}
							name='reward'
							placeholder='NP Reward'
							options={rewardsData}
						/>
						<div className='px-[3px] flex items-center justify-between'>
							<div className='flex items-center gap-x-2'>
								<Users />
								<p>Amount of subscribers:</p>
							</div>
							<span>{watch('population')}</span>
						</div>
					</div>
				)
			}
		}
	}

	const renderTextButtonStep = () => {
		switch (step) {
			case 1: {
				return 'Enter'
			}
			case 2: {
				return 'Verify'
			}
			case 3: {
				return 'Deploy'
			}
		}
	}

	const renderStepTitle = () => {
		switch (step) {
			case 1: {
				return 'Add link to public group or channel'
			}
			case 2: {
				return (
					<>
						Add{' '}
						<span onClick={handlerCopyBot} className='font-bold cursor-pointer'>
							@neuron_admin_bot
						</span>{' '}
						to task channel with admin role
					</>
				)
			}
			case 3: {
				return 'Create your task'
			}
		}
	}

	return {
		isCreation,
		setIsCreation,
		handleSubmit,
		step,
		mutateDeploy,
		mutateVerify,
		setStep,
		renderStepTitle,
		renderSteps,
		renderTextButtonStep,
		isPending
	}
}
