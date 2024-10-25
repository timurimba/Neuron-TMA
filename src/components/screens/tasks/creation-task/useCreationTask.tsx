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
	const [isBotTask, setIsBotTask] = useState(false) // Новое состояние для отслеживания задач на бота

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [budget, reward])

	const { mutate: mutateVerify, isPending: isPendingVerification } =
		useMutation({
			mutationKey: ['bot-verify'],
			mutationFn: (channelId: string) => TaskService.checkBotAdmin(channelId),
			onSuccess: () => {
				toast.success('Вы прошли проверку')
				setStep(3)
			},
			onError: () => {
				toast.error('Вы не прошли проверку')
			}
		})

	const { mutate: mutateDeploy, isPending: isPendingDeploy } = useMutation({
		mutationKey: ['deploy-task'],
		mutationFn: (task: ITaskCreateDTO) => TaskService.deployTask(task),
		onSuccess: async () => {
			toast.success("You've deployed the task")
			queryClient.invalidateQueries({ queryKey: ['get-tasks'] })

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
			setIsBotTask(false) // Сброс состояния задачи на бота после развертывания
		},
		onError: () => {
			toast.error('Ошибка, попробуйте снова')
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

		// Проверяем, если значение заканчивается на 'bot', чтобы установить состояние
		if (value.endsWith('bot')) {
			setIsBotTask(true)
		} else {
			setIsBotTask(false)
		}

		setLink(value.trim())
		setValue('link', value.trim())
		console.log('Updated link:', value.trim()) // Логирование
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
						placeholder='@task_channel or @bot'
						type='text'
						{...register('link', { required: true })}
						onChange={handleChangeLink}
					/>
				)
			}
			case 2: {
				return isBotTask ? null : '' // Пропустить, если задача на бота
			}
			case 3: {
				return (
					<div className='flex flex-col gap-y-4'>
						<Field
							className={`${errors.title && '!border-red-500'}`}
							placeholder='Заголовок (максимум 34 символа)'
							type='text'
							{...register('title', {
								required: true,
								pattern: {
									value: /^.{0,34}$/,
									message: 'Максимум 34 символа'
								}
							})}
						/>
						<Select
							control={control}
							name='budget'
							placeholder='NP Бюджет'
							options={budgetData}
						/>
						<Select
							control={control}
							name='reward'
							placeholder='NP Награда'
							options={rewardsData}
						/>
						<div className='px-[3px] flex items-center justify-between'>
							<div className='flex items-center gap-x-2'>
								<Users />
								<p>Количество подписчиков:</p>
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
				return isBotTask ? 'Creat task' : 'Verify'
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
		register,
		isCreation,
		setIsCreation,
		handleSubmit, // Подключаем обработчик к форме
		mutateDeploy,
		mutateVerify,
		step,
		setStep,
		renderStepTitle,
		renderSteps,
		renderTextButtonStep,
		handlerCopyBot, // Возвращаем обработчик копирования
		setIsBotTask, // Возвращаем функцию для изменения состояния задачи на бота
		isPending,
		isBotTask
	}
}
