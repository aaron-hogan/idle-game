import { readProjectFile } from './utils/testHelpers';

describe('HTML Template', () => {
  let htmlContent: string;

  beforeAll(() => {
    htmlContent = readProjectFile('src', 'index.html');
  });

  test('has the correct title', () => {
    expect(htmlContent).toContain('<title>Anti-Capitalist Idle Game</title>');
  });

  test('has root div element', () => {
    expect(htmlContent).toContain('<div id="root"></div>');
  });

  test('has proper DOCTYPE and HTML structure', () => {
    expect(htmlContent).toMatch(/^\s*<!DOCTYPE html>/i);
    expect(htmlContent).toContain('<html lang="en">');
    expect(htmlContent).toContain('<head>');
    expect(htmlContent).toContain('<body>');
  });

  test('includes viewport meta tag for responsiveness', () => {
    expect(htmlContent).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  });
});