import { TonConnectButton } from '@tonconnect/ui-react'
import { type FC } from 'react'

import logo from '@/assets/images/logo.png'

import styles from './Header.module.scss'

const Header: FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles.logoContainer}>
				<img src={logo} alt='' />
				<h1>
					Neuron <span className={styles.beta}>beta</span>
				</h1>
			</div>
			<TonConnectButton />
		</header>
	)
}

export default Header
