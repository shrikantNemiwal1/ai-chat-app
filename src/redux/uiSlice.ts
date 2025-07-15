// src/redux/uiSlice.ts
import type { UiState, UiActions, Toast } from '../types';

const uiReducer = (state: UiState, action: UiActions): UiState => {
  switch (action.type) {
    case 'ui/toggleDarkMode':
      return { ...state, darkMode: !state.darkMode };
    case 'ui/addToast':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload } as Toast] };
    case 'ui/removeToast':
      return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload) };
    case 'ui/setLoading':
      return { ...state, loading: { ...state.loading, ...action.payload } };
    case 'ui/setTypingIndicator':
      return { ...state, isTyping: action.payload };
    default:
      return state;
  }
};
export default uiReducer;