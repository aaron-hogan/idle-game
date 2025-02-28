/**
 * Redux utility functions for selector memoization
 */

/**
 * Custom equality function for React-Redux useSelector to prevent unnecessary renders
 * @param prev Previous value
 * @param curr Current value
 * @returns Whether the values are considered equal
 */
export const shallowEqual = <T>(prev: T, curr: T): boolean => {
  if (prev === curr) return true;
  if (!prev || !curr) return false;

  // For arrays, compare length and values
  if (Array.isArray(prev) && Array.isArray(curr)) {
    if (prev.length !== curr.length) return false;
    return prev.every((val, idx) => val === curr[idx]);
  }

  // For objects, compare keys and values
  if (typeof prev === 'object' && typeof curr === 'object') {
    const prevKeys = Object.keys(prev as object);
    const currKeys = Object.keys(curr as object);

    if (prevKeys.length !== currKeys.length) return false;

    return prevKeys.every((key) => 
      (prev as Record<string, unknown>)[key] === (curr as Record<string, unknown>)[key]
    );
  }

  return false;
};

/**
 * Creates a memoized selector for useSelector to prevent unnecessary rerenders
 * @param selector The selector function
 * @returns A memoized selector function
 */
export const createMemoizedSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected
) => {
  let lastState: TState | null = null;
  let lastValue: TSelected | null = null;

  return (state: TState): TSelected => {
    if (state === lastState) {
      return lastValue as TSelected;
    }

    const value = selector(state);

    // If value is an array or object, create a stable reference
    if (Array.isArray(value)) {
      // Only update if contents changed
      if (!lastValue || !shallowEqual(value, lastValue)) {
        lastValue = [...value] as unknown as TSelected;
      }
    } else if (typeof value === 'object' && value !== null) {
      // Only update if contents changed
      if (!lastValue || !shallowEqual(value, lastValue)) {
        lastValue = { ...value } as unknown as TSelected;
      }
    } else {
      lastValue = value;
    }

    lastState = state;
    return lastValue as TSelected;
  };
};
