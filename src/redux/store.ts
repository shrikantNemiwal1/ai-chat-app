// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatroomsReducer from './chatroomsSlice';
import messagesReducer from './messagesSlice';
import messagesPaginationReducer from './messagesPaginationSlice';
import uiReducer from './uiSlice';
import { STORAGE_KEYS, PERSIST_CONFIG } from '../constants';

// Persist configuration
const persistConfig = {
  key: STORAGE_KEYS.REDUX_PERSIST_ROOT,
  storage,
  whitelist: PERSIST_CONFIG.WHITELIST,
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  chatrooms: chatroomsReducer,
  messages: messagesReducer,
  messagesPagination: messagesPaginationReducer,
  ui: uiReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: PERSIST_CONFIG.IGNORED_ACTIONS,
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;