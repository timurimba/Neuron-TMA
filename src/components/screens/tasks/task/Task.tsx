import { useMutation, useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { type FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Loader from '@/components/shared/loader/Loader'

import { TaskService } from '@/services/task/task.service'
import { UserService } from '@/services/user/user.service'

import np from '@/assets/images/home/neuron-points.svg'

import { ITaskCheckSubscriptionDTO } from '@/types/task.types'
import { IUser } from '@/types/user.types'

import styles from './Task.module.scss'
import { ITaskProps } from './task.types'
import { telegramId } from '@/consts/consts'
import { usePointsStore } from '@/store/store'
import { sleep } from '@/utils/sleep.utils'

const Task: FC<ITaskProps> = ({
    title,
    reward,
    population,
    completed,
    setTasks,
    isCompleted,
    link,
    id
}) => {
    const [isCheckMark, setIsCheckMark] = useState(false)
    const [isVisited, setIsVisited] = useState(false)
    const isBotTask = link.endsWith('bot') // Определяем задачу на бота

    // Получаем данные пользователя
    const { data: user } = useQuery({
        queryKey: ['get-user'],
        queryFn: () => UserService.getUserFields<IUser>(telegramId)
    })

    useEffect(() => {
        // Проверка, выполнена ли задача пользователем
        if (user && user.completedTasks && user.completedTasks.includes(link)) {
            setIsCheckMark(true)
        }
    }, [user])

    const {
        data: subscription,
        isPending: isPendingCheckSubscription,
        mutate: mutateCheckSubscription
    } = useMutation({
        mutationKey: ['check-subscription', id],
        mutationFn: (data: ITaskCheckSubscriptionDTO) =>
            TaskService.checkSubscription(data)
    })

    // Обработка выполнения задачи при изменении состояния подписки
    useEffect(() => {
        if (isCheckMark || isBotTask) return // Защита от повторного выполнения или задачи на бота

        if (subscription === true) {
            completeTask()
        } else if (subscription === false) {
            toast.error("You haven't subscribed to the channel, try again")
        }
    }, [subscription])

    const handlerClickTask = async () => {
        window.open(`https://t.me/${link.substring(1)}`, '_blank')
        await sleep(500)
        setIsVisited(true)

        if (isBotTask) {
            completeTask() // Зачисляем награду сразу для задачи на бота
        }
    }

    const completeTask = () => {
        setIsCheckMark(true)
        toast.success("You've successfully completed the task")
        UserService.completeTask(telegramId, link)

        const currentPoints = usePointsStore.getState().points
        const newPoints = currentPoints + reward!
        UserService.updatePoints(telegramId, newPoints)
		UserService.awardPointsToUser(telegramId, reward!);
					// Завершаем задачу на сервере
        TaskService.complete(id!)

        // Обновляем состояние задач
        setTasks(tasks =>
            tasks.map(t => t.link === link ? { ...t, isCompleted: true, completed: t.completed + 1 } : t)
        )
    }

    const handleUserReturn = async () => {
        // Только для заданий на подписку на канал
        if (!isBotTask) {
            mutateCheckSubscription({
                telegramId: telegramId,
                channelId: link
            })
        }
        setIsVisited(false)
    }

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && isVisited) {
                handleUserReturn()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [isVisited])

    const renderButtonState = () => {
        if (isCheckMark || isCompleted) {
            return <Check className={styles.check} size={18} />
        }
        if (isPendingCheckSubscription) {
            return <Loader isBlack />
        }
        return <img src={np} alt='' />
    }

    return (
        <div className={styles.task}>
            <div>
                <h1>
                    {title}
                    <span>{link}</span>
                </h1>
                <div>
                    <p>{reward} NP</p>
                    <span>
                        {completed}/{population}
                    </span>
                </div>
            </div>
            <button
                disabled={isPendingCheckSubscription || isCheckMark || isCompleted}
                onClick={handlerClickTask}
            >
                {renderButtonState()}
            </button>
        </div>
    )
}

export default Task
