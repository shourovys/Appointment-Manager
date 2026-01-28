export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  rootDir: 'src',
  moduleResolution: 'bundler',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { useESM: true }],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.spec.(ts|js)', '**/?(*.)+(spec|test).(ts|js)'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};