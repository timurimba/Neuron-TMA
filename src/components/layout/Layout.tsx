import { type FC, type PropsWithChildren } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './header/Header'
import Footer from './navigation/Navigation'
import { useLayout } from './useLayout'

const Layout: FC<PropsWithChildren> = ({ children }) => {
	useLayout()
	return (
		<Router>
			<Header />
			<div className='mx-5'>
				{children}
				<div className='h-[150px]'></div>
			</div>
			<Footer />
		</Router>
	)
}

export default Layout
