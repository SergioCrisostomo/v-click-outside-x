// https://facebook.github.io/jest/docs/en/configuration.html

module.exports = {
  coverageDirectory: '__tests__/coverage/',
  collectCoverageFrom: ['<rootDir>/src/*.js'],
  testMatch: ['**/*.test.js'],
  verbose: true,
};
