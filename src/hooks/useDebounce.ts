/**
 * useDebounce Hook
 * 
 * A React hook that delays updating a value until after a specified
 * delay period has passed without the value changing. Useful for
 * optimizing expensive operations like API calls or search filtering.
 * 
 * @module useDebounce
 */

import { useState, useEffect } from 'react';

/**
 * Debounces a value to prevent frequent updates
 * 
 * Returns a debounced version of the input value that only updates
 * after the specified delay has passed without the value changing.
 * This is particularly useful for search inputs and API calls.
 * 
 * @template T - The type of the value being debounced
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns The debounced value
 * 
 * @example
 * ```typescript
 * // Debounce search input
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */

const useDebounce = <T>(value: T, delay: number): T => {
  /** State to hold the debounced value */
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Cleanup function to cancel the timer if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
