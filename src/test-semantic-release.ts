/**
 * A test file for demonstrating semantic release
 */
export const getVersionInfo = () => {
  return {
    name: 'Semantic Release Test',
    description: 'This is a test feature for demonstrating semantic versioning',
    version: '1.0.0',
    author: 'Claude Team',
  };
};

/**
 * Get formatted version string
 */
export const getFormattedVersion = () => {
  const info = getVersionInfo();
  // Fix potential undefined author
  const author = info.author || 'Unknown';
  return `${info.name} v${info.version} by ${author}`;
};
