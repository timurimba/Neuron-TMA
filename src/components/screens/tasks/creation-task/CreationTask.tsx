import cn from 'clsx'
import { CircleArrowLeft, CircleMinus, CirclePlus } from 'lucide-react'
import { type FC } from 'react'
import { SubmitHandler, } from 'react-hook-form'

import Button from '@/components/shared/button/Button'
import Loader from '@/components/shared/loader/Loader'

import { ITaskCreateDTO } from '@/types/task.types'

import styles from './CreationTask.module.scss'
import { useCreationTask } from './useCreationTask'

const CreationTask: FC = () => {
	const {
		isCreation,
		setIsCreation,
		handleSubmit,
		mutateDeploy,
		mutateVerify,
		step,
		setStep,
		renderStepTitle,
		renderSteps,
		renderTextButtonStep,
		isPending,
		setIsBotTask,
		isBotTask
	} = useCreationTask()


	const submitHandler: SubmitHandler<ITaskCreateDTO> = async data => {
		if (isPending) return

		console.log('Submitting data:', data) // Логирование перед проверками
		// Проверка наличия поля link
		if (!data.link) {
			console.error('Link is undefined')
			return // или можно обработать ошибку другим способом
		}

		switch (step) {
			case 1: {
				if (data.link.endsWith('bot')) {
					setIsBotTask(true)
					setStep(3)
				} else {
					setStep(2)
				}
				break
			}
			case 2: {
				await mutateVerify(data.link)
				break
			}
			case 3: {
				await mutateDeploy({
					title: data.title,
					budget: data.budget,
					reward: data.reward,
					population: data.budget! / data.reward!,
					link: data.link
				})
				break
			}
		}
	}

	

	return (
		<div className={styles.creation}>
			<button onClick={() => setIsCreation(!isCreation)}>
				{isCreation ? (
					<CircleMinus className={styles.icon} />
				) : (
					<CirclePlus className={styles.icon} />
				)}
			</button>
			<div className={cn({ [styles.active]: isCreation })}>
				<form onSubmit={handleSubmit(submitHandler)}>
					<div className={cn(styles.head, { [styles.initial]: step === 1 })}>
						{step > 1 && (
							<button
								type='button'
								className='active:scale-95 transition-all'
								onClick={() => setStep(isBotTask && step === 3 ? 1 : step - 1)}
							>
								<CircleArrowLeft />
							</button>
						)}
						<p>Step {step === 3 && isBotTask ? 2 : step}.</p>
					</div>
					<p>{renderStepTitle()}</p>
					{renderSteps()}
					<Button type='submit' className='mt-3'>
						{isPending ? <Loader /> : renderTextButtonStep()}
					</Button>
				</form>
			</div>
		</div>
	)
}

export default CreationTask
