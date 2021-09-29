module.exports = {
  root: true,
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 12
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  "rules": {
    'prettier/prettier': 'error',
  }
};
