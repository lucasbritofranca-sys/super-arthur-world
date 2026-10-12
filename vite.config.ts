import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  define: { __QA__: JSON.stringify(mode === 'qa') },
  build: { target: 'es2022' },
}));
