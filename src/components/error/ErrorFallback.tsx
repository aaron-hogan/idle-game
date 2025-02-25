import React, { useState } from 'react';
import { ErrorLogger } from '../../utils/errorUtils';

interface ErrorFallbackProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  resetErrorBoundary?: () => void;
  componentName?: string;
  showDetails?: boolean;
  showReportButton?: boolean;
  onReport?: (error: Error | null) => void;
}

/**
 * A reusable fallback component to display when an error occurs.
 * This can be customized for different parts of the application.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  errorInfo,
  resetErrorBoundary,
  componentName,
  showDetails = false,
  showReportButton = true,
  onReport
}) => {
  const [expanded, setExpanded] = useState(showDetails);
  const [reportSent, setReportSent] = useState(false);
  
  const handleReport = () => {
    // Default report handler uses the ErrorLogger
    if (onReport && error !== undefined) {
      onReport(error);
    } else if (error) {
      ErrorLogger.getInstance().logError(
        `User reported error: ${error.message}`,
        componentName || 'ErrorFallback',
        {
          userReported: true,
          originalError: error,
          originalStack: error.stack,
          componentInfo: errorInfo,
        }
      );
    }
    
    setReportSent(true);
  };
  
  return (
    <div role="alert" className="error-fallback">
      <div className="error-fallback-header">
        <h3>
          {componentName ? `Error in ${componentName}` : 'Something went wrong'}
        </h3>
        {resetErrorBoundary && (
          <button 
            onClick={resetErrorBoundary}
            className="error-reset-button"
          >
            Try again
          </button>
        )}
      </div>
      
      <div className="error-fallback-content">
        {error && (
          <div className="error-message">
            <p>{error.message || 'An unknown error occurred'}</p>
            
            <div className="error-fallback-actions">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="error-details-toggle"
              >
                {expanded ? 'Hide details' : 'Show details'}
              </button>
              
              {showReportButton && !reportSent && (
                <button 
                  onClick={handleReport}
                  className="error-report-button"
                >
                  Report issue
                </button>
              )}
              
              {reportSent && (
                <span className="error-report-sent">
                  Thank you for reporting this issue
                </span>
              )}
            </div>
            
            {expanded && (
              <div className="error-details">
                <h4>Error Details</h4>
                {error.stack && (
                  <pre className="error-stack">{error.stack}</pre>
                )}
                
                {errorInfo && errorInfo.componentStack && (
                  <>
                    <h4>Component Stack</h4>
                    <pre className="error-component-stack">
                      {errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        
        {!error && (
          <p>An unknown error occurred. Please try again or refresh the page.</p>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;