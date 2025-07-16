// src/components/ui/ThemeToggle.tsx
import React, { useEffect, memo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { toggleDarkMode } from '../../redux/uiSlice';
import { ARIA_LABELS } from '../../constants';

const ThemeToggle: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(state => state.ui.darkMode);

  // Apply theme classes whenever darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light_mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light_mode');
    }
  }, [darkMode]);

  const handleToggle = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 flex-shrink-0 cursor-pointer rounded-full flex items-center justify-center bg-[var(--secondary-hover-color)] hover:bg-[var(--primary-color)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={ARIA_LABELS.TOGGLE_THEME}
      aria-pressed={darkMode}
      type="button"
      id="theme-toggle-button"
    >
      <span 
        className="icon material-symbols-rounded text-[var(--text-color)]"
        aria-hidden="true"
      >
        {darkMode ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;