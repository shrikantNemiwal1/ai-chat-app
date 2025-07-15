// src/redux/authSlice.ts
import type { AuthState, AuthActions } from '../types';

const authReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'auth/loginSuccess':
      return { ...state, isAuthenticated: true, phone: action.payload.userId, otpVerified: true };
    case 'auth/logout':
      return { ...state, isAuthenticated: false, phone: null, otpVerified: false, otp: null, otpExpiry: null };
    case 'auth/setOtp':
      return { ...state, otp: action.payload.otp, otpExpiry: action.payload.otpExpiry };
    case 'auth/clearOtp':
      return { ...state, otp: null, otpExpiry: null };
    default:
      return state;
  }
};
export default authReducer;