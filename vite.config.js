// import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default () => {
  return {
    base: 'vite-vue-cesium-app',
    open: true,
    plugins: [vue(), viteCompression()]
  }
}
