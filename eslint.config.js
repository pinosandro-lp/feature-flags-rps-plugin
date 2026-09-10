import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'vite.config*.ts', '**/examples/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-console': 2,
      'no-debugger': 2,
      'no-else-return': 2,
      'no-return-await': 2,
      '@typescript-eslint/explicit-function-return-type': 1,
      '@typescript-eslint/consistent-type-imports': 2,
      '@typescript-eslint/no-empty-object-type': 0,
    },
  },
]);
