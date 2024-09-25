import type { FC } from 'react'

import Points from './points/Points'
import Referrals from './referrals/Referrals'
import Timer from './timer/Timer'
import Market from './market/Market';

const Home: FC = () => {
	return (
		<>
			<Points />
			<Market />
			<Referrals />
			<Timer />
		</>
	)
}

export default Home
