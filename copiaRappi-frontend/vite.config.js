import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path'; // Asegúrate de importar 'resolve'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias estándar
    },
  },
  
  // AÑADE ESTA SECCIÓN PARA SASS
  css: {
    preprocessorOptions: {
      scss: {
        // Indica a SASS dónde buscar los archivos para la importación
        includePaths: [
          resolve(__dirname, 'node_modules') 
        ],
      },
    },
  },
});