// vite.config.ts
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ['@tanstack/start'],
    external: ['node:async_hooks'],
  },
  build: {
    rollupOptions: {
      external: ['node:async_hooks'],
    },
  },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart(),
    nitro({
      preset: 'node-server',
    }),
    tailwindcss(),
    viteReact(),
  ],
})
