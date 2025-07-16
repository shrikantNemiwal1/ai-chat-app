// src/utils/mockMessageService.ts
import type { Message } from '../types';

export class MockMessageService {
  private static readonly MESSAGES_PER_PAGE = 20;
  
  // Generate mock messages for a chatroom
  private static generateMockMessages(chatroomId: string, totalCount: number): Message[] {
    const messages: Message[] = [];
    
    const sampleMessages = [
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
    ];
    
    for (let i = 0; i < totalCount; i++) {
      const isUser = i % 2 === 0;
      const messageIndex = i % sampleMessages.length;
      const timestamp = new Date(Date.now() - (totalCount - i) * 60000); // Messages every minute going back
      
      messages.push({
        id: `${chatroomId}-msg-${i}`,
        sender: isUser ? 'user' : 'ai',
        content: sampleMessages[messageIndex] || 'Sample message',
        timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      });
    }
    
    return messages;
  }

  // Simulate loading initial messages (most recent)
  static async loadInitialMessages(chatroomId: string): Promise<{
    messages: Message[];
    hasMore: boolean;
    totalMessages: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate a total of 200 messages for this chatroom
    const totalMessages = 200;
    const allMessages = this.generateMockMessages(chatroomId, totalMessages);
    
    // Return the most recent 20 messages
    const recentMessages = allMessages.slice(-this.MESSAGES_PER_PAGE);
    
    return {
      messages: recentMessages,
      hasMore: totalMessages > this.MESSAGES_PER_PAGE,
      totalMessages
    };
  }

  // Simulate loading older messages
  static async loadOlderMessages(
    chatroomId: string,
    currentLoadedCount: number
  ): Promise<{
    messages: Message[];
    hasMore: boolean;
    totalMessages: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const totalMessages = 200;
    const allMessages = this.generateMockMessages(chatroomId, totalMessages);
    
    // Calculate which messages to return
    const remainingMessages = totalMessages - currentLoadedCount;
    const messagesToLoad = Math.min(this.MESSAGES_PER_PAGE, remainingMessages);
    
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
