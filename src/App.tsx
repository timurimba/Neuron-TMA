import { TonConnectUIProvider } from '@tonconnect/ui-react';
import type { FC } from 'react';

import RouterProvider from './providers/router/RouterProvider';
import TanstackProvider from './providers/tanstack/TanstackProvider';

const App: FC = () => {
	return (
		<TanstackProvider>
			<TonConnectUIProvider manifestUrl='https://raw.githubusercontent.com/Neuron-project/manifest/main/tonn_manifest.json'>
				<RouterProvider></RouterProvider>
			</TonConnectUIProvider>
		</TanstackProvider>
	);
};

export default App;
