import { TonConnectButton } from '@tonconnect/ui-react'
import type { FC } from 'react'

import logo from '@/assets/images/logo.png'

import styles from './Header.module.scss'

const Header: FC = () => {
	return (
		<header className={styles.header}>
			<div>
				<img src={logo} alt='' />
				<h1>Neuron</h1>
			</div>
			<TonConnectButton />
		</header>
	)
}

export default Header
