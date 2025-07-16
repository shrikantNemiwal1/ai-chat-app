// src/utils/userStorage.ts
import type { User } from '../types';

const USERS_STORAGE_KEY = 'ai_chat_users';

// Simple hash function for demo purposes (in production, use proper hashing)
const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const getUsersFromStorage = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

export const saveUserToStorage = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsersFromStorage();
  const fullPhone = user.phone;
  
  // Check if user already exists
  const existingUser = users.find(u => u.phone === fullPhone);
  if (existingUser) {
    throw new Error('User with this phone number already exists');
  }

  const newUser: User = {
    id: fullPhone,
    phone: fullPhone,
    password: simpleHash(user.password), // Hash the password
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return newUser;
};

export const authenticateUser = (phone: string, password: string): User | null => {
  const users = getUsersFromStorage();
  const user = users.find(u => u.phone === phone && u.password === simpleHash(password));
  return user || null;
};

export const userExists = (phone: string): boolean => {
  const users = getUsersFromStorage();
  return users.some(u => u.phone === phone);
};
