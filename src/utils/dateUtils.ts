// src/utils/dateUtils.ts

/**
 * Date and Time Utilities
 * 
 * This module provides utilities for consistent date and time handling
 * throughout the application, including message timestamps and mock data generation.
 */

/**
 * Formats a date for message timestamps in a user-friendly format
 * 
 * @param date - Date to format (defaults to current time)
 * @returns Formatted time string in HH:MM format (24-hour or 12-hour based on locale)
 * 
 * @example
 * formatMessageTimestamp(new Date()) // "2:34 PM" or "14:34"
 */
export const formatMessageTimestamp = (date: Date = new Date()): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Creates a timestamp string for the current moment
 * 
 * @returns Current time formatted as a message timestamp
 * 
 * @example
 * getCurrentTimestamp() // "3:45 PM"
 */
export const getCurrentTimestamp = (): string => {
  return formatMessageTimestamp();
};

/**
 * Creates a date offset by specified minutes in the past
 * 
 * Useful for generating mock conversation data with realistic timestamps
 * that spread out over time.
 * 
 * @param offsetMinutes - Number of minutes to go back in time
 * @returns Date object representing the offset time
 * 
 * @example
 * createOffsetDate(30) // Date representing 30 minutes ago
 * createOffsetDate(60) // Date representing 1 hour ago
 */
export const createOffsetDate = (offsetMinutes: number): Date => {
  return new Date(Date.now() - offsetMinutes * 60000);
};
