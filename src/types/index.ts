// src/types/index.ts
export interface Country {
    name: string;
    dial_code: string;
  }
  
  export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  
  export interface Message {
    id: string;
    sender: 'user' | 'ai';
    content: string;
    image?: string | null; // Base64 string for image
    timestamp: string;
    type: 'text' | 'image';
  }
  
  export interface Chatroom {
    id: string;
    title: string;
    messages: string[]; // Array of message IDs
  }
  
  // Redux-like State Interfaces
  export interface AuthState {
    isAuthenticated: boolean;
    phone: string | null;
    otpVerified: boolean;
    otp?: string | null;
    otpExpiry?: number | null;
  }
  
  export interface ChatroomsState {
    list: Chatroom[];
    selectedChatroomId: string | null;
    searchTerm: string;
  }
  
  export interface MessagesState {
    [chatroomId: string]: Message[];
  }
  
  export interface UiState {
    darkMode: boolean;
    toasts: Toast[];
    loading: {
      otp: boolean;
      chatroomCreate: boolean;
      messageSend: boolean;
    };
    isTyping: boolean;
  }
  
  export interface RootState {
    auth: AuthState;
    chatrooms: ChatroomsState;
    messages: MessagesState;
    ui: UiState;
  }
  
  // Action Types
  export type AuthActions =
    | { type: 'auth/loginSuccess'; payload: { userId: string } }
    | { type: 'auth/logout' }
    | { type: 'auth/setOtp'; payload: { otp: string; otpExpiry: number } }
    | { type: 'auth/clearOtp' };
  
  export type ChatroomsActions =
    | { type: 'chatrooms/addChatroom'; payload: Chatroom }
    | { type: 'chatrooms/deleteChatroom'; payload: string }
    | { type: 'chatrooms/selectChatroom'; payload: string | null }
    | { type: 'chatrooms/setSearchTerm'; payload: string }
    | { type: 'chatrooms/addMessageToChatroom'; payload: { chatroomId: string; messageId: string } };
  
  export type MessagesActions =
    | { type: 'messages/addMessage'; payload: { chatroomId: string; message: Message } }
    | { type: 'messages/prependMessages'; payload: { chatroomId: string; messages: Message[] } }
    | { type: 'messages/clearMessages' };
  
  export type UiActions =
    | { type: 'ui/toggleDarkMode' }
    | { type: 'ui/addToast'; payload: Omit<Toast, 'id'> }
    | { type: 'ui/removeToast'; payload: number }
    | { type: 'ui/setLoading'; payload: Partial<UiState['loading']> }
    | { type: 'ui/setTypingIndicator'; payload: boolean };
  
  export type AppActions = AuthActions | ChatroomsActions | MessagesActions | UiActions;