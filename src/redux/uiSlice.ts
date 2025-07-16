// src/redux/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UiState, Toast } from '../types';

const initialState: UiState = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  toasts: [],
  loading: {
    otp: false,
    chatroomCreate: false,
    messageSend: false,
  },
  isTyping: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = { id: Date.now(), ...action.payload };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<Partial<UiState['loading']>>) => {
      Object.assign(state.loading, action.payload);
    },
    setTypingIndicator: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode, addToast, removeToast, setLoading, setTypingIndicator } = uiSlice.actions;
export default uiSlice.reducer;