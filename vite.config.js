// import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default ({ mode }) => {
  if (mode === 'development') {
    return {
      plugins: [vue(), viteCompression()],
    };
  } else {
    return {
      plugins: [vue(), viteCompression()],
    };
  }
};
