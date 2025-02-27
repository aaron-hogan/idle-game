import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState, AppDispatch } from './store';
import { createSelector } from '@reduxjs/toolkit';

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Standard useSelector with TypeScript types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Enhanced version of useSelector that memoizes both the selector and the result
 * to prevent unnecessary re-renders when returning arrays or objects
 */
export function useMemoSelector<T>(selector: (state: RootState) => T): T {
  // Create a memoized version of the selector
  const memoizedSelector = useMemo(
    () => createSelector(
      [(state: RootState) => state],
      (state) => selector(state)
    ),
    [selector]
  );
  
  // Use the memoized selector with useSelector
  return useSelector(memoizedSelector);
}