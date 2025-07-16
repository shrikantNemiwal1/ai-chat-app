/**
 * Message Service
 * 
 * Provides message loading functionality from localStorage with pagination support.
 * This service simulates API behavior for loading messages in a chat application.
 * 
 * @module messageService
 */

import type { Message } from '../types';

/** Response structure for paginated message loading */
interface MessagePage {
  /** Array of message objects for the current page */
  messages: Message[];
  /** Whether more messages are available to load */
  hasMore: boolean;
  /** Total number of messages in the chatroom */
  totalMessages: number;
}

/**
 * Message Service Class
 * 
 * Handles loading and pagination of messages from localStorage.
 * Simulates realistic API behavior with delays and proper pagination.
 */

export class MessageService {
  /** Number of messages to load per pagination request */
  private static readonly MESSAGES_PER_PAGE = 20;
  /** LocalStorage key for accessing persisted application state */
  private static readonly STORAGE_KEY = 'geminiCloneState';

  /**
   * Retrieves all messages for a specific chatroom from localStorage
   * 
   * @param chatroomId - Unique identifier for the chatroom
   * @returns Array of messages for the chatroom, empty array if none found
   * @private
   */
  private static getAllMessagesFromStorage(chatroomId: string): Message[] {
    try {
      const serializedState = localStorage.getItem(this.STORAGE_KEY);
      if (!serializedState) return [];
      
      const state = JSON.parse(serializedState);
      return state.messages?.[chatroomId] || [];
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
      return [];
    }
  }

  /**
   * Loads the initial (most recent) messages for a chatroom
   * 
   * Simulates API behavior by adding a delay and returning the most recent
   * messages with pagination metadata. This is typically called when first
   * entering a chatroom.
   * 
   * @param chatroomId - Unique identifier for the chatroom
   * @returns Promise resolving to message page with recent messages
   * @example
   * ```typescript
   * const { messages, hasMore } = await MessageService.loadInitialMessages('room-123');
   * ```
   */
  static async loadInitialMessages(chatroomId: string): Promise<MessagePage> {
    // Simulate realistic API response delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allMessages = this.getAllMessagesFromStorage(chatroomId);
    const totalMessages = allMessages.length;
    
    console.log(`Loading initial messages for ${chatroomId}:`, {
      totalMessages,
      allMessages: allMessages.length
    });
    
    // Get the last 20 messages (most recent)
    const recentMessages = allMessages.slice(-this.MESSAGES_PER_PAGE);
    
    const result = {
      messages: recentMessages,
      hasMore: totalMessages > this.MESSAGES_PER_PAGE,
      totalMessages,
    };
    
    console.log('Initial messages result:', result);
    return result;
  }

  /**
   * Loads older (previous) messages for a chatroom with pagination
   * 
   * Retrieves messages that occurred before the currently loaded messages.
   * Used for implementing "load more" functionality when scrolling up.
   * 
   * @param chatroomId - Unique identifier for the chatroom
   * @param _page - Page number (currently unused, kept for API compatibility)
   * @param currentMessageCount - Number of messages already loaded in UI
   * @returns Promise resolving to message page with older messages
   * @example
   * ```typescript
   * const { messages, hasMore } = await MessageService.loadOlderMessages('room-123', 1, 20);
   * ```
   */

  static async loadOlderMessages(
    chatroomId: string, 
    _page: number, 
    currentMessageCount: number
  ): Promise<MessagePage> {
    // Simulate realistic API delay for older message loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allMessages = this.getAllMessagesFromStorage(chatroomId);
    
    console.log(`Loading older messages for ${chatroomId}:`, {
      totalMessages: allMessages.length,
      currentMessageCount,
      messagesPerPage: this.MESSAGES_PER_PAGE
    });
    
    // Calculate how many messages to skip
    const messagesToSkip = allMessages.length - currentMessageCount - this.MESSAGES_PER_PAGE;
    const startIndex = Math.max(0, messagesToSkip);
    const endIndex = Math.max(0, allMessages.length - currentMessageCount);
    
    // Get the previous batch of messages
    const olderMessages = allMessages.slice(startIndex, endIndex);
    
    const newTotal = allMessages.length;
    const hasMore = startIndex > 0;
    
    const result = {
      messages: olderMessages,
      hasMore,
      totalMessages: newTotal,
    };
    
    console.log('Older messages result:', {
      ...result,
      startIndex,
      endIndex,
      olderMessagesCount: olderMessages.length
    });
    
    return result;
  }
}
