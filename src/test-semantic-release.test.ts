import { getVersionInfo, getFormattedVersion } from './test-semantic-release';

describe('Semantic Release Test', () => {
  it('should return version info', () => {
    const info = getVersionInfo();
    expect(info.name).toBe('Semantic Release Test');
    expect(info.version).toBe('1.0.0');
    expect(info.author).toBe('Claude Team');
  });

  it('should format version string correctly', () => {
    const formatted = getFormattedVersion();
    expect(formatted).toBe('Semantic Release Test v1.0.0 by Claude Team');
  });
});
