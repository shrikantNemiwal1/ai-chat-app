// src/redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  otpVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.otpVerified = true;
    },
    signUpSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.otpVerified = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.otpVerified = false;
      state.otp = null;
      state.otpExpiry = null;
    },
    setOtp: (state, action: PayloadAction<{ otp: string; otpExpiry: number }>) => {
      state.otp = action.payload.otp;
      state.otpExpiry = action.payload.otpExpiry;
    },
    clearOtp: (state) => {
      state.otp = null;
      state.otpExpiry = null;
    },
  },
});

export const { loginSuccess, signUpSuccess, logout, setOtp, clearOtp } = authSlice.actions;
export default authSlice.reducer;