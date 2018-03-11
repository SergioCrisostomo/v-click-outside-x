// https://facebook.github.io/jest/docs/en/configuration.html

module.exports = {
  coverageDirectory: '__tests__/coverage/',
  moduleFileExtensions: [
    'js',
    'json',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/?(*.)(spec|test).js?(x)'],
  verbose: true,
};
