import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Layout from '../Layout';

// Mock child components
jest.mock('../Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Component</div>;
  };
});

jest.mock('../Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Component</div>;
  };
});

jest.mock('../Sidebar', () => {
  return function MockSidebar({ children }: { children: React.ReactNode }) {
    return <div data-testid="sidebar">{children}</div>;
  };
});

jest.mock('../MainContent', () => {
  return function MockMainContent({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-content">{children}</div>;
  };
});

// Create a mock store
const mockStore = configureStore([]);
const store = mockStore({
  game: {
    gameStage: 0,
    totalPlayTime: 3600, // 1 hour
    isRunning: true,
  },
});

describe('Layout Component', () => {
  test('renders all layout components correctly', () => {
    render(
      <Provider store={store}>
        <Layout sidebarContent={<div>Sidebar Content</div>}>
          <div>Main Content</div>
        </Layout>
      </Provider>
    );

    // Check if all components are rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();

    // Check if content is passed correctly
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });
});
