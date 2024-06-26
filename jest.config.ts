import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^lib/(.*)$': '<rootDir>/common/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '@config/(.*)$': '<rootDir>/config/$1',
    '^@base/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/shared'],
  coveragePathIgnorePatterns: ['<rootDir>/shared', 'node_modules', 'main.ts'],
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: './',
        outputName: 'test-reporter.xml',
        reportedFilePath: 'absolute',
      },
    ],
  ],
};

export default config;
