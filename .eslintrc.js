module.exports = {
  root: true,
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "plugins": [
    "@typescript-eslint"
  ],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:prettier/recommended',
  ],
  "rules": {
    'prettier/prettier': 'error',
  }
};
