import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      'components': resolve(__dirname, './components'),
      'views': resolve(__dirname, './views'),
      'store': resolve(__dirname, './store'),
      'api': resolve(__dirname, './api'),
      'utils': resolve(__dirname, './utils'),
      'i18n': resolve(__dirname, './i18n')
    }
  },
  build: {
    outDir: '../../dist/daede',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
          'components': ['@/components/YCard', '@/components/YTable', '@/components/YForm', '@/components/YButton', '@/components/YSwitch', '@/components/YSelect', '@/components/YInput', '@/components/YToast'],
          'views': ['@/views/Dashboard', '@/views/SystemTuning', '@/views/LanIsolation', '@/views/SubscriptionConvert', '@/views/OnlineUpdate', '@/views/Settings', '@/views/Logs']
        }
      }
    }
  },
  base: '/luci-static/resources/view/daede/'
})