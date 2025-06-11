import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      '@stylistic': stylistic
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      }
    },
    rules: {
      '@stylistic/semi': ['error', 'always'], // Пример правила
      '@stylistic/indent': ['error', 2]       // Отступы: 2 пробела
    }
  },
  { ignores: ['**/node_modules'] }
]);