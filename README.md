# AI Chat Application - Gemini Frontend Clone

A fully functional, responsive conversational AI chat application built with React, TypeScript, and modern web technologies. This application simulates a Gemini-style chat interface with advanced features like OTP authentication, chatroom management, AI messaging, and comprehensive UX optimizations.

## 🚀 Live Demo

**[View Live Application](https://your-deployment-url.vercel.app)**

## 📸 Screenshots

![Login Page](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)
![Chat Interface](./screenshots/chat.png)
![Mobile View](./screenshots/mobile.png)

## ✨ Features

### 🔐 Authentication System

- **OTP-based Login/Signup** with international phone number support
- **Country Code Selection** with real-time country data fetching
- **Simulated OTP Verification** with realistic delays
- **Form Validation** using React Hook Form + Zod
- **Session Persistence** with localStorage integration

### 💬 Chat Interface

- **Real-time Chat UI** with user and AI messages
- **Simulated AI Responses** with typing indicators
- **Message Timestamps** with relative time formatting
- **Auto-scroll** to latest messages
- **Reverse Infinite Scroll** for loading older messages
- **Message Pagination** (20 messages per page)
- **Copy-to-Clipboard** feature on message hover
- **Image Upload Support** with preview functionality

### 🏠 Dashboard Features

- **Chatroom Management** - Create, delete, and organize chatrooms
- **Search Functionality** with debounced filtering
- **Toast Notifications** for user feedback
- **Loading Skeletons** for enhanced UX

### 🎨 User Experience

- **Fully Responsive Design** - Mobile, tablet, and desktop optimized
- **Dark/Light Mode Toggle** with system preference detection
- **Keyboard Accessibility** with focus management
- **Performance Optimizations** - React.memo, throttling, debouncing
- **Loading States** with shimmer effects

## 🛠️ Tech Stack

| Category             | Technology                     |
| -------------------- | ------------------------------ |
| **Framework**        | React 19.1.0 + TypeScript      |
| **Build Tool**       | Vite 7.0.4                     |
| **State Management** | Redux Toolkit + Redux Persist  |
| **Styling**          | Tailwind CSS                   |
| **Form Handling**    | React Hook Form + Zod          |
| **Routing**          | React Router DOM               |
| **Development**      | ESLint, TypeScript, Hot Reload |

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication pages
│   │   ├── LoginPage.tsx
│   │   └── SignUpPage.tsx
│   ├── chat/            # Chat-related components
│   │   ├── ChatroomPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── MessageItem.tsx
│   │   └── OptimizedMessageList.tsx
│   ├── routing/         # Route protection components
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── RootRedirect.tsx
│   └── ui/              # Generic UI components
│       ├── LoadingSkeleton.tsx
│       ├── OtpInput.tsx
│       ├── PhoneInput.tsx
│       ├── ThemeToggle.tsx
│       └── ToastContainer.tsx
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts
│   ├── useFocusManagement.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useMessagePagination.ts
│   └── useThrottle.ts
├── redux/               # State management
│   ├── authSlice.ts
│   ├── chatroomsSlice.ts
│   ├── messagesSlice.ts
│   ├── uiSlice.ts
│   └── store.ts
├── utils/               # Utility functions
│   ├── dateUtils.ts
│   ├── idUtils.ts
│   ├── localStorage.ts
│   ├── mockMessageService.ts
│   └── userStorage.ts
├── services/            # API services
│   └── messageService.ts
├── schemas/             # Validation schemas
│   └── authSchemas.ts
├── types/               # TypeScript definitions
│   └── index.ts
└── constants/           # Application constants
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shrikantNemiwal1/ai-chat-app.git
   cd ai-chat-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📱 How to Use

### 1. Authentication

- Enter your phone number with country code
- Click "Send OTP" to receive a simulated verification code
- Enter the 4-digit OTP (any 4 digits work in demo mode)
- Create an account or log in to existing account

### 2. Dashboard

- View all your chatrooms in the sidebar
- Use the search bar to filter chatrooms by title
- Click "New Chat" to create a new chatroom
- Delete chatrooms using the delete button

### 3. Chat Interface

- Select a chatroom to start chatting
- Type messages and press Enter or click Send
- AI responses are simulated with realistic delays
- Scroll up to load older messages (infinite scroll)
- Hover over messages to copy them to clipboard
- Upload images using the attachment button

## 🔧 Key Implementation Details

### Message Throttling & AI Simulation

```typescript
// AI response simulation with realistic delays
const simulateAiResponse = useCallback(
  async (userMessage: string) => {
    setIsTyping(true);

    // Simulate AI thinking time (1-3 seconds)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000));

    const aiResponse = generateAiResponse(userMessage);
    dispatch(addMessage(aiResponse));
    setIsTyping(false);
  },
  [dispatch]
);
```

### Infinite Scroll Implementation

```typescript
// Reverse infinite scroll for chat messages
const { loadOlderMessages, hasMore, isLoading } = useMessagePagination(chatroomId);

const handleScroll = useCallback(
  throttle((e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && hasMore && !isLoading) {
      loadOlderMessages();
    }
  }, 300),
  [hasMore, isLoading, loadOlderMessages]
);
```

### Form Validation with Zod

```typescript
// Phone number validation schema
export const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});
```

### Performance Optimizations

- **React.memo** for preventing unnecessary re-renders
- **useCallback** and **useMemo** for expensive operations
- **Debounced search** for smooth filtering experience
- **Throttled scroll handling** for better performance
- **Lazy loading** for optimal bundle size

## 🎯 Accessibility Features

- **Keyboard Navigation** - Full app navigation using keyboard
- **Focus Management** - Proper focus trapping in modals
- **ARIA Labels** - Comprehensive screen reader support
- **Semantic HTML** - Proper heading hierarchy and landmarks
- **Color Contrast** - WCAG 2.1 compliant color schemes

## 📊 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: ~380KB (gzipped: ~119KB)

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Type checking
npm run type-check

# Build verification
npm run build
```

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📝 Development Notes

### State Management

The application uses **Redux Toolkit** with **Redux Persist** for:

- Authentication state management
- Chat messages and pagination
- UI state (theme, toasts, loading)
- Chatroom management

### Local Storage Usage

- User authentication data (demo purposes only)
- Chat message history
- Theme preferences
- Application state persistence

### Security Considerations

⚠️ **Note**: This application uses simplified authentication for demonstration purposes. In production:

- Use proper backend authentication
- Implement secure password hashing
- Use HTTPS for all communications
- Implement proper session management

## 👨‍💻 Author

**Shrikant Nemiwal**

- GitHub: [@shrikantNemiwal1](https://github.com/shrikantNemiwal1)
- Email: [shrikant.nemiwal1@gmail.com](mailto:shrikant.nemiwal1@gmail.com)
