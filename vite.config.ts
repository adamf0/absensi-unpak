import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';
import path, { join } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(),'')
	const processEnvValues = {
		'process.env': Object.entries(env).reduce(
		  (prev, [key, val]) => {
			return {
			  ...prev,
			  [key]: val,
			}
		  },
		  {},
		)
	}
	
	return {
		resolve: {
			alias: [
				{
					find: "@",
					replacement: path.resolve(__dirname, "src"),
				},
				// {
				// 	find: "@root",
				// 	replacement: join(__dirname, 'src'),
				// },
			]
		},
		define: processEnvValues,
		// {
		// 	'process.env.deploy': JSON.stringify("dev"),
		// 	'process.env.base_url_api': JSON.stringify("http://localhost:8000") //https://api-hr.unpak.ac.id
		// },
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
			fs: {
				cachedChecks: false,
			},
			origin: "http://0.0.0.0:81",
		},
	}
});

// export default defineConfig({
// 	plugins: [react(), EnvironmentPlugin({})],
// 	assetsInclude: ['**/*.md'],
// });
