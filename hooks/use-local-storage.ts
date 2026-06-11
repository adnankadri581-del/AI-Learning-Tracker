'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          // Try to parse the item, fall back to initialValue if parsing fails
          try {
            const parsed = JSON.parse(item);
            // Validate that parsed result is not null/undefined
            if (parsed !== null && parsed !== undefined) {
              setStoredValue(parsed);
            }
          } catch (parseError) {
            // If JSON is invalid, clear the key and use initialValue
            console.warn(`Invalid JSON in localStorage key "${key}", resetting to default`);
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  return { value: storedValue, setValue, isLoading };
}
