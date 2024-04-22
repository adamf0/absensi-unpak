import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {

		resolve: {
			alias: {
			  '@module': path.resolve(__dirname, 'src/module/'),
			},
		},
		define: {
			'process.env.deploy': JSON.stringify(env.deploy),
			'process.env.base_url_api': JSON.stringify(env.base_url_api)
		},
		assetsInclude: ['**/*.md'],
		base: "/",
		plugins: [react(), EnvironmentPlugin({})],
		preview: {
			port: 81,
			strictPort: true,
		},
		server: {
			port: 81,
			strictPort: true,
			host: true,
			origin: "https://0.0.0.0:81",
		},
	}
});

// export default defineConfig({
// 	plugins: [react(), EnvironmentPlugin({})],
// 	assetsInclude: ['**/*.md'],
// });
