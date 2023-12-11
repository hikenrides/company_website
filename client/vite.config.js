import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-google-button', 'firebase/auth', 'react-phone-number-input/style.css', 'react-phone-number-input', 'firebase/app']
    },
  },
})
