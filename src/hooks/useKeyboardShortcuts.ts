// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts, enabled: boolean = true): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Build the key combination string
      const keys: string[] = [];
      
      if (event.ctrlKey || event.metaKey) keys.push('ctrl');
      if (event.shiftKey) keys.push('shift');
      if (event.altKey) keys.push('alt');
      
      keys.push(event.key.toLowerCase());
      
      const keyCombo = keys.join('+');
      
      // Execute the callback if the combination matches
      if (shortcuts[keyCombo]) {
        event.preventDefault();
        shortcuts[keyCombo]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
};

export default useKeyboardShortcuts;
