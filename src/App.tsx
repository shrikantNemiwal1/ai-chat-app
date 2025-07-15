// src/App.tsx
import React, { useEffect, useReducer, createContext, useContext } from 'react';
import type { Dispatch } from 'react'
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/chat/DashboardPage';
import ChatroomPage from './components/chat/ChatroomPage';
import ToastContainer from './components/ui/ToastContainer';
import { rootReducer, initialRootState } from './redux/store';
import type { RootState, AppActions } from './types';

// Contexts for global state and dispatch
export const GlobalStateContext = createContext<RootState | undefined>(undefined);
export const GlobalDispatchContext = createContext<Dispatch<AppActions> | undefined>(undefined);

// Custom hooks to use the global state and dispatch
export const useGlobalState = (): RootState => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateContext.Provider');
  }
  return context;
};

export const useGlobalDispatch = (): Dispatch<AppActions> => {
  const context = useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalDispatchContext.Provider');
  }
  return context;
};

const App: React.FC = () => {
  // Load initial state from localStorage (simplified redux-persist)
  const loadState = (): RootState => {
    try {
      const serializedState = localStorage.getItem('geminiCloneState');
      if (serializedState === null) {
        return initialRootState;
      }
      return JSON.parse(serializedState) as RootState;
    } catch (e) {
      console.error("Could not load state from localStorage", e);
      return initialRootState;
    }
  };

  const [state, dispatch] = useReducer(rootReducer, loadState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('geminiCloneState', serializedState);
    } catch (e) {
      console.error("Could not save state to localStorage", e);
    }
  }, [state]);

  const { auth, chatrooms } = state;
  const isLoggedIn = auth.isAuthenticated;
  const selectedChatroomId = chatrooms.selectedChatroomId;

  const handleLoginSuccess = (userId: string) => {
    dispatch({ type: 'auth/loginSuccess', payload: { userId } });
  };

  const handleSelectChatroom = (id: string) => {
    dispatch({ type: 'chatrooms/selectChatroom', payload: id });
  };

  const handleBackToDashboard = () => {
    dispatch({ type: 'chatrooms/selectChatroom', payload: null });
  };

  let content;
  if (!isLoggedIn) {
    content = <LoginPage onLoginSuccess={handleLoginSuccess} />;
  } else if (selectedChatroomId) {
    content = <ChatroomPage onBackToDashboard={handleBackToDashboard} />;
  } else {
    content = <DashboardPage onSelectChatroom={handleSelectChatroom} />;
  }

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        <div className="App">
          <ToastContainer />
          {content}
        </div>
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default App;