import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: 'https://github.com/atanaskeskovski/prikazni_za_deca'
})