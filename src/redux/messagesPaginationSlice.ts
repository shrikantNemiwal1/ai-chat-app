// src/redux/messagesPaginationSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MessagesPaginationState } from '../types';

const initialState: MessagesPaginationState = {};

const messagesPaginationSlice = createSlice({
  name: 'messagesPagination',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ chatroomId: string; isLoading: boolean }>) => {
      const { chatroomId, isLoading } = action.payload;
      if (!state[chatroomId]) {
        state[chatroomId] = { hasMore: true, page: 0, totalMessages: 0, isLoading: false };
      }
      state[chatroomId].isLoading = isLoading;
    },
    updatePagination: (state, action: PayloadAction<{ chatroomId: string; hasMore: boolean; page: number; totalMessages: number }>) => {
      const { chatroomId, hasMore, page, totalMessages } = action.payload;
      if (!state[chatroomId]) {
        state[chatroomId] = { hasMore: true, page: 0, totalMessages: 0, isLoading: false };
      }
      state[chatroomId].hasMore = hasMore;
      state[chatroomId].page = page;
      state[chatroomId].totalMessages = totalMessages;
      state[chatroomId].isLoading = false;
    },
    resetPagination: (state, action: PayloadAction<{ chatroomId: string }>) => {
      const { chatroomId } = action.payload;
      state[chatroomId] = {
        hasMore: true,
        isLoading: false,
        page: 0,
        totalMessages: 0,
      };
    },
    setInitialMessages: (state, action: PayloadAction<{ chatroomId: string; hasMore: boolean; totalMessages: number }>) => {
      const { chatroomId, hasMore, totalMessages } = action.payload;
      state[chatroomId] = {
        hasMore,
        isLoading: false,
        page: 1,
        totalMessages,
      };
    },
  },
});

export const { setLoading, updatePagination, resetPagination, setInitialMessages } = messagesPaginationSlice.actions;
export default messagesPaginationSlice.reducer;
