import type { FC } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Navigation.module.scss';
import { navItems } from './navigation.data';

const Navigation: FC = () => {
	return (
		<nav className={styles.navigation}>
			{navItems.map(item => (
				<NavLink to={item.to} key={item.to}>
					<img
						src={item.icon}
						style={{ width: 25, height: 25 }}
						className='icon'
						alt={item.label}
						aria-label={item.label}
					/>
				</NavLink>
			))}
		</nav>
	);
};

export default Navigation;
