import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Footer from './Footer';
import ErrorBoundary from '../error/ErrorBoundary';
import ErrorFallback from '../error/ErrorFallback';
import { EventPanel } from '../events';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarContent }) => {
  return (
    <div className="game-layout">
      <ErrorBoundary fallback={<ErrorFallback componentName="Header" />}>
        <Header />
      </ErrorBoundary>
      <div className="layout-body">
        <ErrorBoundary fallback={<ErrorFallback componentName="Sidebar" />}>
          <Sidebar>{sidebarContent}</Sidebar>
        </ErrorBoundary>
        <ErrorBoundary fallback={<ErrorFallback componentName="MainContent" />}>
          <MainContent>{children}</MainContent>
        </ErrorBoundary>
      </div>
      <ErrorBoundary fallback={<ErrorFallback componentName="Footer" />}>
        <Footer />
      </ErrorBoundary>

      {/* Event Panel - floated over the content */}
      <ErrorBoundary fallback={<ErrorFallback componentName="EventPanel" />}>
        <EventPanel />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
