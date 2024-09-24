import { Dispatch, SetStateAction } from 'react'

import { ITask } from '@/types/task.types'

export interface ITaskProps extends Omit<ITask, 'budget'> {
	setTasks: Dispatch<SetStateAction<ITask[]>>
}
