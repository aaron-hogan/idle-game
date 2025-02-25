import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// When we add Redux, we'll expand this to include the Provider
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options });

// re-export everything
export * from '@testing-library/react';
export { customRender as render };