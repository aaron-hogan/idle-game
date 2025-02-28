import { Store } from 'redux';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',     // Informational issues that don't affect gameplay
  WARNING = 'warn',  // Issues that might affect gameplay but don't break it
  ERROR = 'error',   // Serious issues that could break parts of the game
  CRITICAL = 'critical', // Critical issues that could crash the game
}

/**
 * Error record structure
 */
export interface ErrorRecord {
  message: string;
  context?: string;
  timestamp: Date;
  data?: unknown;
  stack?: string;
  severity: ErrorSeverity;
  handled: boolean;
}

/**
 * Central error logging utility for the game
 * Handles error reporting, logging, and recovery
 */
export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorRecord[] = [];
  private errorListeners: Array<(error: Error, context?: string, severity?: ErrorSeverity) => void> = [];
  private maxErrorLog: number = 100; // Maximum number of errors to store

  private constructor() {
    // Private constructor for singleton pattern
    
    // Add global error handler for uncaught exceptions
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError(event.error || new Error(event.message), {
          component: 'WindowGlobal',
          source: event.filename,
          line: event.lineno,
          column: event.colno
        }, ErrorSeverity.CRITICAL);
        
        // Don't prevent default error handling
        return false;
      });
      
      // Add unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
        this.logError(error, 'UnhandledPromiseRejection', ErrorSeverity.ERROR);
      });
    }
  }

  /**
   * Get the singleton instance of ErrorLogger
   */
  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }
  
  /**
   * Reset the error logger instance (primarily for testing)
   * In production, this should only be used when recovering from critical errors
   */
  public static resetInstance(): void {
    if (ErrorLogger.instance) {
      ErrorLogger.instance.clearErrors();
      ErrorLogger.instance.errorListeners = [];
    }
    ErrorLogger.instance = new ErrorLogger();
  }

  /**
   * Log an error with optional context and data
   * @param error The error to log
   * @param contextOrMetadata Additional context about where the error occurred, or a metadata object
   * @param severityOrData Severity level or additional data
   * @param extraData Optional additional data if severity is provided
   */
  public logError(
    error: Error | string, 
    contextOrMetadata?: string | Record<string, unknown>, 
    severityOrData?: ErrorSeverity | unknown,
    extraData?: unknown
  ): void {
    let context: string | undefined;
    let metadata: Record<string, unknown> | undefined;
    let severity: ErrorSeverity = ErrorSeverity.ERROR;
    let data: unknown = undefined;
    
    // Parse the parameters
    if (typeof contextOrMetadata === 'string') {
      context = contextOrMetadata;
      if (severityOrData && Object.values(ErrorSeverity).includes(severityOrData as ErrorSeverity)) {
        severity = severityOrData as ErrorSeverity;
        data = extraData;
      } else {
        data = severityOrData;
      }
    } else if (typeof contextOrMetadata === 'object' && contextOrMetadata !== null) {
      metadata = contextOrMetadata;
      context = (metadata.component as string) || (metadata.context as string);
      if (severityOrData && Object.values(ErrorSeverity).includes(severityOrData as ErrorSeverity)) {
        severity = severityOrData as ErrorSeverity;
        data = extraData;
      } else {
        data = severityOrData;
      }
    }
    
    const errorMsg = typeof error === 'string' ? error : error.message;
    const errorObj: ErrorRecord = {
      message: errorMsg,
      context,
      timestamp: new Date(),
      data: data || extraData || metadata,
      stack: error instanceof Error ? error.stack : undefined,
      severity,
      handled: false
    };

    // Only log errors and critical errors to the console
    // Skip INFO and WARNING level logs to reduce console spam
    if (severity === ErrorSeverity.CRITICAL) {
      console.error(`[CRITICAL${context ? ' in ' + context : ''}]: ${errorMsg}`, metadata || data);
    } else if (severity === ErrorSeverity.ERROR) {
      console.error(`[ERROR${context ? ' in ' + context : ''}]: ${errorMsg}`, metadata || data);
    }
    
    // Skip logging INFO and WARNING to console
    
    // Add to error log, maintaining max log size
    this.errors.push(errorObj);
    if (this.errors.length > this.maxErrorLog) {
      this.errors = this.errors.slice(-this.maxErrorLog);
    }
    
    // Notify any registered error listeners
    this.errorListeners.forEach(listener => {
      listener(
        typeof error === 'string' ? new Error(error) : error, 
        context,
        severity
      );
    });
  }

  /**
   * Register a listener for error events
   * @param listener Function to call when an error occurs
   */
  public addErrorListener(listener: (error: Error, context?: string, severity?: ErrorSeverity) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * Remove a previously registered error listener
   * @param listener The listener to remove
   */
  public removeErrorListener(listener: (error: Error, context?: string, severity?: ErrorSeverity) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index !== -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * Get all logged errors
   * @param severity Optional filter for severity level
   */
  public getErrors(severity?: ErrorSeverity): ErrorRecord[] {
    if (severity) {
      return this.errors.filter(error => error.severity === severity);
    }
    return [...this.errors];
  }

  /**
   * Get count of errors by severity
   */
  public getErrorCounts(): Record<ErrorSeverity, number> {
    const counts = {
      [ErrorSeverity.INFO]: 0,
      [ErrorSeverity.WARNING]: 0,
      [ErrorSeverity.ERROR]: 0,
      [ErrorSeverity.CRITICAL]: 0,
    };
    
    this.errors.forEach(error => {
      counts[error.severity]++;
    });
    
    return counts;
  }

  /**
   * Mark an error as handled
   * @param index Index of the error to mark as handled
   */
  public markErrorHandled(index: number): void {
    if (index >= 0 && index < this.errors.length) {
      this.errors[index].handled = true;
    }
  }

  /**
   * Clear all logged errors
   * @param severity Optional filter to only clear errors of a specific severity
   */
  public clearErrors(severity?: ErrorSeverity): void {
    if (severity) {
      this.errors = this.errors.filter(error => error.severity !== severity);
    } else {
      this.errors = [];
    }
  }

  /**
   * Set the maximum number of errors to keep in the log
   * @param maxErrors Maximum number of errors
   */
  public setMaxErrorLog(maxErrors: number): void {
    if (maxErrors > 0) {
      this.maxErrorLog = maxErrors;
      
      // Trim log if needed
      if (this.errors.length > this.maxErrorLog) {
        this.errors = this.errors.slice(-this.maxErrorLog);
      }
    }
  }
}

/**
 * Assertion utility for validating invariants
 * @param condition Condition that must be true
 * @param message Error message if condition is false
 * @param context Optional context for the error
 * @param severity Optional severity level
 */
export function invariant(
  condition: unknown, 
  message: string, 
  context?: string, 
  severity: ErrorSeverity = ErrorSeverity.ERROR
): asserts condition {
  if (!condition) {
    const error = new Error(`Invariant violation: ${message}`);
    ErrorLogger.getInstance().logError(error, context, severity);
    throw error;
  }
}

/**
 * Try to perform an operation safely, returning a result object
 * @param fn Function to execute safely
 * @param context Context for error logging
 * @param fallbackValue Optional fallback value if the operation fails
 */
export function trySafe<T>(
  fn: () => T,
  context: string,
  fallbackValue?: T
): { success: boolean; result?: T; error?: Error } {
  try {
    const result = fn();
    return { success: true, result };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    ErrorLogger.getInstance().logError(error, context);
    return { 
      success: false, 
      result: fallbackValue, 
      error 
    };
  }
}

/**
 * Safe function wrapper that catches errors and logs them
 * @param fn Function to wrap
 * @param context Context for error logging
 * @param fallbackValue Value to return if function throws
 */
export function safeFn<T, Args extends unknown[]>(
  fn: (...args: Args) => T,
  context: string,
  fallbackValue?: T
): (...args: Args) => T {
  return (...args: Args): T => {
    try {
      return fn(...args);
    } catch (error) {
      ErrorLogger.getInstance().logError(
        error instanceof Error ? error : new Error(String(error)), 
        context
      );
      return fallbackValue as T;
    }
  };
}

/**
 * Attach error monitoring to a Redux store
 * @param store Redux store to monitor
 */
export function attachErrorMonitoring(store: Store): () => void {
  const logger = ErrorLogger.getInstance();
  
  // Subscribe to store changes to detect state errors
  const unsubscribe = store.subscribe(() => {
    try {
      const state = store.getState();
      // Only perform minimal validation - we don't want to log errors for every state change
      if (!state) {
        throw new Error('Store state is undefined');
      }
    } catch (error) {
      logger.logError(
        error instanceof Error ? error : new Error(String(error)), 
        'Redux Store',
        ErrorSeverity.ERROR
      );
    }
  });
  
  // Return unsubscribe function to allow cleanup
  return unsubscribe;
}