// src/redux/store.ts
import { combineReducers } from './combineReducers';
import authReducer from './authSlice';
import chatroomsReducer from './chatroomsSlice';
import messagesReducer from './messagesSlice';
import messagesPaginationReducer from './messagesPaginationSlice';
import uiReducer from './uiSlice';
import type { AuthState, ChatroomsState, MessagesState, MessagesPaginationState, UiState, RootState, AppActions, AuthActions, ChatroomsActions, MessagesActions, UiActions } from '../types';

// Type-safe reducer wrappers
const typedAuthReducer = (state: AuthState | undefined, action: AppActions): AuthState => {
  return authReducer(state as AuthState, action as AuthActions);
};

const typedChatroomsReducer = (state: ChatroomsState | undefined, action: AppActions): ChatroomsState => {
  return chatroomsReducer(state as ChatroomsState, action as ChatroomsActions);
};

const typedMessagesReducer = (state: MessagesState | undefined, action: AppActions): MessagesState => {
  return messagesReducer(state as MessagesState, action as MessagesActions);
};

const typedMessagesPaginationReducer = (state: MessagesPaginationState | undefined, action: AppActions): MessagesPaginationState => {
  return messagesPaginationReducer(state as MessagesPaginationState, action as MessagesActions);
};

const typedUiReducer = (state: UiState | undefined, action: AppActions): UiState => {
  return uiReducer(state as UiState, action as UiActions);
};

// Initial state for each slice
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
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

const initialMessagesPaginationState: MessagesPaginationState = {}; // Pagination state indexed by chatroomId

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
  messagesPagination: initialMessagesPaginationState,
  ui: initialUiState,
};

// Root reducer combines all individual reducers
export const rootReducer = combineReducers<RootState, AppActions>({
  auth: typedAuthReducer,
  chatrooms: typedChatroomsReducer,
  messages: typedMessagesReducer,
  messagesPagination: typedMessagesPaginationReducer,
  ui: typedUiReducer,
});