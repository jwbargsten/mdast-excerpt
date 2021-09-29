import type { InitialOptionsTsJest } from 'ts-jest/dist/types';
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};

export default config;
