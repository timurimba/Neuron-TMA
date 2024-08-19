import type { FC, PropsWithChildren } from 'react'

import Header from './header/Header'
import Footer from './navigation/Navigation'

const Layout: FC<PropsWithChildren> = ({ children }) => {
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
