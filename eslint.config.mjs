import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Possible errors
      'no-console': 'off',        // CLI tools legitimately use console
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',

      // Best practices
      'eqeqeq': ['error', 'always'],
      'curly': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-throw-literal': 'error',

      // Style
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];
