import Home from '@/components/screens/home/Home';
import Profile from '@/components/screens/profile/Profile';
import Staking from '@/components/screens/staking/Staking';
import Tasks from '@/components/screens/tasks/Tasks';

import { IRoute } from './router.interface';

export const routes: IRoute[] = [
	{
		path: '/',
		component: Home,
	},
	{
		path: '/profile',
		component: Profile,
	},
	{
		path: '/tasks',
		component: Tasks,
	},
	{
		path: '/staking',
		component: Staking,
	},
];
