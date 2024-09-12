import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import path from 'path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), nodePolyfills()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src/')
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			plugins: [fixReactVirtualized]
		}
	}
})
