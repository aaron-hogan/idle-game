import path from 'path';
import fs from 'fs';

/**
 * Helper function to get absolute path to a file or directory in the project
 */
export function getProjectPath(...relativePath: string[]): string {
  // Start at root directory
  return path.resolve(process.cwd(), ...relativePath);
}

/**
 * Helper to read a file's content
 */
export function readProjectFile(...relativePath: string[]): string {
  const filePath = getProjectPath(...relativePath);
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Check if a file or directory exists in the project
 */
export function projectPathExists(...relativePath: string[]): boolean {
  return fs.existsSync(getProjectPath(...relativePath));
}

/**
 * Check if a path is a directory
 */
export function isDirectory(...relativePath: string[]): boolean {
  const fullPath = getProjectPath(...relativePath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

/**
 * Check if a path is a file
 */
export function isFile(...relativePath: string[]): boolean {
  const fullPath = getProjectPath(...relativePath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
}
