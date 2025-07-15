// src/components/ui/ThemeToggle.tsx
import React, { useEffect } from 'react';
import { useGlobalDispatch, useGlobalState } from '../../App';

const ThemeToggle: React.FC = () => {
  const dispatch = useGlobalDispatch();
  const { ui } = useGlobalState();
  const darkMode = ui.darkMode;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
      className="p-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;