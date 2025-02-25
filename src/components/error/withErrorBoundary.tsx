import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

interface WithErrorBoundaryOptions {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  componentName?: string;
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary.
 * This makes it easy to add error boundaries to multiple components.
 */
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): React.FC<P> {
  const { 
    fallback, 
    onError, 
    componentName = Component.displayName || Component.name || 'Component' 
  } = options;

  const defaultFallback = (
    <ErrorFallback 
      componentName={componentName}
      resetErrorBoundary={() => window.location.reload()} 
    />
  );

  const WithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundary onError={onError} fallback={fallback || defaultFallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Set a display name for the wrapped component
  WithErrorBoundary.displayName = `WithErrorBoundary(${componentName})`;

  return WithErrorBoundary;
}

export default withErrorBoundary;