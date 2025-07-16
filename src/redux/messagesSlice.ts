// src/redux/messagesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MessagesState, Message } from '../types';

const initialState: MessagesState = {};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ chatroomId: string; message: Message }>) => {
      const { chatroomId, message } = action.payload;
      if (!state[chatroomId]) {
        state[chatroomId] = [];
      }
      state[chatroomId].push(message);
    },
    setInitialMessages: (state, action: PayloadAction<{ chatroomId: string; messages: Message[] }>) => {
      const { chatroomId, messages } = action.payload;
      state[chatroomId] = messages;
    },
    prependMessages: (state, action: PayloadAction<{ chatroomId: string; messages: Message[] }>) => {
      const { chatroomId, messages } = action.payload;
      if (!state[chatroomId]) {
        state[chatroomId] = [];
      }
      state[chatroomId] = [...messages, ...state[chatroomId]];
    },
    clearMessages: () => {
      return {};
    },
  },
});

export const { addMessage, setInitialMessages, prependMessages, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;