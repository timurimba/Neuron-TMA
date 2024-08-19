import { type FC } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { routes } from './router.data';

const RouterProvider: FC = () => {
	return (
		<Router>
			<Routes>
				{routes.map(route => (
					<Route
						key={route.path}
						path={route.path}
						element={<route.component />}
					/>
				))}
			</Routes>
		</Router>
	);
};

export default RouterProvider;
