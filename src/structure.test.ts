import { isDirectory, isFile } from './utils/testHelpers';

describe('Project Structure', () => {
  test('has the required directories', () => {
    const requiredDirs = [
      'components',
      'state',
      'models',
      'systems',
      'utils',
      'constants',
      'styles',
      'core',
      'interfaces',
      'managers'
    ];

    for (const dir of requiredDirs) {
      expect(isDirectory('src', dir)).toBeTruthy();
    }
  });

  test('has the core source files', () => {
    const requiredFiles = [
      ['src', 'index.tsx'],
      ['src', 'index.html'],
      ['src', 'setupTests.ts'],
      ['src', 'components', 'App.tsx'],
      ['src', 'styles', 'index.css'],
    ];

    for (const filePath of requiredFiles) {
      expect(isFile(...filePath)).toBeTruthy();
    }
  });

  test('has the required root configuration files', () => {
    const requiredConfigFiles = [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'eslint.config.js',
      'jest.config.js',
      '.prettierrc',
    ];

    for (const file of requiredConfigFiles) {
      expect(isFile(file)).toBeTruthy();
    }
  });
});