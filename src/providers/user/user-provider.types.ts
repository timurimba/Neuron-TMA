import { Dispatch, SetStateAction } from 'react';

import { IUser } from '@/types/user.types';

export interface IUserContext {
	user: null | IUser;
	setUser: Dispatch<SetStateAction<IUser | null>>;
}
