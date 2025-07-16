// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import DashboardPage from './components/chat/DashboardPage';
import ChatroomPage from './components/chat/ChatroomPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import RootRedirect from './components/routing/RootRedirect';
import ToastContainer from './components/ui/ToastContainer';
import { store, persistor } from './redux/store';

/**
 * Main application component that manages global state and routing
 * between login, dashboard, and chatroom pages.
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
                element={<RootRedirect />} 
              />
              
              {/* Catch all route - redirect to root */}
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;