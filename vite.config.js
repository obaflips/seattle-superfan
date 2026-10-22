import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this as a project page at /seattle-superfan/, not the root --
  // local dev and `vite preview` still use '/' since GITHUB_PAGES is unset there.
  base: process.env.GITHUB_PAGES ? '/seattle-superfan/' : '/',
})
