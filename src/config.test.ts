import { readProjectFile, isFile } from './utils/testHelpers';

describe('Project Configuration', () => {
  test('package.json has required scripts', () => {
    const packageJson = JSON.parse(readProjectFile('package.json'));

    expect(packageJson.scripts).toHaveProperty('start');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.scripts).toHaveProperty('lint');
    expect(packageJson.scripts).toHaveProperty('typecheck');
  });

  test('tsconfig.json is valid', () => {
    const tsconfig = JSON.parse(readProjectFile('tsconfig.json'));

    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.jsx).toBe('react-jsx');
    expect(tsconfig.compilerOptions.strict).toBeTruthy();
    expect(tsconfig.include).toContain('src');
  });

  test('webpack.config.js exists', () => {
    expect(isFile('webpack.config.js')).toBeTruthy();
  });

  test('eslint.config.js exists', () => {
    expect(isFile('eslint.config.js')).toBeTruthy();
  });
});