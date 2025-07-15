// src/redux/store.ts
import { combineReducers } from './combineReducers';
import authReducer from './authSlice';
import chatroomsReducer from './chatroomsSlice';
import messagesReducer from './messagesSlice';
import uiReducer from './uiSlice';
import type { AuthState, ChatroomsState, MessagesState, UiState, RootState, AppActions } from '../types';

// Initial state for each slice
const initialAuthState: AuthState = {
  isAuthenticated: false,
  phone: null,
  otpVerified: false,
};

const initialChatroomsState: ChatroomsState = {
  list: [
    { id: '1', title: 'General Chat', messages: [] },
    { id: '2', title: 'Support', messages: [] },
    { id: '3', title: 'AI Playground', messages: [] },
  ],
  selectedChatroomId: null,
  searchTerm: '',
};

const initialMessagesState: MessagesState = {}; // Messages indexed by chatroomId

const initialUiState: UiState = {
  darkMode: false,
  toasts: [],
  loading: {
    otp: false,
    chatroomCreate: false,
    messageSend: false,
  },
  isTyping: false,
};

// Combine all initial states into one root initial state
export const initialRootState: RootState = {
  auth: initialAuthState,
  chatrooms: initialChatroomsState,
  messages: initialMessagesState,
  ui: initialUiState,
};

// Root reducer combines all individual reducers
export const rootReducer = combineReducers<RootState, AppActions>({
  auth: authReducer as any, // Type assertion as combineReducers is generic
  chatrooms: chatroomsReducer as any,
  messages: messagesReducer as any,
  ui: uiReducer as any,
});