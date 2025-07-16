// src/utils/userStorage.ts

/**
 * User Storage Utilities
 * 
 * This module provides utilities for managing user data in localStorage.
 * It handles user authentication, password hashing, and data persistence.
 * 
 */

import type { User } from '../types';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../constants';

/**
 * Simple hash function for demo purposes only
 * 
 * @param password - Plain text password to hash
 * @returns Hashed password as string
 */
const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

/**
 * Retrieves all users from localStorage
 * 
 * @returns Array of User objects, empty array if none found or on error
 */
export const getUsersFromStorage = (): User[] => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error(ERROR_MESSAGES.LOCALSTORAGE_ERROR, error);
    return [];
  }
};

/**
 * Saves a new user to localStorage after validation
 * 
 * @param user - User data without id and createdAt (auto-generated)
 * @returns Complete User object with generated fields
 * @throws Error if user already exists
 */
export const saveUserToStorage = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsersFromStorage();
  const fullPhone = user.phone;
  
  // Check if user already exists
  const existingUser = users.find(u => u.phone === fullPhone);
  if (existingUser) {
    throw new Error(ERROR_MESSAGES.USER_EXISTS);
  }

  // Create new user with hashed password and metadata
  const newUser: User = {
    id: fullPhone, // Using phone as unique identifier
    phone: fullPhone,
    password: simpleHash(user.password), // Hash the password
    createdAt: new Date().toISOString()
  };

  // Save to localStorage
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  return newUser;
};

/**
 * Authenticates a user with phone and password
 * 
 * @param phone - User's phone number
 * @param password - Plain text password
 * @returns User object if authentication successful, null otherwise
 */
export const authenticateUser = (phone: string, password: string): User | null => {
  const users = getUsersFromStorage();
  const hashedPassword = simpleHash(password);
  
  // Find user with matching phone and password
  const user = users.find(u => u.phone === phone && u.password === hashedPassword);
  
  return user || null;
};

export const userExists = (phone: string): boolean => {
  const users = getUsersFromStorage();
  return users.some(u => u.phone === phone);
};
