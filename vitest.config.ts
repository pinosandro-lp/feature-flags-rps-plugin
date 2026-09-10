import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      include: ['lib/**/*.ts', 'lib/**/*.tsx'],
      exclude: ['**/index.ts', '**/utils/tests.tsx'],
    },
    environment: 'jsdom',
    setupFiles: './setupTest.ts',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    include: [
      'lib/**/*.test.ts',
      'lib/**/*.test.tsx',
      'lib/**/*.spec.ts',
      'lib/**/*.spec.tsx',
    ],
  },
});
