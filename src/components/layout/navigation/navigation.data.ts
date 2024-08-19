import home from '@/assets/images/navigation/home.svg'
import nft from '@/assets/images/navigation/nft.svg'
import staking from '@/assets/images/navigation/staking.svg'

import { NavItem } from './navigation.types'

export const navItems: NavItem[] = [
	{ to: `/`, icon: home, label: 'Home' },
	{ to: `/tasks`, icon: nft, label: 'Staking' },
	{ to: `/staking`, icon: staking, label: 'Staking' },
	{ to: `/profile`, icon: nft, label: 'NFT' }
]
