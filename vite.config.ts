import { defineConfig,loadEnv,splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.base_url_api': JSON.stringify(env.base_url_api)
    },
    base: "/",
    plugins: [react(),splitVendorChunkPlugin()],
    preview: {
     port: 81,
     strictPort: true,
    },
    server: {
     port: 81,
     strictPort: true,
     host: true,
    //  origin: "https://0.0.0.0:81",
    },
  }
})

// export default defineConfig({

//   define: {
//     'process.env.SOME_KEY': JSON.stringify(env.SOME_KEY)
//   },
//  });