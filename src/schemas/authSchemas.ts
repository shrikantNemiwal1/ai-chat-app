/**
 * Authentication Validation Schemas
 * 
 * This module contains Zod validation schemas for user authentication forms.
 * It provides type-safe validation for phone numbers, passwords, and OTP inputs
 * with comprehensive error messages and security requirements.
 * 
 * @module authSchemas
 */

import { z } from 'zod';

/**
 * Password validation schema with security requirements
 * 
 * Enforces strong password policies including:
 * - Minimum 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter  
 * - At least one number
 * - At least one special character
 */
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

/**
 * Phone number validation schema for international phone numbers
 * 
 * Validates phone number input with country code support.
 * Ensures proper format and length constraints.
 */
export const phoneSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
});

/**
 * User registration validation schema
 * 
 * Validates new user signup with phone number, password, and confirmation.
 * Includes password matching validation to ensure both password fields match.
 */
export const signUpSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * User login validation schema
 * 
 * Validates user authentication with phone number and password.
 * Used for validating login form inputs before submission.
 */
export const loginSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  password: passwordSchema
});

/**
 * OTP (One-Time Password) validation schema
 * 
 * Validates 4-digit numeric OTP codes for phone number verification.
 * Ensures exact length and numeric-only input.
 */
export const otpSchema = z.object({
  otp: z.string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only numbers")
});

/**
 * TypeScript type definitions inferred from validation schemas
 * 
 * These types provide compile-time type safety for form data
 * and ensure consistency between validation rules and TypeScript types.
 */
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
