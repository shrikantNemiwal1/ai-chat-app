// src/redux/messagesPaginationSlice.ts
import type { MessagesPaginationState, MessagesActions } from '../types';

const messagesPaginationReducer = (state: MessagesPaginationState, action: MessagesActions): MessagesPaginationState => {
  switch (action.type) {
    case 'messagesPagination/setLoading': {
      const { chatroomId, isLoading } = action.payload;
      const existing = state[chatroomId] || { hasMore: true, page: 0, totalMessages: 0, isLoading: false };
      return {
        ...state,
        [chatroomId]: {
          ...existing,
          isLoading,
        },
      };
    }
    case 'messagesPagination/updatePagination': {
      const { chatroomId, hasMore, page, totalMessages } = action.payload;
      const existing = state[chatroomId] || { hasMore: true, page: 0, totalMessages: 0, isLoading: false };
      return {
        ...state,
        [chatroomId]: {
          ...existing,
          hasMore,
          page,
          totalMessages,
          isLoading: false,
        },
      };
    }
    case 'messagesPagination/resetPagination': {
      const { chatroomId } = action.payload;
      return {
        ...state,
        [chatroomId]: {
          hasMore: true,
          isLoading: false,
          page: 0,
          totalMessages: 0,
        },
      };
    }
    case 'messages/setInitialMessages': {
      const { chatroomId, hasMore, totalMessages } = action.payload;
      return {
        ...state,
        [chatroomId]: {
          hasMore,
          isLoading: false,
          page: 1,
          totalMessages,
        },
      };
    }
    default:
      return state;
  }
};

export default messagesPaginationReducer;
