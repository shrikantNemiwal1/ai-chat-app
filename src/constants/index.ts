// src/constants/index.ts

/**
 * Application Constants
 * 
 * This file centralizes all application constants including:
 * - Storage configuration
 * - UI timing and behavior settings
 * - Message handling parameters
 * - Accessibility configurations
 * - Error messages and toast notifications
 */

// ================== STORAGE CONFIGURATION ==================

/** Local storage keys used throughout the application */
export const STORAGE_KEYS = {
  /** Key for storing user authentication data */
  USERS: 'ai_chat_users',
  /** Root key for Redux persist configuration */
  REDUX_PERSIST_ROOT: 'root',
} as const;

// ================== MESSAGE & PAGINATION ==================

/** Constants related to message handling and pagination */
export const MESSAGE_CONSTANTS = {
  /** Number of messages to load per page/batch */
  MESSAGES_PER_PAGE: 20,
  /** Total number of mock messages to generate per chatroom */
  TOTAL_MOCK_MESSAGES: 200,
  /** Distance from bottom (in pixels) to trigger auto-scroll */
  SCROLL_THRESHOLD: 200,
  /** Delay in milliseconds for simulated AI API responses */
  AI_RESPONSE_DELAY: 300,
  /** Delay in milliseconds for loading older messages */
  OLDER_MESSAGES_DELAY: 800,
  /** Timeout in milliseconds for scroll operations */
  SCROLL_TIMEOUT: 100,
} as const;

// ================== UI TIMING & BEHAVIOR ==================

/** UI-related timing constants and behavior settings */
export const UI_CONSTANTS = {
  /** Debounce delay in milliseconds for search input */
  DEBOUNCE_DELAY: 300,
  /** Simulated delay for chatroom creation operations */
  CHATROOM_CREATE_DELAY: 1000,
  /** Simulated delay for chatroom deletion operations */
  CHATROOM_DELETE_DELAY: 800,
  /** OTP expiry time in minutes */
  OTP_EXPIRY_MINUTES: 5,
} as const;

// ================== SCROLL & ANIMATION ==================

/** Scroll behavior constants for smooth user experience */
export const SCROLL_BEHAVIOR = {
  /** Smooth scrolling animation */
  SMOOTH: 'smooth',
  /** Instant scrolling without animation */
  INSTANT: 'instant',
  /** Scroll to the end of the block */
  BLOCK_END: 'end',
} as const;

// ================== USER NOTIFICATIONS ==================

/** Toast notification messages for user feedback */
export const TOAST_MESSAGES = {
  // Authentication Messages
  /** Success message for successful login */
  LOGIN_SUCCESS: 'Login successful!',
  /** Success message for logout */
  LOGOUT_SUCCESS: 'Logged out successfully.',
  /** Success message for account creation */
  SIGNUP_SUCCESS: 'Account created successfully!',
  /** Confirmation message for OTP sent */
  OTP_SENT: 'OTP sent successfully!',
  /** Confirmation message for OTP verification */
  OTP_VERIFIED: 'OTP verified successfully!',
  
  // Chatroom Management Messages
  /** Loading message while creating chatroom */
  CHATROOM_CREATING: 'Creating chatroom...',
  /** Success message for chatroom creation with title */
  CHATROOM_CREATED: (title: string) => `Chatroom '${title}' created!`,
  /** Loading message while deleting chatroom */
  CHATROOM_DELETING: (title: string) => `Deleting '${title}'...`,
  /** Success message for chatroom deletion */
  CHATROOM_DELETED: (title: string) => `Chatroom '${title}' deleted.`,
  
  // Error Messages
  /** Error message for failed message loading */
  MESSAGES_LOAD_FAILED: 'Failed to load messages',
  /** Error message for failed older messages loading */
  OLDER_MESSAGES_LOAD_FAILED: 'Failed to load older messages',
  /** Info message when no more messages available */
  NO_MORE_MESSAGES: 'No more messages to load',
  /** Error message for invalid login credentials */
  INVALID_CREDENTIALS: 'Invalid phone number or password',
  /** Error message when phone number already exists */
  PHONE_EXISTS: 'Phone number already exists',
  /** Error message for expired OTP */
  OTP_EXPIRED: 'OTP has expired',
  /** Error message for invalid OTP */
  OTP_INVALID: 'Invalid OTP',
} as const;

// ================== ERROR HANDLING ==================

/** Error messages for consistent error handling across the application */
export const ERROR_MESSAGES = {
  /** Validation error for empty chatroom title */
  EMPTY_CHATROOM_TITLE: 'Chatroom title cannot be empty.',
  /** Error when attempting to create user with existing phone number */
  USER_EXISTS: 'User with this phone number already exists',
  /** Generic error message for localStorage operations */
  LOCALSTORAGE_ERROR: 'Error reading users from localStorage:',
} as const;

// ================== AI RESPONSES ==================

/** Pre-defined AI response templates for realistic conversation simulation */
export const AI_RESPONSES = [
  "That's an interesting point! Let me think about that.",
  "I understand what you're saying. Here's my perspective...",
  "Great question! The answer depends on several factors.",
  "I can help you with that. Let me break it down for you.",
  "That's a common challenge many developers face.",
  "Here's what I would recommend in this situation:",
  "Let me provide you with a detailed explanation.",
  "That's definitely something worth considering.",
] as const;

// ================== REDUX CONFIGURATION ==================

/** Configuration settings for Redux persist */
export const PERSIST_CONFIG = {
  /** State slices to persist in localStorage */
  WHITELIST: ['auth', 'chatrooms', 'ui', 'messages', 'messagesPagination'] as string[],
  /** Redux actions to ignore during persistence */
  IGNORED_ACTIONS: ['persist/PERSIST', 'persist/REHYDRATE'] as string[],
} as const;

// ================== KEYBOARD SHORTCUTS ==================

/** Keyboard shortcuts for improved accessibility and user experience */
export const KEYBOARD_SHORTCUTS = {
  /** Create new chatroom shortcut */
  NEW_CHATROOM: 'ctrl+n',
  /** Focus search input shortcut */
  SEARCH: 'ctrl+f',
  /** Logout shortcut */
  LOGOUT: 'ctrl+l',
  /** Escape key for closing modals */
  ESCAPE: 'escape',
  /** Send message shortcut */
  SEND_MESSAGE: 'ctrl+enter',
} as const;

// ================== ACCESSIBILITY SUPPORT ==================

/** ARIA labels for screen readers and accessibility tools */
export const ARIA_LABELS = {
  // Interface Actions
  /** Label for send message button */
  SEND_MESSAGE: 'Send message',
  /** Label for theme toggle button */
  TOGGLE_THEME: 'Toggle dark/light theme',
  /** Label for search input */
  SEARCH_CHATROOMS: 'Search chatrooms',
  /** Label for create chatroom button */
  CREATE_CHATROOM: 'Create new chatroom',
  /** Label for delete chatroom button */
  DELETE_CHATROOM: 'Delete chatroom',
  /** Label for logout button */
  LOGOUT: 'Logout',
  /** Label for back to dashboard navigation */
  BACK_TO_DASHBOARD: 'Back to dashboard',
  
  // Content Areas
  /** Label for load older messages button */
  LOAD_OLDER_MESSAGES: 'Load older messages',
  /** Label for message input field */
  MESSAGE_INPUT: 'Type your message here',
  /** Label for image upload button */
  IMAGE_UPLOAD: 'Upload image',
  /** Label for remove image button */
  REMOVE_IMAGE: 'Remove selected image',
  /** Label for chatroom list container */
  CHATROOM_LIST: 'List of chatrooms',
  /** Label for message list container */
  MESSAGE_LIST: 'Chat messages',
  
  // Status Indicators
  /** Label for loading states */
  LOADING: 'Loading...',
  /** Label for typing indicator */
  TYPING_INDICATOR: 'AI is typing',
} as const;

/** ARIA roles for semantic HTML structure */
export const ARIA_ROLES = {
  /** Main content area */
  MAIN: 'main',
  /** Navigation area */
  NAVIGATION: 'navigation',
  /** Page header/banner */
  BANNER: 'banner',
  /** Complementary content */
  COMPLEMENTARY: 'complementary',
  /** Footer content info */
  CONTENTINFO: 'contentinfo',
  /** Modal dialog */
  DIALOG: 'dialog',
  /** Alert message */
  ALERT: 'alert',
  /** Status update */
  STATUS: 'status',
  /** Activity log (like chat messages) */
  LOG: 'log',
  /** Interactive button */
  BUTTON: 'button',
  /** Text input field */
  TEXTBOX: 'textbox',
  /** List of options */
  LISTBOX: 'listbox',
  /** Single option in a list */
  OPTION: 'option',
  /** Article content */
  ARTICLE: 'article',
  /** Generic region */
  REGION: 'region',
} as const;

// ================== FOCUS MANAGEMENT ==================

/** IDs for focus management and modal identification */
export const FOCUS_TRAP_IDS = {
  /** ID for create chatroom modal */
  CREATE_MODAL: 'create-chatroom-modal',
  /** ID for delete confirmation modal */
  DELETE_MODAL: 'delete-chatroom-modal',
  /** ID for main application content */
  MAIN_CONTENT: 'main-content',
} as const;
