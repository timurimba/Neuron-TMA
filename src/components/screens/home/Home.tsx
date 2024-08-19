import type { FC } from 'react'

import Layout from '@/components/layout/Layout'

import Points from './points/Points'
import Referrals from './referrals/Referrals'
import Timer from './timer/Timer'

const Home: FC = () => {
	return (
		<Layout>
			<Points />
			<Referrals />
			<Timer />
		</Layout>
	)
}

export default Home
