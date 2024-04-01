import { defineConfig,splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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
   origin: "https://127.0.0.1:81",
  },
 });