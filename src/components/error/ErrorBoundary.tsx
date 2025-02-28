import React, { Component, ErrorInfo } from 'react';
import { ErrorLogger, ErrorSeverity } from '../../utils/errorUtils';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
  severity?: ErrorSeverity;
  resetOnProps?: boolean; // Reset error state when props change
  maxRetries?: number; // Max number of retries allowed
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * Error Boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private readonly componentName: string;

  static defaultProps = {
    severity: ErrorSeverity.ERROR,
    resetOnProps: false,
    maxRetries: 3,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };

    this.componentName = props.componentName || 'UnknownComponent';
    this.resetError = this.resetError.bind(this);
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info for displaying details
    this.setState({ errorInfo });

    // Log the error to our ErrorLogger service
    ErrorLogger.getInstance().logError(
      error,
      {
        component: this.componentName,
        ...errorInfo,
      },
      this.props.severity
    );

    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if resetOnProps is true and props changed
    if (this.props.resetOnProps && this.state.hasError && prevProps !== this.props) {
      this.resetError();
    }
  }

  resetError(): void {
    const newRetryCount = this.state.retryCount + 1;

    // Only reset if we haven't exceeded max retries
    if (newRetryCount <= (this.props.maxRetries || 3)) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: newRetryCount,
      });
    } else {
      // Log that max retries were exceeded
      ErrorLogger.getInstance().logError(
        `Maximum retry attempts (${this.props.maxRetries}) exceeded`,
        this.componentName,
        ErrorSeverity.WARNING
      );
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // If custom fallback was provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise use our ErrorFallback component
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetError}
          componentName={this.componentName}
        />
      );
    }

    // If there's no error, render the children
    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with an error boundary
 * @param Component Component to wrap
 * @param errorBoundaryProps Props for the error boundary
 * @returns Wrapped component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'> = {}
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary
      {...errorBoundaryProps}
      componentName={errorBoundaryProps.componentName || displayName}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
