// src/redux/chatroomsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatroomsState, Chatroom } from '../types';

const initialState: ChatroomsState = {
  list: [
    { id: '1', title: 'General Chat', messages: [] },
    { id: '2', title: 'Support', messages: [] },
    { id: '3', title: 'AI Playground', messages: [] },
  ],
  selectedChatroomId: null,
  searchTerm: '',
};

const chatroomsSlice = createSlice({
  name: 'chatrooms',
  initialState,
  reducers: {
    addChatroom: (state, action: PayloadAction<Chatroom>) => {
      state.list.push(action.payload);
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(room => room.id !== action.payload);
    },
    selectChatroom: (state, action: PayloadAction<string>) => {
      state.selectedChatroomId = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    addMessageToChatroom: (state, action: PayloadAction<{ chatroomId: string; messageId: string }>) => {
      const room = state.list.find(room => room.id === action.payload.chatroomId);
      if (room) {
        room.messages.push(action.payload.messageId);
      }
    },
  },
});

export const { addChatroom, deleteChatroom, selectChatroom, setSearchTerm, addMessageToChatroom } = chatroomsSlice.actions;
export default chatroomsSlice.reducer;