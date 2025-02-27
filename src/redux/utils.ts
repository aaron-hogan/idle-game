/**
 * Redux utility functions for selector memoization
 */

/**
 * Custom equality function for React-Redux useSelector to prevent unnecessary renders
 * @param prev Previous value
 * @param curr Current value
 * @returns Whether the values are considered equal
 */
export const shallowEqual = (prev: any, curr: any): boolean => {
  if (prev === curr) return true;
  if (!prev || !curr) return false;
  
  // For arrays, compare length and values
  if (Array.isArray(prev) && Array.isArray(curr)) {
    if (prev.length !== curr.length) return false;
    return prev.every((val, idx) => val === curr[idx]);
  }
  
  // For objects, compare keys and values
  if (typeof prev === 'object' && typeof curr === 'object') {
    const prevKeys = Object.keys(prev);
    const currKeys = Object.keys(curr);
    
    if (prevKeys.length !== currKeys.length) return false;
    
    return prevKeys.every(key => prev[key] === curr[key]);
  }
  
  return false;
};

/**
 * Creates a memoized selector for useSelector to prevent unnecessary rerenders
 * @param selector The selector function
 * @returns A memoized selector function
 */
export const createMemoizedSelector = (selector: (state: any) => any) => {
  let lastState: any = null;
  let lastValue: any = null;
  
  return (state: any) => {
    if (state === lastState) {
      return lastValue;
    }
    
    const value = selector(state);
    
    // If value is an array or object, create a stable reference
    if (Array.isArray(value)) {
      // Only update if contents changed
      if (!lastValue || !shallowEqual(value, lastValue)) {
        lastValue = [...value];
      }
    } else if (typeof value === 'object' && value !== null) {
      // Only update if contents changed
      if (!lastValue || !shallowEqual(value, lastValue)) {
        lastValue = {...value};
      }
    } else {
      lastValue = value;
    }
    
    lastState = state;
    return lastValue;
  };
};