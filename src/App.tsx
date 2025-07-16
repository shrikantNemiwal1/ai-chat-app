// src/App.tsx
import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import DashboardPage from './components/chat/DashboardPage';
import ChatroomPage from './components/chat/ChatroomPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import ToastContainer from './components/ui/ToastContainer';
import { rootReducer, initialRootState } from './redux/store';
import { loadPersistedState, persistState, clearPersistedMessages } from './utils/localStorage';
import { GlobalStateContext, GlobalDispatchContext } from './contexts/GlobalContext';

/**
 * Main application component that manages global state and routing
 * between login, dashboard, and chatroom pages.
 */
const App: React.FC = () => {
  // Initialize state with persisted data or defaults
  const [state, dispatch] = useReducer(rootReducer, loadPersistedState(initialRootState));

  // Clear messages on app start for development (to always use fresh mock data)
  useEffect(() => {
    // Clear all messages to ensure fresh mock data
    dispatch({ type: 'messages/clearMessages' });
  }, []);

  // Persist state to localStorage whenever it changes (exclude messages for development)
  useEffect(() => {
    // For development with mock data, don't persist messages to avoid conflicts
    const stateToPersist = {
      ...state,
      messages: {}, // Don't persist mock messages
      messagesPagination: {} // Don't persist pagination state for mock data
    };
    persistState(stateToPersist);
  }, [state]);

  // Development helper: expose function to clear messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { clearMessages?: () => void }).clearMessages = () => {
        clearPersistedMessages();
        window.location.reload();
      };
    }
  }, []);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        <Router>
          <div className="App">
            <ToastContainer />
            <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <SignUpPage />
                  </PublicRoute>
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/chat/:id" 
                element={
                  <ProtectedRoute>
                    <ChatroomPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect root to appropriate page */}
              <Route 
                path="/" 
                element={<Navigate to={state.auth.isAuthenticated ? "/dashboard" : "/signup"} replace />} 
              />
              
              {/* Catch all route - redirect to root */}
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </Routes>
          </div>
        </Router>
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default App;