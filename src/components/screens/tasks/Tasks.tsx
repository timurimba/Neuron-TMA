import type { FC } from 'react'

import s from './Tasks.module.scss'

const Tasks: FC = () => {
	return (
		<div className={s.root}>
			<span className={s.title}>Tasks</span>
			<div className={s.plug}>
				<div className={s.plug__inner}>
					<span className={s.text}>Custom</span> <br />
					<span className={s.description}>coming soon</span>
				</div>
			</div>
		</div>
	)
}

export default Tasks
