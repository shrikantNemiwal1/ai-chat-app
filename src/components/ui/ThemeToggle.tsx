// src/components/ui/ThemeToggle.tsx
import React, { useEffect } from 'react';
import { useGlobalDispatch, useGlobalState } from '../../hooks/useGlobalContext';

const ThemeToggle: React.FC = () => {
  const dispatch = useGlobalDispatch();
  const { ui } = useGlobalState();
  const darkMode = ui.darkMode;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light_mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light_mode');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      dispatch({ type: 'ui/toggleDarkMode' });
    }
  }, [dispatch]);

  return (
    <button
      onClick={() => dispatch({ type: 'ui/toggleDarkMode' })}
      className="w-10 h-10 flex-shrink-0 cursor-pointer rounded-full flex items-center justify-center bg-[var(--secondary-hover-color)] hover:bg-[var(--primary-color)] transition-colors duration-200 focus:outline-none"
      aria-label="Toggle dark mode"
      id="theme-toggle-button"
    >
      <span className="icon material-symbols-rounded text-[var(--text-color)]">
        {darkMode ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;