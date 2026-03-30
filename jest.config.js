/**
 * Root jest config — delegates to web/jest.config.js
 * 
 * The actual application code lives in web/. This config allows
 * running jest from the project root (e.g., `npx jest __tests__/...`)
 * by pointing rootDir to web/.
 */
const nextJest = require('./web/node_modules/next/jest')

const createJestConfig = nextJest({
  dir: './web',
})

const customJestConfig = {
  rootDir: './web',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/performance/',
    '<rootDir>/__tests__/utils/',
    '<rootDir>/__tests__/frequency-lab-performance.test.tsx',
  ],
  workerIdleMemoryLimit: '512MB',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

module.exports = createJestConfig(customJestConfig)
