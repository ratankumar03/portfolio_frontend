import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleNav = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center gap-1.5 px-3 py-1.5 glass rounded-full border border-white/10 hover:border-purple-500/50 transition-all duration-300 group ml-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
    >
      <div className="relative w-10 h-5 bg-gray-700/50 rounded-full">
        <motion.div
          className={`absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-purple-500' : 'bg-yellow-400'
          }`}
          animate={{ left: theme === 'dark' ? '2px' : '22px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {theme === 'dark' ? (
            <FaMoon size={10} className="text-white" />
          ) : (
            <FaSun size={10} className="text-yellow-900" />
          )}
        </motion.div>
      </div>
      <span className="text-xs text-gray-300 group-hover:text-purple-400 transition-colors font-medium">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </motion.button>
  );
};

export default ThemeToggleNav;
