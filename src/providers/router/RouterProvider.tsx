import { type FC } from 'react'
import { Route, Routes } from 'react-router-dom'

import { routes } from './router.data'

const RouterProvider: FC = () => {
	return (
		<Routes>
			{routes.map(route => (
				<Route
					key={route.path}
					path={route.path}
					element={<route.component />}
				/>
			))}
		</Routes>
	)
}

export default RouterProvider
