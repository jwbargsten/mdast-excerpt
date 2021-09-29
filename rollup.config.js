import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"

import pkg from "./package.json"

export default [
  {
    input: "src/index.ts",
    external: ["lodash/toString", "lodash/truncate"],
    output: [{ file: pkg.main, format: "cjs", exports: "default" }],
    plugins: [commonjs(), typescript()],
  },
  {
    input: "src/index.ts",
    external: ["lodash/toString", "lodash/truncate"],
    output: [{ file: pkg.module, format: "es" }],
    plugins: [typescript()],
  },
]
