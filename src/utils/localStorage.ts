// src/utils/localStorage.ts
import type { RootState } from '../types';

const STORAGE_KEY = 'geminiCloneState';

/**
 * Loads the persisted state from localStorage
 * @param defaultState The default state to return if no state is found or an error occurs
 * @returns The loaded state or the default state
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
 * Saves the state to localStorage
 * @param state The state to save
 * @returns true if successful, false otherwise
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
 * Clears all persisted messages from localStorage (useful for development/testing)
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
