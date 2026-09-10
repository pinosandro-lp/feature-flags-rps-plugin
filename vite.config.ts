import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['lib'],
      tsconfigPath: './tsconfig.app.json',
      outDirs: ['dist/types'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'lib/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@pinosandro/react-plugin-system',
      ],
    },
  },
});
