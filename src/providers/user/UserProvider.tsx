import {
	type FC,
	type PropsWithChildren,
	createContext,
	useMemo,
	useState,
} from 'react';

import { IUser } from '@/types/user.types';

import { IUserContext } from './user-provider.types';

export const UserContext = createContext<IUserContext>({
	user: null,
	setUser: () => {},
});

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<IUser | null>(null);

	const memoized = useMemo(() => {
		return { user, setUser };
	}, [user]);

	return (
		<UserContext.Provider value={memoized}>{children}</UserContext.Provider>
	);
};

export default UserProvider;
