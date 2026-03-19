import { useState, useEffect } from "react";

export interface UseDebounceOptions {
  delay?: number;
}

/**
 * useDebounce - Hook for debouncing values
 * Useful for search inputs, API calls, and other delayed operations
 */
export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {}
): T {
  const { delay = 500 } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback - Hook for debouncing callback functions
 * Useful for debouncing event handlers
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: UseDebounceOptions = {}
): T {
  const { delay = 500 } = options;

  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => {
    let timeoutId: NodeJS.Timeout;

    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T;
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    setDebouncedCallback(
      ((...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback(...args);
        }, delay);
      }) as T
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [callback, delay]);

  return debouncedCallback;
}

