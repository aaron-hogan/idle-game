import { ErrorLogger } from './errorUtils';

/**
 * Utility functions for validation and defensive programming
 */

/**
 * Validates a number value is within bounds
 * @param value Value to validate
 * @param min Minimum allowed value (inclusive)
 * @param max Maximum allowed value (inclusive)
 * @param defaultValue Optional default value if validation fails
 * @returns Validated value within bounds
 */
export function validateNumber(
  value: number,
  min: number = -Infinity,
  max: number = Infinity,
  defaultValue?: number
): number {
  // Check if value is a valid number
  if (typeof value !== 'number' || isNaN(value)) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Invalid number value: ${value}`);
  }
  
  // Clamp between min and max
  return Math.max(min, Math.min(value, max));
}

/**
 * Validates a string value
 * @param value Value to validate
 * @param minLength Minimum allowed length
 * @param maxLength Maximum allowed length
 * @param defaultValue Optional default value if validation fails
 * @returns Validated string value
 */
export function validateString(
  value: string,
  minLength: number = 0,
  maxLength: number = Infinity,
  defaultValue?: string
): string {
  // Check if value is a valid string
  if (typeof value !== 'string') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Invalid string value: ${value}`);
  }
  
  // Check length constraints
  if (value.length < minLength || value.length > maxLength) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`String length outside bounds (${minLength}-${maxLength}): ${value.length}`);
  }
  
  return value;
}

/**
 * Validates an object has required properties
 * @param obj Object to validate
 * @param requiredProps Array of required property names
 * @param context Optional context for error logging
 * @returns Boolean indicating if validation passed
 */
export function validateObject<T extends object>(
  obj: T | null | undefined,
  requiredProps: Array<keyof T>,
  context?: string
): obj is T {
  // Check if object exists
  if (obj === null || obj === undefined) {
    ErrorLogger.getInstance().logError(`Invalid object: ${obj}`, context);
    return false;
  }
  
  // Check all required properties
  for (const prop of requiredProps) {
    if (!(prop in obj) || obj[prop] === undefined) {
      ErrorLogger.getInstance().logError(`Missing required property: ${String(prop)}`, context);
      return false;
    }
  }
  
  return true;
}

/**
 * Type guard for checking if a value is a non-null object
 * @param value Value to check
 * @returns Type guard assertion
 */
export function isObject<T>(value: T): value is Extract<T, object> {
  return typeof value === 'object' && value !== null;
}

/**
 * Null object pattern - creates a safe default object when the original is null/undefined
 * @param obj Original object
 * @param defaultObj Default object to use if original is null/undefined
 * @returns Original object or default object
 */
export function withDefault<T>(obj: T | null | undefined, defaultObj: T): T {
  return obj ?? defaultObj;
}

/**
 * Safe JSON parse with error handling
 * @param json JSON string to parse
 * @param defaultValue Default value if parsing fails
 * @returns Parsed object or default value
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    ErrorLogger.getInstance().logError(`Failed to parse JSON: ${error}`, 'safeJsonParse');
    return defaultValue;
  }
}

/**
 * Safe JSON stringify with error handling
 * @param value Value to stringify
 * @param defaultValue Default string if stringification fails
 * @returns JSON string or default value
 */
export function safeJsonStringify(value: any, defaultValue: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    ErrorLogger.getInstance().logError(`Failed to stringify object: ${error}`, 'safeJsonStringify');
    return defaultValue;
  }
}