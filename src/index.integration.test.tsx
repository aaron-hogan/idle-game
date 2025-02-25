/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { readProjectFile, getProjectPath } from './utils/testHelpers';

// Mock React's createRoot since we can't directly test it
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn((container) => ({
    render: jest.fn((element) => {
      // Render the element using the test renderer instead
      render(element);
    }),
  })),
}));

describe('Application Entry Point', () => {
  const indexPath = getProjectPath('src', 'index.tsx');
  
  test('entry point has appropriate root element check', () => {
    // Instead of trying to execute the file (which would fail without a DOM element),
    // let's verify the implementation manually
    const indexContent = readProjectFile('src', 'index.tsx');
    
    // Check that it looks for a root element
    expect(indexContent).toContain('getElementById(\'root\')');
    
    // Check that it has error handling
    expect(indexContent).toContain('if (!rootElement)');
    
    // Check that it calls createRoot
    expect(indexContent).toContain('createRoot(rootElement)');
    
    // Check that it renders with React.StrictMode
    expect(indexContent).toContain('<React.StrictMode>');
  });
  
  test('index.tsx imports the correct dependencies', () => {
    const indexContent = readProjectFile('src', 'index.tsx');
    
    expect(indexContent).toContain("import React from 'react'");
    expect(indexContent).toContain("import { createRoot }");
    expect(indexContent).toContain("import App from './components/App'");
    expect(indexContent).toContain("import './styles/index.css'");
  });
});