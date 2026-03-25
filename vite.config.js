import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    server: {
    proxy: {
      "/coingecko-img": {
        target: "https://assets.coingecko.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coingecko-img/, ""),
      },
    },
  },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-icons', '@radix-ui/react-label', '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-toast', 'class-variance-authority', 'clsx', 'tailwind-merge', 'tailwindcss-animate'],
          charts: ['apexcharts', 'react-apexcharts'],
          state: ['@reduxjs/toolkit', 'react-redux', 'redux', 'redux-thunk'],
          utils: ['axios', 'zod', 'yup', 'react-hook-form', '@hookform/resolvers']
        }
      }
    }
  }
})
