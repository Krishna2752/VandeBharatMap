import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Fixed: / instead of .
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})