/**
 * LocalStorage Utilities
 * 
 * This module provides utilities for persisting and loading application state
 * to/from localStorage. It handles serialization, error recovery, and provides
 * development utilities for state management.
 * 
 * @module localStorage
 */

import type { RootState } from '../types';

/** Storage key for persisting application state in localStorage */
const STORAGE_KEY = 'geminiCloneState';

/**
 * Loads the persisted state from localStorage with error handling
 * 
 * Attempts to retrieve and parse the application state from localStorage.
 * Returns the default state if no saved state exists or if parsing fails.
 * 
 * @param defaultState - The default state to return if loading fails
 * @returns The loaded state from localStorage or the provided default state
 * @example
 * ```typescript
 * const state = loadPersistedState(initialState);
 * ```
 */
export const loadPersistedState = (defaultState: RootState): RootState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return defaultState;
    }
    return JSON.parse(serializedState) as RootState;
  } catch (error: unknown) {
    console.error("Failed to load state from localStorage:", error instanceof Error ? error.message : 'Unknown error');
    return defaultState;
  }
};

/**
 * Saves the current application state to localStorage
 * 
 * Serializes the state object and persists it to localStorage.
 * Includes error handling for quota exceeded and other storage errors.
 * 
 * @param state - The complete application state to persist
 * @returns True if the save operation was successful, false otherwise
 * @example
 * ```typescript
 * const success = persistState(currentState);
 * if (!success) {
 *   console.warn('Failed to save state');
 * }
 * ```
 */
export const persistState = (state: RootState): boolean => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
    return true;
  } catch (error: unknown) {
    console.error("Failed to save state to localStorage:", error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};

/**
 * Clears all persisted messages from localStorage
 * 
 * Development utility that removes all messages and pagination data
 * while preserving other state like authentication and UI settings.
 * Useful for testing and development scenarios.
 * 
 * @example
 * ```typescript
 * // Clear messages during development/testing
 * clearPersistedMessages();
 * ```
 */
export const clearPersistedMessages = (): void => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState) {
      const state = JSON.parse(serializedState) as RootState;
      const clearedState: RootState = {
        ...state,
        messages: {},
        messagesPagination: {}
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clearedState));
    }
  } catch (error: unknown) {
    console.error("Failed to clear messages from localStorage:", error instanceof Error ? error.message : 'Unknown error');
  }
};
