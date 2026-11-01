import { readFileSync, existsSync } from 'node:fs';
import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';


const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const homepage = process.env.PUBLIC_URL ?? pkg.homepage ?? '';
const base = homepage === '.' ? './' : homepage.startsWith('http') ? new URL(homepage).pathname.replace(/\/?$/, '/') : homepage ? homepage.replace(/\/?$/, '/') : '/';
export default defineConfig(({ mode }) => ({
  base,
  plugins: [
    {
      name: 'jsx-in-existing-js-files',
      enforce: 'pre',
      async transform(code, id) {
        if (/\/src\/.*\.js$/.test(id.split('?')[0])) {
          return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
        }
      },
    },
    react(),
    
  ],
  resolve: { tsconfigPaths: true },
  define: {
    'process.env': JSON.stringify({
      NODE_ENV: mode === 'test' ? 'test' : mode === 'production' ? 'production' : 'development',
      PUBLIC_URL: base.replace(/\/$/, ''),
      ...loadEnv(mode, process.cwd(), 'REACT_APP_'),
    }),
  },
  build: { outDir: 'build' },
  server: { host: '127.0.0.1', port: 3000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: existsSync('src/setupTests.js') ? ['src/setupTests.js'] : [],
    passWithNoTests: true,
  },
}));
