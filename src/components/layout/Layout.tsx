import { useMutation } from '@tanstack/react-query'
import { type FC, type PropsWithChildren, useEffect } from 'react'
import { Address } from 'ton-core'

import { UserService } from '@/services/user/user.service'

import { useWallet } from '@/hooks/useWallet'

import Header from './header/Header'
import Footer from './navigation/Navigation'

const Layout: FC<PropsWithChildren> = ({ children }) => {
	const { wallet } = useWallet()
	const { mutate: setAddressWallet } = useMutation({
		mutationKey: ['set-address-wallet'],
		mutationFn: (data: { telegramId: string; wallet: Address }) =>
			UserService.setAddressWallet(data.telegramId, data.wallet)
	})

	useEffect(() => {
		if (wallet) {
			setAddressWallet({
				telegramId: `${window.Telegram.WebApp.initDataUnsafe.user?.id}`,
				wallet: Address.parse(wallet)
			})
		}
	}, [wallet])

	return (
		<>
			<Header />
			<div className='mx-5'>
				{children}
				<div className='h-[150px]'></div>
			</div>
			<Footer />
		</>
	)
}

export default Layout
