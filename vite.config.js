import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  //định nghĩa process.env cho ta sử dụng chứ trong vite ta không sử dụng đc phải dùng import.process.env
  define: {
    'process.env': process.env
  },
  plugins: [
    react(),
    svgr() // for svgs
  ],
  // base: './'
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
