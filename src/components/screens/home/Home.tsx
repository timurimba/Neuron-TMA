import type { FC } from 'react'

import Points from './points/Points'
import Referrals from './referrals/Referrals'
import Timer from './timer/Timer'

const Home: FC = () => {
	return (
		<>
			<Points />
			<Referrals />
			<Timer />
		</>
	)
}

export default Home
