/**
 * useThrottle Hook
 * 
 * A React hook that throttles function calls to improve performance
 * by limiting how often a function can be executed. Uses both immediate
 * execution and delayed execution patterns for optimal user experience.
 * 
 * @module useThrottle
 */

import { useRef, useCallback } from 'react';

/** Generic callback function type with variable arguments */
type CallbackFunction<T extends readonly unknown[]> = (...args: T) => void;

/**
 * Throttles a function to limit its execution frequency
 * 
 * This hook implements a sophisticated throttling strategy:
 * - Immediate execution if enough time has passed since last call
 * - Delayed execution if called too frequently
 * - Cancels pending delayed executions when new calls arrive
 * 
 * @template T - Tuple type representing the callback function's arguments
 * @param callback - The function to throttle
 * @param delay - Minimum time between executions in milliseconds
 * @returns Throttled version of the callback function
 * 
 * @example
 * ```typescript
 * // Throttle search API calls
 * const throttledSearch = useThrottle((query: string) => {
 *   searchAPI(query);
 * }, 300);
 * 
 * // Throttle scroll event handler
 * const throttledScroll = useThrottle(() => {
 *   handleScroll();
 * }, 100);
 * ```
 */

const useThrottle = <T extends readonly unknown[]>(callback: CallbackFunction<T>, delay: number): CallbackFunction<T> => {
  /** Timestamp of the last function execution */
  const lastCall = useRef<number>(0);
  /** Reference to the pending timeout for delayed execution */
  const timeoutId = useRef<number | null>(null);

  return useCallback((...args: T) => {
    const now = Date.now();
    
    // If enough time has passed, execute immediately
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    } else {
      // Cancel any pending delayed execution
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      
      // Schedule delayed execution for the remaining time
      timeoutId.current = window.setTimeout(() => {
        lastCall.current = Date.now();
        callback(...args);
      }, delay - (now - lastCall.current));
    }
  }, [callback, delay]);
};

export default useThrottle;