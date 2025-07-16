// src/hooks/useMessagePagination.ts
import { useCallback, useEffect } from 'react';
import { useGlobalDispatch, useGlobalState } from './useGlobalContext';
import { MockMessageService } from '../utils/mockMessageService';

export const useMessagePagination = (chatroomId: string | undefined) => {
  const dispatch = useGlobalDispatch();
  const { messages, messagesPagination } = useGlobalState();
  
  const currentMessages = chatroomId ? messages[chatroomId] || [] : [];
  const pagination = chatroomId ? messagesPagination[chatroomId] : undefined;
  
  const isLoading = pagination?.isLoading || false;
  const hasMore = pagination?.hasMore ?? true;
  const currentPage = pagination?.page || 0;
  const totalMessages = pagination?.totalMessages || 0;

  // Load initial messages for a chatroom
  const loadInitialMessages = useCallback(async () => {
    if (!chatroomId) return;
    
    try {
      dispatch({ type: 'messagesPagination/setLoading', payload: { chatroomId, isLoading: true } });
      
      const result = await MockMessageService.loadInitialMessages(chatroomId);
      
      dispatch({ 
        type: 'messages/setInitialMessages', 
        payload: { 
          chatroomId, 
          messages: result.messages,
          hasMore: result.hasMore,
          totalMessages: result.totalMessages
        } 
      });
      
    } catch (error) {
      console.error('Failed to load initial messages:', error);
      dispatch({ 
        type: 'ui/addToast', 
        payload: { message: 'Failed to load messages', type: 'error' } 
      });
    } finally {
      dispatch({ type: 'messagesPagination/setLoading', payload: { chatroomId, isLoading: false } });
    }
  }, [chatroomId, dispatch]);

  // Load older messages (pagination)
  const loadOlderMessages = useCallback(async () => {
    if (!chatroomId || isLoading || !hasMore) {
      return;
    }
    
    try {
      dispatch({ type: 'messagesPagination/setLoading', payload: { chatroomId, isLoading: true } });
      
      const result = await MockMessageService.loadOlderMessages(
        chatroomId, 
        currentMessages.length
      );
      
      if (result.messages.length > 0) {
        dispatch({ 
          type: 'messages/prependMessages', 
          payload: { chatroomId, messages: result.messages } 
        });
        
        dispatch({
          type: 'messagesPagination/updatePagination',
          payload: {
            chatroomId,
            hasMore: result.hasMore,
            page: currentPage + 1,
            totalMessages: result.totalMessages
          }
        });

        dispatch({ 
          type: 'ui/addToast', 
          payload: { 
            message: `Loaded ${result.messages.length} older messages`, 
            type: 'info' 
          } 
        });
      }
      
    } catch (error) {
      console.error('Failed to load older messages:', error);
      dispatch({ 
        type: 'ui/addToast', 
        payload: { message: 'Failed to load older messages', type: 'error' } 
      });
    } finally {
      dispatch({ type: 'messagesPagination/setLoading', payload: { chatroomId, isLoading: false } });
    }
  }, [chatroomId, isLoading, hasMore, currentPage, currentMessages.length, dispatch]);

  // Reset pagination when chatroom changes
  const resetPagination = useCallback(() => {
    if (!chatroomId) return;
    
    dispatch({ 
      type: 'messagesPagination/resetPagination', 
      payload: { chatroomId } 
    });
  }, [chatroomId, dispatch]);

  // Initialize pagination state when chatroom changes AND load initial messages
  useEffect(() => {
    if (chatroomId && !pagination) {
      // Clear any existing messages for this chatroom first
      dispatch({ 
        type: 'messages/setInitialMessages', 
        payload: { chatroomId, messages: [], hasMore: true, totalMessages: 0 } 
      });
      
      dispatch({ 
        type: 'messagesPagination/resetPagination', 
        payload: { chatroomId } 
      });
      
      // Load initial mock messages
      loadInitialMessages();
    }
  }, [chatroomId, pagination, dispatch, loadInitialMessages]);

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
