// src/services/messageService.ts
import type { Message } from '../types';

interface MessagePage {
  messages: Message[];
  hasMore: boolean;
  totalMessages: number;
}

export class MessageService {
  private static readonly MESSAGES_PER_PAGE = 20;
  private static readonly STORAGE_KEY = 'geminiCloneState';

  // Get all messages for a chatroom from localStorage
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

  static async loadInitialMessages(chatroomId: string): Promise<MessagePage> {
    // Simulate API delay
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

  static async loadOlderMessages(
    chatroomId: string, 
    _page: number, 
    currentMessageCount: number
  ): Promise<MessagePage> {
    // Simulate API delay
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
