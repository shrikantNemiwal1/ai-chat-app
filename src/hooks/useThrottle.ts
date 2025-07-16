// src/hooks/useThrottle.ts
import { useRef, useCallback } from 'react';

type CallbackFunction<T extends readonly unknown[]> = (...args: T) => void;

const useThrottle = <T extends readonly unknown[]>(callback: CallbackFunction<T>, delay: number): CallbackFunction<T> => {
  const lastCall = useRef<number>(0);
  const timeoutId = useRef<number | null>(null);

  return useCallback((...args: T) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    } else {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = window.setTimeout(() => {
        lastCall.current = Date.now();
        callback(...args);
      }, delay - (now - lastCall.current));
    }
  }, [callback, delay]);
};

export default useThrottle;