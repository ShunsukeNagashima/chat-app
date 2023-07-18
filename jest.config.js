/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!ky/distribution/)'],
  transform: {
    'node_modules/ky/distribution/.+.(j|t)sx?$': 'ts-jest',
  },
};
