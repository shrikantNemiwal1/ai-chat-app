// src/contexts/GlobalContext.ts
import { createContext } from 'react';
import type { Dispatch } from 'react';
import type { RootState, AppActions } from '../types';

// Create contexts for global state and dispatch
export const GlobalStateContext = createContext<RootState | undefined>(undefined);
export const GlobalDispatchContext = createContext<Dispatch<AppActions> | undefined>(undefined);
