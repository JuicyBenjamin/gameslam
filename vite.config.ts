import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      // Use Rolldown bundler
      external: []
    }
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
  ],
  // Configure Rolldown as the bundler
  experimental: {
    rollupVersion: 'rolldown'
  }
})
