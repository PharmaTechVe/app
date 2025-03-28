import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'metro.config.js',
      'tailwind.config.js',
      'node_modules',
      'assets',
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        ...pluginReactNative.environments['react-native'].globals,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginReact.configs.flat.recommended,
  {
    // Configuración específica de React Native
    plugins: {
      'react-native': pluginReactNative,
    },
    rules: {
      ...pluginReactNative.configs.rules,
      'react-native/no-raw-text': 'off',
      'react-native/no-inline-styles': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    // Configuración adicional para TypeScript y React
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
    },
  },
  eslintConfigPrettier,

  // Override específico para jest.setup.js
  {
    files: ['jest.setup.js', '**/jest.setup.js'],
    languageOptions: {
      globals: {
        jest: 'readonly',
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
    },
  },
];
