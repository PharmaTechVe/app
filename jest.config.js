/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@pharmatech/.*|expo-router|expo-linking|react-native-heroicons))',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.tsx',
    'react-native-heroicons/outline':
      '<rootDir>/__mocks__/react-native-heroicons/outline.js',
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
    'react-native-svg': '<rootDir>/__mocks__/react-native-svg.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
};

module.exports = config;
