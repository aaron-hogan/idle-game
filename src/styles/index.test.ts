import { readProjectFile } from '../utils/testHelpers';

describe('CSS Styles', () => {
  let cssContent: string;

  beforeAll(() => {
    cssContent = readProjectFile('src', 'styles', 'index.css');
  });

  test('contains app class styles', () => {
    expect(cssContent).toContain('.app {');
    expect(cssContent).toContain('max-width:');
    expect(cssContent).toContain('margin: 0 auto');
  });

  test('contains body styles', () => {
    expect(cssContent).toContain('body {');
    expect(cssContent).toContain('font-family:');
    expect(cssContent).toContain('background-color:');
  });

  test('includes appropriate colors', () => {
    // Use our current dark theme colors from variables.css
    expect(cssContent).toContain('--bg-color-main');
    expect(cssContent).toContain('--text-color-primary');
  });
});