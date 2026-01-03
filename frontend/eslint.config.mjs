import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['.next', 'node_modules', 'dist', 'out', '.git'],
  },
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'off',
      'no-useless-catch': 'warn',
    },
  },
];

export default eslintConfig;
