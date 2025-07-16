/**
 * Application Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the AI Chat application. It provides type safety and documentation
 * for data structures, state management, and component props.
 */

// ================== API & EXTERNAL DATA ==================

/** Country information for phone number formatting */
export interface Country {
  /** Full country name */
  name: string;
  /** International dialing code (e.g., "+91", "+1") */
  dial_code: string;
}

// ================== USER MANAGEMENT ==================

/** User account information */
export interface User {
  /** Unique user identifier (phone number used as ID) */
  id: string;
  /** Full phone number with country code */
  phone: string;
  /** Hashed password (never store plain text in production!) */
  password: string;
  /** ISO timestamp of account creation */
  createdAt: string;
}

// ================== UI COMPONENTS ==================

/** Toast notification data structure */
export interface Toast {
  /** Unique identifier for toast management */
  id: number;
  /** Message text to display */
  message: string;
  /** Visual style and semantic meaning */
  type: 'success' | 'error' | 'info';
}

// ================== MESSAGING SYSTEM ==================

/** Individual chat message data structure */
export interface Message {
  /** Unique message identifier */
  id: string;
  /** Message author type */
  sender: 'user' | 'ai';
  /** Message text content */
  content: string;
  /** Optional image attachment (Base64 encoded) */
  image?: string | null;
  /** Formatted timestamp string */
  timestamp: string;
  /** Content type for rendering logic */
  type: 'text' | 'image';
}

/** Chat room/conversation container */
export interface Chatroom {
  /** Unique chatroom identifier */
  id: string;
  /** Human-readable chatroom name */
  title: string;
  /** Array of message IDs (for efficient loading) */
  messages: string[];
}

// ================== REDUX STATE MANAGEMENT ==================

/** Authentication state slice */
export interface AuthState {
  /** Whether user is currently logged in */
  isAuthenticated: boolean;
  /** Current user data (null if not authenticated) */
  user: User | null;
  /** Whether OTP has been verified */
  otpVerified: boolean;
  /** Current OTP value (for verification flow) */
  otp?: string | null;
  /** OTP expiration timestamp */
  otpExpiry?: number | null;
}

/** Chatrooms management state slice */
export interface ChatroomsState {
  /** Array of all available chatrooms */
  list: Chatroom[];
  /** Currently active chatroom ID */
  selectedChatroomId: string | null;
  /** Current search/filter term */
  searchTerm: string;
}

/** Pagination metadata for message loading */
export interface MessagesPagination {
  /** Whether more messages are available to load */
  hasMore: boolean;
  /** Current page number (0-based) */
  page: number;
  /** Total count of messages in conversation */
  totalMessages: number;
  /** Loading state for pagination requests */
  isLoading: boolean;
}

/** Messages state organized by chatroom */
export interface MessagesState {
  /** Messages indexed by chatroom ID */
  [chatroomId: string]: Message[];
}

/** Pagination state organized by chatroom */
export interface MessagesPaginationState {
  /** Pagination info indexed by chatroom ID */
  [chatroomId: string]: MessagesPagination;
}

/** UI state for theme, notifications, and loading states */
export interface UiState {
  /** Current theme preference */
  darkMode: boolean;
  /** Active toast notifications */
  toasts: Toast[];
  /** Loading states for different operations */
  loading: {
    /** OTP verification loading */
    otp: boolean;
    /** Chatroom creation loading */
    chatroomCreate: boolean;
    /** Message sending loading */
    messageSend: boolean;
  };
  /** AI typing indicator state */
  isTyping: boolean;
}

/** Root application state combining all slices */
export interface RootState {
  /** Authentication state */
  auth: AuthState;
  /** Chatrooms management state */
  chatrooms: ChatroomsState;
  /** Messages data state */
  messages: MessagesState;
  /** Message pagination state */
  messagesPagination: MessagesPaginationState;
  /** UI state and preferences */
  ui: UiState;
}

// ================== REDUX ACTION TYPES ==================

/** Authentication-related action types */
export type AuthActions =
  | { type: 'auth/loginSuccess'; payload: { user: User } }
  | { type: 'auth/logout' }
  | { type: 'auth/setOtp'; payload: { otp: string; otpExpiry: number } }
  | { type: 'auth/clearOtp' }
  | { type: 'auth/signUpSuccess'; payload: { user: User } };

/** Chatroom management action types */
export type ChatroomsActions =
  | { type: 'chatrooms/addChatroom'; payload: Chatroom }
  | { type: 'chatrooms/deleteChatroom'; payload: string }
  | { type: 'chatrooms/selectChatroom'; payload: string | null }
  | { type: 'chatrooms/setSearchTerm'; payload: string }
  | { type: 'chatrooms/addMessageToChatroom'; payload: { chatroomId: string; messageId: string } };

/** Message and pagination action types */
export type MessagesActions =
  | { type: 'messages/addMessage'; payload: { chatroomId: string; message: Message } }
  | { type: 'messages/prependMessages'; payload: { chatroomId: string; messages: Message[] } }
  | { type: 'messages/setInitialMessages'; payload: { chatroomId: string; messages: Message[]; hasMore: boolean; totalMessages: number } }
  | { type: 'messages/clearMessages' }
  | { type: 'messagesPagination/setLoading'; payload: { chatroomId: string; isLoading: boolean } }
  | { type: 'messagesPagination/updatePagination'; payload: { chatroomId: string; hasMore: boolean; page: number; totalMessages: number } }
  | { type: 'messagesPagination/resetPagination'; payload: { chatroomId: string } };

/** UI state action types */
export type UiActions =
  | { type: 'ui/toggleDarkMode' }
  | { type: 'ui/addToast'; payload: Omit<Toast, 'id'> }
  | { type: 'ui/removeToast'; payload: number }
  | { type: 'ui/setLoading'; payload: Partial<UiState['loading']> }
  | { type: 'ui/setTypingIndicator'; payload: boolean };

/** Union of all application action types */
export type AppActions = AuthActions | ChatroomsActions | MessagesActions | UiActions;