import type { FC } from 'react'

import Points from './points/Points'
import Referrals from './referrals/Referrals'
import Timer from './timer/Timer'

const Home: FC = () => {
	return (
		<>
			<p className='font-bold my-4  text-2xl text-black text-center'>
				X5 For points, if you buy NFT!
			</p>
			<Points />
			<Referrals />
			<Timer />
		</>
	)
}

export default Home
