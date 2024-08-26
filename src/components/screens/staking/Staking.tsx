import type { FC } from 'react'

import s from './Staking.module.scss'

const Staking: FC = () => {
	return (
		<div className={s.root}>
			<span className={s.title}>Staking</span>
			<div className={s.plug}>
				<div className={s.plug__inner}>
					<span className={s.text}>NEURON NFT</span> <br />
					<span className={s.description}>coming soon</span>
				</div>
			</div>
		</div>
	)
}

export default Staking
