// src/hooks/useFocusManagement.ts

/**
 * Focus Management Hook
 * 
 * This hook provides comprehensive focus management for accessible web applications.
 * It implements focus trapping, focus restoration, and automatic focus handling
 * for modals, dialogs, and other complex UI components.
 * 
 * Features:
 * - Focus trapping to keep focus within a container
 * - Focus restoration when component unmounts
 * - Automatic focus on first focusable element
 * - Keyboard navigation with Tab/Shift+Tab
 * - Escape key handling for modals
 * 
 * @example
 * // Basic usage for a modal
 * const { containerRef } = useFocusManagement(isModalOpen, {
 *   trapFocus: true,
 *   restoreFocus: true,
 *   autoFocus: true
 * });
 */

import { useEffect, useRef, useCallback } from 'react';

/** Configuration options for focus management */
interface UseFocusManagementOptions {
  /** Whether to trap focus within the container */
  trapFocus?: boolean;
  /** Whether to restore focus when component becomes inactive */
  restoreFocus?: boolean;
  /** Whether to automatically focus the first focusable element */
  autoFocus?: boolean;
}

/**
 * Hook for managing focus behavior in accessible components
 * 
 * @param isActive - Whether the component is currently active/visible
 * @param options - Configuration options for focus behavior
 * @returns Object containing the container ref to attach to the focusable container
 */
export const useFocusManagement = (
  isActive: boolean,
  options: UseFocusManagementOptions = {}
) => {
  const { trapFocus = false, restoreFocus = true, autoFocus = true } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element when the component becomes active
  useEffect(() => {
    if (isActive) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);

  // Focus the first focusable element when the component becomes active
  useEffect(() => {
    if (isActive && autoFocus && containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0]?.focus();
      }
    }
  }, [isActive, autoFocus]);

  // Restore focus when the component becomes inactive
  useEffect(() => {
    return () => {
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [restoreFocus]);

  // Handle focus trapping
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!trapFocus || !isActive || !containerRef.current) return;

      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements(containerRef.current);
        
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (event.key === 'Escape' && isActive) {
        // Allow escape to close modals/dialogs
        const escapeEvent = new CustomEvent('modal:escape');
        containerRef.current?.dispatchEvent(escapeEvent);
      }
    },
    [trapFocus, isActive]
  );

  // Add/remove event listeners for focus trapping
  useEffect(() => {
    if (trapFocus && isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, [trapFocus, isActive, handleKeyDown]);

  return { containerRef };
};

// Helper function to get all focusable elements
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
};

export default useFocusManagement;
