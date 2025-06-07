import React, { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '../constants';

const ThemeToggleButton: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    }
    return 'light'; // Default theme
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[60] p-2.5 sm:p-3 rounded-full bg-light-bg-card dark:bg-dark-card shadow-lg 
                 text-brand-orange dark:text-orange-400 
                 hover:bg-gray-100 dark:hover:bg-gray-700 
                 border border-light-border dark:border-dark-border
                 transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-orange"
    >
      {theme === 'light' ? (
        <IconMoon className="w-5 h-5 sm:w-6 sm:h-6" />
      ) : (
        <IconSun className="w-5 h-5 sm:w-6 sm:h-6" />
      )}
    </button>
  );
};

export default ThemeToggleButton;