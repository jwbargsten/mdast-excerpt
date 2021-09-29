module.exports = {
  extends: ["airbnb", "airbnb-typescript", "plugin:prettier/recommended"],
  parserOptions: {
    project: "./tsconfig.spec.json",
  },
  rules: {
    "prettier/prettier": "error",
    "import/prefer-default-export": "off",
    "no-bitwise": ["error", { allow: ["~"] }],
  },
}
