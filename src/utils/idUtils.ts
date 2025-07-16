// src/utils/idUtils.ts

/**
 * ID Generation Utilities
 * 
 * This module provides consistent and unique ID generation for various
 * entities in the application. All IDs are designed to be collision-free
 * within the scope of a single user session.
 * 
 * ⚠️ Note: These are not cryptographically secure UUIDs.
 * For production use with server synchronization, consider using UUID v4.
 */

/**
 * Generates a unique ID using current timestamp
 * 
 * Creates a simple unique identifier based on the current time.
 * Suitable for client-side entity creation where collision probability is low.
 * 
 * @returns Timestamp-based unique identifier as string
 * 
 * @example
 * generateId() // "1677123456789"
 */
export const generateId = (): string => {
  return Date.now().toString();
};

/**
 * Generates a unique message ID scoped to a specific chatroom
 * 
 * Creates predictable IDs for mock data generation or unique IDs for new messages.
 * The generated ID includes the chatroom context for easier debugging and data organization.
 * 
 * @param chatroomId - The chatroom this message belongs to
 * @param index - Optional index for predictable ID generation (used in mock data)
 * @returns Unique message identifier
 * 
 * @example
 * generateMessageId("room-1", 5) // "room-1-msg-5"
 * generateMessageId("room-1") // "room-1-1677123456789"
 */
export const generateMessageId = (chatroomId: string, index?: number): string => {
  const suffix = index !== undefined ? `-msg-${index}` : `-${generateId()}`;
  return `${chatroomId}${suffix}`;
};

/**
 * Generates a unique AI message ID with AI-specific prefix
 * 
 * Creates an identifier specifically for AI-generated messages,
 * making it easy to identify and filter AI responses in debugging.
 * 
 * @returns Unique AI message identifier
 * 
 * @example
 * generateAiMessageId() // "1677123456789-ai"
 */
export const generateAiMessageId = (): string => {
  return `${Date.now()}-ai`;
};
