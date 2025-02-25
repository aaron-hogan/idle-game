import {
  getProjectPath,
  readProjectFile,
  projectPathExists,
  isDirectory,
  isFile,
} from './testHelpers';
import fs from 'fs';
import path from 'path';

describe('Test Helper Functions', () => {
  test('getProjectPath returns an absolute path', () => {
    const result = getProjectPath('src', 'components');
    expect(path.isAbsolute(result)).toBeTruthy();
    expect(result.includes('src')).toBeTruthy();
    expect(result.includes('components')).toBeTruthy();
  });

  test('readProjectFile reads file contents', () => {
    // Should be able to read a known file
    const packageJsonContent = readProjectFile('package.json');
    expect(packageJsonContent).toContain('"name":');
    expect(packageJsonContent).toContain('"scripts":');
  });

  test('projectPathExists detects existing paths', () => {
    expect(projectPathExists('package.json')).toBeTruthy();
    expect(projectPathExists('src')).toBeTruthy();
    expect(projectPathExists('nonexistent-file.xyz')).toBeFalsy();
  });

  test('isDirectory correctly identifies directories', () => {
    expect(isDirectory('src')).toBeTruthy();
    expect(isDirectory('src', 'components')).toBeTruthy();
    expect(isDirectory('package.json')).toBeFalsy();
    expect(isDirectory('nonexistent-dir')).toBeFalsy();
  });

  test('isFile correctly identifies files', () => {
    expect(isFile('package.json')).toBeTruthy();
    expect(isFile('src', 'index.tsx')).toBeTruthy();
    expect(isFile('src')).toBeFalsy();
    expect(isFile('nonexistent-file.xyz')).toBeFalsy();
  });
});