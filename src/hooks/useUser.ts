import { useContext } from 'react';

import { UserContext } from '@/providers/user/UserProvider';

export const useUser = () => useContext(UserContext);
