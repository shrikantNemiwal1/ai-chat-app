// src/hooks/useMessagePagination.ts
import { useCallback, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from './useRedux';
import { setInitialMessages, prependMessages } from '../redux/messagesSlice';
import { setLoading, updatePagination, resetPagination as resetPaginationAction, setInitialMessages as setPaginationInitial } from '../redux/messagesPaginationSlice';
import { addToast } from '../redux/uiSlice';
import { MockMessageService } from '../utils/mockMessageService';
import { TOAST_MESSAGES } from '../constants';

export const useMessagePagination = (chatroomId: string | undefined) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.messages);
  const messagesPagination = useAppSelector(state => state.messagesPagination);
  
  const currentMessages = useMemo(() => {
    return chatroomId ? messages[chatroomId] || [] : [];
  }, [chatroomId, messages]);
  
  const pagination = chatroomId ? messagesPagination[chatroomId] : undefined;
  
  const isLoading = pagination?.isLoading || false;
  const hasMore = pagination?.hasMore ?? true;
  const currentPage = pagination?.page || 0;
  const totalMessages = pagination?.totalMessages || 0;

  // Load initial messages for a chatroom
  const loadInitialMessages = useCallback(async () => {
    if (!chatroomId) return;
    
    try {
      dispatch(setLoading({ chatroomId, isLoading: true }));
      
      const result = await MockMessageService.loadInitialMessages(chatroomId);
      
      dispatch(setInitialMessages({ 
        chatroomId, 
        messages: result.messages
      }));
      
      dispatch(setPaginationInitial({
        chatroomId,
        hasMore: result.hasMore,
        totalMessages: result.totalMessages
      }));
      
    } catch (error) {
      console.error('Failed to load initial messages:', error);
      dispatch(addToast({ message: TOAST_MESSAGES.MESSAGES_LOAD_FAILED, type: 'error' }));
    } finally {
      dispatch(setLoading({ chatroomId, isLoading: false }));
    }
  }, [chatroomId, dispatch]);

  // Load older messages (pagination)
  const loadOlderMessages = useCallback(async () => {
    if (!chatroomId || isLoading || !hasMore) {
      return;
    }
    
    try {
      dispatch(setLoading({ chatroomId, isLoading: true }));
      
      const result = await MockMessageService.loadOlderMessages(
        chatroomId, 
        currentMessages.length
      );
      
      if (result.messages.length > 0) {
        dispatch(prependMessages({ 
          chatroomId, 
          messages: result.messages 
        }));
        
        dispatch(updatePagination({
          chatroomId,
          hasMore: result.hasMore,
          page: currentPage + 1,
          totalMessages: result.totalMessages
        }));

        dispatch(addToast({ 
          message: `Loaded ${result.messages.length} older messages`, 
          type: 'info' 
        }));
      }
      
    } catch (error) {
      console.error('Failed to load older messages:', error);
      dispatch(addToast({ message: TOAST_MESSAGES.OLDER_MESSAGES_LOAD_FAILED, type: 'error' }));
    } finally {
      dispatch(setLoading({ chatroomId, isLoading: false }));
    }
  }, [chatroomId, isLoading, hasMore, currentPage, currentMessages.length, dispatch]);

  // Reset pagination when chatroom changes
  const resetPagination = useCallback(() => {
    if (!chatroomId) return;
    
    dispatch(resetPaginationAction({ chatroomId }));
  }, [chatroomId, dispatch]);

  // Initialize pagination state when chatroom changes AND load initial messages if needed
  useEffect(() => {
    if (chatroomId && !pagination) {
      // Check if we already have messages for this chatroom (from persistence)
      const existingMessages = currentMessages || [];
      
      if (existingMessages.length === 0) {
        // No existing messages, load mock messages
        dispatch(setInitialMessages({ 
          chatroomId, 
          messages: [] 
        }));
        
        dispatch(resetPaginationAction({ chatroomId }));
        
        // Load initial mock messages
        loadInitialMessages();
      } else {
        // We have existing messages (from persistence), just initialize pagination
        dispatch(resetPaginationAction({ chatroomId }));
        dispatch(setPaginationInitial({
          chatroomId,
          hasMore: false, // Assume no more messages for persisted data
          totalMessages: existingMessages.length
        }));
      }
    }
  }, [chatroomId, pagination, currentMessages, dispatch, loadInitialMessages]);

  return {
    currentMessages,
    isLoading,
    hasMore,
    loadInitialMessages,
    loadOlderMessages,
    resetPagination,
    pagination: {
      currentPage,
      totalMessages,
      hasMore,
      isLoading
    }
  };
};
