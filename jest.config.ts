import type { InitialOptionsTsJest } from "ts-jest/dist/types"

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
}

export default config
