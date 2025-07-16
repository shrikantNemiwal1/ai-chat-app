// src/hooks/useGlobalContext.ts
import { useContext } from 'react';
import type { Dispatch } from 'react';
import { GlobalStateContext, GlobalDispatchContext } from '../contexts/GlobalContext';
import type { RootState, AppActions } from '../types';

/**
 * Custom hook to access global application state
 * @returns {RootState} The global application state
 * @throws {Error} If used outside of GlobalStateContext.Provider
 */
export const useGlobalState = (): RootState => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateContext.Provider');
  }
  return context;
};

/**
 * Custom hook to access global dispatch function
 * @returns {Dispatch<AppActions>} The global dispatch function
 * @throws {Error} If used outside of GlobalDispatchContext.Provider
 */
export const useGlobalDispatch = (): Dispatch<AppActions> => {
  const context = useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalDispatchContext.Provider');
  }
  return context;
};
