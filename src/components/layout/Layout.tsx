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
		mutationFn: (data: { telegramId: string; wallet: string }) =>
			UserService.setAddressWallet(data.telegramId, data.wallet)
	})

	useEffect(() => {
		if (wallet) {
			setAddressWallet({
				telegramId: `${window.Telegram.WebApp.initDataUnsafe.user?.id}`,
				wallet: Address.parse(wallet).toString()
			})
		}
	}, [wallet])

	useEffect(() => {
		const handleBeforeUnload = () => {
			// Флаг для определения, что страница обновляется
			window.isPageReloading = true
		}

		const handleUnload = () => {
			// Сбрасываем флаг после завершения обновления
			window.isPageReloading = false
		}

		const handlerCloseApp = () => {
			if (document.hidden) {
				if (!window.isPageReloading) window.Telegram.WebApp.close()
			}
		}

		document.addEventListener('visibilitychange', handlerCloseApp)
		window.addEventListener('beforeUnload', handleBeforeUnload)
		window.addEventListener('unload', handleUnload)

		return () => {
			document.removeEventListener('visibilitychange', handlerCloseApp)
			window.removeEventListener('beforeUnload', handlerCloseApp)
			window.removeEventListener('unload', handlerCloseApp)
		}
	}, [])

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
