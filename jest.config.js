// https://facebook.github.io/jest/docs/en/configuration.html

module.exports = {
  collectCoverage: true,
  coverageDirectory: '__tests__/coverage/',
  moduleFileExtensions: [
    'js',
    'json',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  verbose: true,
};
