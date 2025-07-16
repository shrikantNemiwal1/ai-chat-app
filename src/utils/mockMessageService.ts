// src/utils/mockMessageService.ts

/**
 * Mock Message Service
 * 
 * This service simulates API calls for message loading and pagination.
 * It generates realistic conversation data for testing and development.
 * 
 * Features:
 * - Realistic message generation with timestamps
 * - Pagination support for large conversation histories
 * - Simulated API delays for testing loading states
 * - Alternating user/AI messages for conversation flow
 */

import type { Message } from '../types';
import { MESSAGE_CONSTANTS } from '../constants';
import { formatMessageTimestamp, createOffsetDate } from './dateUtils';
import { generateMessageId } from './idUtils';

/**
 * Mock Message Service Class
 * 
 * Provides static methods for simulating message loading operations
 * with realistic delays and pagination behavior.
 */
export class MockMessageService {
  /** Number of messages to load per page */
  private static readonly MESSAGES_PER_PAGE = MESSAGE_CONSTANTS.MESSAGES_PER_PAGE;
  
  /**
   * Sample conversation messages for realistic chat simulation
   * 
   * This array contains a diverse set of conversation topics including:
   * - Technical discussions about React development
   * - Questions about best practices and performance
   * - Accessibility and testing topics
   * - Error handling and user experience considerations
   */
  private static readonly SAMPLE_MESSAGES = [
    "Hello! How can I help you today?",
    "I'm working on a React project and need some guidance.",
    "That's great! What specific aspect would you like help with?",
    "I'm trying to implement infinite scroll pagination.",
    "Infinite scroll is a great feature! Let me help you with that.",
    "What's the best approach for handling state management?",
    "For React, you have several options like useState, useReducer, or external libraries.",
    "Could you explain the difference between them?",
    "Certainly! useState is perfect for simple state, useReducer for complex state logic.",
    "What about performance considerations?",
    "Great question! Performance depends on how often your state updates.",
    "Can you show me an example?",
    "Of course! Let me provide you with a practical example.",
    "This is really helpful, thank you!",
    "You're welcome! Do you have any other questions?",
    "Actually, yes. How do I handle API errors gracefully?",
    "Error handling is crucial. You should use try-catch blocks and user feedback.",
    "What about loading states?",
    "Loading states improve user experience significantly.",
    "Should I use skeletons or spinners?",
    "Skeletons are generally better for content-heavy interfaces.",
    "That makes sense. What about accessibility?",
    "Accessibility should be built in from the start, not added later.",
    "Any specific ARIA attributes I should know?",
    "aria-label, aria-describedby, and role are the most commonly used.",
    "How do I test these features?",
    "Testing can be done with Jest, React Testing Library, and Cypress.",
    "What's the difference between unit and integration tests?",
    "Unit tests focus on individual components, integration tests on component interaction.",
    "This conversation has been very educational!",
    "I'm glad I could help! Feel free to ask more questions anytime."
  ] as const;
  
  /**
   * Generates mock messages for a specific chatroom
   * 
   * Creates a realistic conversation with alternating user/AI messages,
   * proper timestamps, and diverse content from the sample messages pool.
   * 
   * @param chatroomId - Unique identifier for the chatroom
   * @param totalCount - Total number of messages to generate
   * @returns Array of Message objects with realistic conversation data
   */
  private static generateMockMessages(chatroomId: string, totalCount: number): Message[] {
    const messages: Message[] = [];
    
    for (let i = 0; i < totalCount; i++) {
      const isUser = i % 2 === 0; // Alternate between user and AI
      const messageIndex = i % this.SAMPLE_MESSAGES.length;
      const timestamp = createOffsetDate((totalCount - i)); // Messages every minute going back
      
      messages.push({
        id: generateMessageId(chatroomId, i),
        sender: isUser ? 'user' : 'ai',
        content: this.SAMPLE_MESSAGES[messageIndex] || 'Sample message',
        timestamp: formatMessageTimestamp(timestamp),
        type: 'text'
      });
    }
    
    return messages;
  }

  /**
   * Simulates loading initial messages for a chatroom
   * 
   * Loads the most recent messages (last page) for a chatroom,
   * simulating API behavior with realistic delays and pagination metadata.
   * 
   * @param chatroomId - Unique identifier for the chatroom
   * @returns Promise resolving to initial messages with pagination info
   */
  static async loadInitialMessages(chatroomId: string): Promise<{
    messages: Message[];
    hasMore: boolean;
    totalMessages: number;
  }> {
    // Simulate realistic API response delay
    await new Promise(resolve => setTimeout(resolve, MESSAGE_CONSTANTS.AI_RESPONSE_DELAY));
    
    // Generate complete message history for this chatroom
    const totalMessages = MESSAGE_CONSTANTS.TOTAL_MOCK_MESSAGES;
    const allMessages = this.generateMockMessages(chatroomId, totalMessages);
    
    // Return the most recent messages (end of conversation)
    const recentMessages = allMessages.slice(-this.MESSAGES_PER_PAGE);
    
    return {
      messages: recentMessages,
      hasMore: totalMessages > this.MESSAGES_PER_PAGE,
      totalMessages
    };
  }

  /**
   * Simulates loading older messages for pagination
   * 
   * Loads previous messages in the conversation history, implementing
   * reverse chronological pagination (older messages loaded on scroll up).
   * 
   * @param chatroomId - Unique identifier for the chatroom
   * @param currentLoadedCount - Number of messages already loaded
   * @returns Promise resolving to older messages with pagination info
   */
  static async loadOlderMessages(
    chatroomId: string,
    currentLoadedCount: number
  ): Promise<{
    messages: Message[];
    hasMore: boolean;
    totalMessages: number;
  }> {
    // Simulate network delay for loading older messages
    await new Promise(resolve => setTimeout(resolve, MESSAGE_CONSTANTS.OLDER_MESSAGES_DELAY));
    
    const totalMessages = MESSAGE_CONSTANTS.TOTAL_MOCK_MESSAGES;
    const allMessages = this.generateMockMessages(chatroomId, totalMessages);
    
    // Calculate pagination boundaries
    const remainingMessages = totalMessages - currentLoadedCount;
    const messagesToLoad = Math.min(this.MESSAGES_PER_PAGE, remainingMessages);
    
    // Return empty result if no more messages available
    if (messagesToLoad <= 0) {
      return {
        messages: [],
        hasMore: false,
        totalMessages
      };
    }
    
    // Get the previous batch of messages
    const startIndex = totalMessages - currentLoadedCount - messagesToLoad;
    const endIndex = totalMessages - currentLoadedCount;
    const olderMessages = allMessages.slice(startIndex, endIndex);
    
    return {
      messages: olderMessages,
      hasMore: startIndex > 0,
      totalMessages
    };
  }
}
