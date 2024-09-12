import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'

import Loader from '@/components/shared/loader/Loader'

import { TaskService } from '@/services/task/task.service'
import { UserService } from '@/services/user/user.service'

import { ITask } from '@/types/task.types'
import { IUser } from '@/types/user.types'

import styles from './Tasks.module.scss'
import CreationTask from './creation-task/CreationTask'
import Task from './task/Task'
import { telegramId } from '@/consts/consts'

const Tasks: FC = () => {
	const [tasks, setTasks] = useState<ITask[]>([])
	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
	})

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['get-tasks'],
		queryFn: () => TaskService.getAll(),
		select: data => {
			return data
				.filter(t => t.completed !== t.population)
				.filter(t =>
					user?.completedTasks ? !user?.completedTasks.includes(t.link) : true
				)
				.sort((a, b) => b.reward! - a.reward!)
		}
	})

	useEffect(() => {
		if (data && isSuccess) {
			setTasks(data)
		}
	}, [data, isSuccess])

	return (
		<div className={styles.tasks}>
			<CreationTask />
			<div className='flex flex-col gap-y-4'>
				<AnimatePresence>
					{!isLoading ? (
						data && data.length ? (
							tasks.map(t => (
								<motion.div
									key={t.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ clipPath: 'inset(0 50% 0 50%)' }}
									transition={{
										type: 'spring',
										stiffness: 300,
										damping: 30
									}}
									layout
								>
									<Task
										id={t.id}
										setTasks={setTasks}
										link={t.link}
										title={t.title}
										population={t.population}
										completed={t.completed}
										reward={t.reward}
									/>
								</motion.div>
							))
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className='text-center bg-black bg-opacity-90 text-white shadow-lg shadow-bl w-[90%] h-[20%] flex items-center justify-center	 rounded-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-bold text-lg'
							>
								No available tasks
							</motion.div>
						)
					) : (
						<div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
							<Loader />
						</div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Tasks
