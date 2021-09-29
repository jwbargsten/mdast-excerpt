import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"

import pkg from "./package.json"

export default [
  {
    input: "src/index.ts",
    output: [{ file: pkg.main, format: "cjs" }],
    plugins: [commonjs(), typescript()],
  },
  {
    input: "src/index.ts",
    output: [{ file: pkg.module, format: "es" }],
    plugins: [typescript()],
  },
]
