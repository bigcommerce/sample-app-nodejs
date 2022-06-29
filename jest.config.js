module.exports = {
  testRegex: '(<rootDir>/(test|src)/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '@components/(.*)': '<rootDir>/components/$1',
    '@lib/(.*)': '<rootDir>/lib/$1',
    '@mocks/(.*)': '<rootDir>/test/mocks/$1',
    '@pages/(.*)': '<rootDir>/pages/$1',
    '@test/utils': '<rootDir>/test/utils',
    '@types': '<rootDir>/types',
  },
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
};
