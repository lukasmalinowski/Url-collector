module.exports = {
  extends: ['@leocode/eslint-config/node', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  env: {
    node: 1,
    jest: 1,
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.test.json'],
  },
};
