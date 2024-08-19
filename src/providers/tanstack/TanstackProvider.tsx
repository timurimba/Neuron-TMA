import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: { refetchOnWindowFocus: false, staleTime: Infinity },
	},
});

const TanstackProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default TanstackProvider;
