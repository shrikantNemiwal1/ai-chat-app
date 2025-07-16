export interface Country {
    name: string;
    dial_code: string;
  }

  export interface User {
    id: string; // Full phone number with country code
    phone: string; // Full phone number with country code  
    password: string; // Hashed password (in real app)
    createdAt: string;
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
    user: User | null;
    otpVerified: boolean;
    otp?: string | null;
    otpExpiry?: number | null;
  }
  
  export interface ChatroomsState {
    list: Chatroom[];
    selectedChatroomId: string | null;
    searchTerm: string;
  }
  
  export interface MessagesPagination {
    hasMore: boolean;
    isLoading: boolean;
    page: number;
    totalMessages: number;
  }

  export interface MessagesState {
    [chatroomId: string]: Message[];
  }

  export interface MessagesPaginationState {
    [chatroomId: string]: MessagesPagination;
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
    messagesPagination: MessagesPaginationState;
    ui: UiState;
  }
  
  // Action Types
  export type AuthActions =
    | { type: 'auth/loginSuccess'; payload: { user: User } }
    | { type: 'auth/logout' }
    | { type: 'auth/setOtp'; payload: { otp: string; otpExpiry: number } }
    | { type: 'auth/clearOtp' }
    | { type: 'auth/signUpSuccess'; payload: { user: User } };
  
  export type ChatroomsActions =
    | { type: 'chatrooms/addChatroom'; payload: Chatroom }
    | { type: 'chatrooms/deleteChatroom'; payload: string }
    | { type: 'chatrooms/selectChatroom'; payload: string | null }
    | { type: 'chatrooms/setSearchTerm'; payload: string }
    | { type: 'chatrooms/addMessageToChatroom'; payload: { chatroomId: string; messageId: string } };
  
  export type MessagesActions =
    | { type: 'messages/addMessage'; payload: { chatroomId: string; message: Message } }
    | { type: 'messages/prependMessages'; payload: { chatroomId: string; messages: Message[] } }
    | { type: 'messages/setInitialMessages'; payload: { chatroomId: string; messages: Message[]; hasMore: boolean; totalMessages: number } }
    | { type: 'messages/clearMessages' }
    | { type: 'messagesPagination/setLoading'; payload: { chatroomId: string; isLoading: boolean } }
    | { type: 'messagesPagination/updatePagination'; payload: { chatroomId: string; hasMore: boolean; page: number; totalMessages: number } }
    | { type: 'messagesPagination/resetPagination'; payload: { chatroomId: string } };
  
  export type UiActions =
    | { type: 'ui/toggleDarkMode' }
    | { type: 'ui/addToast'; payload: Omit<Toast, 'id'> }
    | { type: 'ui/removeToast'; payload: number }
    | { type: 'ui/setLoading'; payload: Partial<UiState['loading']> }
    | { type: 'ui/setTypingIndicator'; payload: boolean };
  
  export type AppActions = AuthActions | ChatroomsActions | MessagesActions | UiActions;