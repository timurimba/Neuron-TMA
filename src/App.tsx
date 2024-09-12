import { TonConnectUIProvider } from '@tonconnect/ui-react'
import type { FC } from 'react'
import { Toaster } from 'react-hot-toast'

import Layout from './components/layout/Layout'
import RouterProvider from './providers/router/RouterProvider'
import TanstackProvider from './providers/tanstack/TanstackProvider'

const App: FC = () => {
	return (
		<TanstackProvider>
			<TonConnectUIProvider manifestUrl='https://raw.githubusercontent.com/Neuron-project/manifest/main/tonn_manifest.json'>
				<Layout>
					<Toaster position='top-center' reverseOrder={false} />
					<RouterProvider />
				</Layout>
			</TonConnectUIProvider>
		</TanstackProvider>
	)
}

export default App
