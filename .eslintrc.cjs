module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  ignorePatterns: ['dist/', 'node_modules/'],
  overrides: [
    {
      // Test files — vitest globals match jest globals
      files: ['src/**/*.test.{js,jsx}', 'src/__tests__/**/*.{js,jsx}'],
      env: {
        jest: true,
      },
    },
  ],
};
