import React, { useState, useRef, useCallback, createContext, useContext, useEffect } from 'react';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

// Local Storage Helper
const StorageHelper = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  }
};

// Theme Context
const ThemeContext = createContext();

// Color Palettes
const colorPalettes = {
  purple: {
    name: 'Purple',
    primary: 'purple',
    secondary: 'blue',
    accent: 'cyan',
    gradients: {
      main: 'from-purple-500 via-blue-500 to-cyan-500',
      card: 'from-purple-600 to-blue-600',
      background: 'from-slate-900 via-purple-900 to-slate-900',
      backgroundLight: 'from-purple-50 via-blue-50 to-cyan-50'
    }
  },
  green: {
    name: 'Green',
    primary: 'emerald',
    secondary: 'teal',
    accent: 'green',
    gradients: {
      main: 'from-emerald-500 via-teal-500 to-green-500',
      card: 'from-emerald-600 to-teal-600',
      background: 'from-slate-900 via-emerald-900 to-slate-900',
      backgroundLight: 'from-emerald-50 via-teal-50 to-green-50'
    }
  },
  orange: {
    name: 'Orange',
    primary: 'orange',
    secondary: 'amber',
    accent: 'yellow',
    gradients: {
      main: 'from-orange-500 via-amber-500 to-yellow-500',
      card: 'from-orange-600 to-amber-600',
      background: 'from-slate-900 via-orange-900 to-slate-900',
      backgroundLight: 'from-orange-50 via-amber-50 to-yellow-50'
    }
  },
  pink: {
    name: 'Pink',
    primary: 'pink',
    secondary: 'rose',
    accent: 'red',
    gradients: {
      main: 'from-pink-500 via-rose-500 to-red-500',
      card: 'from-pink-600 to-rose-600',
      background: 'from-slate-900 via-pink-900 to-slate-900',
      backgroundLight: 'from-pink-50 via-rose-50 to-red-50'
    }
  },
  indigo: {
    name: 'Indigo',
    primary: 'indigo',
    secondary: 'violet',
    accent: 'purple',
    gradients: {
      main: 'from-indigo-500 via-violet-500 to-purple-500',
      card: 'from-indigo-600 to-violet-600',
      background: 'from-slate-900 via-indigo-900 to-slate-900',
      backgroundLight: 'from-indigo-50 via-violet-50 to-purple-50'
    }
  }
};

// Theme Provider
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() =>
    StorageHelper.getItem('peeksta_theme', true)
  );
  const [currentPalette, setCurrentPalette] = useState(() =>
    StorageHelper.getItem('peeksta_palette', 'purple')
  );
  const [showSettings, setShowSettings] = useState(false);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    StorageHelper.setItem('peeksta_theme', isDark);
  }, [isDark]);

  useEffect(() => {
    StorageHelper.setItem('peeksta_palette', currentPalette);
  }, [currentPalette]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    toast.success(`Switched to ${!isDark ? 'Dark' : 'Light'} mode`, {
      duration: 2000,
    });
  }, [isDark]);

  const changePalette = useCallback((palette) => {
    setCurrentPalette(palette);
    toast.success(`Changed to ${colorPalettes[palette].name} theme`, {
      duration: 2000,
    });
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const palette = colorPalettes[currentPalette];

  const contextValue = {
    isDark,
    toggleTheme,
    currentPalette,
    changePalette,
    palette,
    showSettings,
    toggleSettings
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom Hook for Drag and Drop
function useDragAndDrop(rootRef, onFileDrop) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.types && event.dataTransfer.types.includes('Files')) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.target === rootRef.current) {
      setIsDragActive(false);
    }
  }, [rootRef]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileDrop(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [onFileDrop]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }, [rootRef, handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

  return { isDragActive };
}

// Settings Panel Component
const SettingsPanel = () => {
  const { isDark, toggleTheme, currentPalette, changePalette, showSettings, toggleSettings } = useTheme();

  if (!showSettings) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={toggleSettings}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden
            ${isDark 
              ? 'bg-slate-900/95 border-slate-700' 
              : 'bg-white/95 border-gray-200'
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-xl
                  ${isDark ? 'bg-slate-800' : 'bg-gray-100'}
                `}>
                  <Cog6ToothIcon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Settings
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSettings}
                className={`
                  p-2 rounded-xl transition-colors duration-200
                  ${isDark 
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                  }
                `}
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Theme Toggle */}
            <div>
              <label className={`block text-sm font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Appearance
              </label>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleTheme}
                className={`
                  flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-200
                  ${isDark 
                    ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? (
                      <MoonIcon className="w-5 h-5 text-slate-400" />
                    ) : (
                      <SunIcon className="w-5 h-5 text-amber-500" />
                    )}
                  </motion.div>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <div className={`
                  relative w-12 h-6 rounded-full transition-colors duration-300
                  ${isDark ? 'bg-blue-600' : 'bg-gray-300'}
                `}>
                  <motion.div
                    layout
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                    animate={{ x: isDark ? 26 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </motion.button>
            </div>

            {/* Color Palette */}
            <div>
              <label className={`block text-sm font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Color Theme
              </label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(colorPalettes).map(([key, palette]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => changePalette(key)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all duration-200 group
                      ${currentPalette === key
                        ? `border-${palette.primary}-500 ${isDark ? 'bg-slate-800' : 'bg-gray-50'} shadow-lg`
                        : `border-transparent ${isDark ? 'hover:bg-slate-800 hover:border-slate-600' : 'hover:bg-gray-50 hover:border-gray-200'}`
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${palette.gradients.main} shadow-lg`} />
                        <div>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {palette.name}
                          </span>
                          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            {palette.primary} • {palette.secondary} • {palette.accent}
                          </div>
                        </div>
                      </div>
                      {currentPalette === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-6 h-6 rounded-full bg-${palette.primary}-500 flex items-center justify-center`}
                        >
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Settings Info */}
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircleIcon className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Settings Auto-saved
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                Your preferences are automatically saved in your browser
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Header Component
const Header = () => {
  const { isDark, palette, toggleSettings } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12 relative"
    >
      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSettings}
        className={`
          absolute top-0 right-0 p-3 rounded-2xl transition-all duration-300 group
          ${isDark 
            ? 'bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white' 
            : 'bg-white/50 hover:bg-white text-gray-500 hover:text-gray-900'
          } 
          backdrop-blur-lg border shadow-lg
          ${isDark ? 'border-slate-700' : 'border-gray-200'}
        `}
      >
        <Cog6ToothIcon className="w-6 h-6 transition-transform duration-300" />
      </motion.button>

      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 bg-gradient-to-br ${palette.gradients.main} rounded-3xl blur-lg opacity-75`}
        />
        <div className={`relative bg-gradient-to-br ${palette.gradients.card} w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl`}>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="text-3xl font-bold text-white"
          >
            P
          </motion.span>
        </div>
      </div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-6xl font-bold bg-gradient-to-r ${palette.gradients.main} bg-clip-text text-transparent mb-6`}
      >
        Peeksta
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}
      >
        Discover who&apos;s not following you back on Instagram.
        To download your data, visit{' '}
        <a
          href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-${palette.primary}-500 hover:text-${palette.primary}-400 transition-colors duration-200 underline decoration-${palette.primary}-500/30 hover:decoration-${palette.primary}-400/50 underline-offset-4`}
        >
          this link
        </a>
        .
      </motion.p>
    </motion.div>
  );
};

// Upload Area Component
const UploadArea = ({ isDragActive, onFileChange, isProcessing }) => {
  const { isDark, palette } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative border-2 border-dashed rounded-3xl p-12 mb-8 transition-all duration-300 backdrop-blur-sm cursor-pointer group
        ${isDragActive 
          ? `border-${palette.primary}-400 shadow-2xl shadow-${palette.primary}-500/25 ${isDark ? `bg-${palette.primary}-500/10` : `bg-${palette.primary}-50`}` 
          : `${isDark ? 'border-slate-600 bg-slate-800/50 hover:border-' + palette.primary + '-500 hover:bg-slate-800/80' : 'border-gray-300 bg-gray-50/50 hover:border-' + palette.primary + '-400 hover:bg-gray-100/80'}`
        }
      `}
    >
      <input
        type="file"
        accept=".zip"
        onChange={onFileChange}
        disabled={isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="text-center">
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          className={`
            w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
            ${isDragActive 
              ? `bg-${palette.primary}-500 shadow-${palette.primary}-500/50` 
              : `${isDark ? 'bg-slate-700 group-hover:bg-' + palette.primary + '-600' : 'bg-gray-200 group-hover:bg-' + palette.primary + '-500 group-hover:text-white'}`
            }
          `}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          ) : (
            <CloudArrowUpIcon className="w-10 h-10 text-white" />
          )}
        </motion.div>

        <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
          {isProcessing ? 'Processing your file...' : 'Upload your Instagram data'}
        </h3>

        <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
          {isDragActive
            ? 'Drop your ZIP file here'
            : 'Drag and drop your ZIP file here or click to browse'
          }
        </p>
      </div>
    </motion.div>
  );
};

UploadArea.propTypes = {
  isDragActive: PropTypes.bool.isRequired,
  onFileChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

// Stats Card Component
const StatsCard = ({ count }) => {
  const { isDark, palette } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-3xl p-8 mb-8 border shadow-2xl
        ${isDark 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }
      `}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <UserGroupIcon className={`w-16 h-16 text-${palette.primary}-500 mx-auto mb-6`} />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className={`text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {count.toLocaleString()}
        </motion.div>
        <p className={`font-medium text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          {count === 1 ? 'User' : 'Users'} not following back
        </p>
      </div>
    </motion.div>
  );
};

StatsCard.propTypes = {
  count: PropTypes.number.isRequired,
};

// Search Input Component
const SearchInput = ({ searchTerm, onSearchChange }) => {
  const { isDark, palette } = useTheme();

  return (
    <div className="relative mb-8">
      <MagnifyingGlassIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`
          w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 text-lg
          ${isDark 
            ? `bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-${palette.primary}-500` 
            : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-${palette.primary}-500`
          } 
          focus:outline-none focus:ring-2 focus:ring-${palette.primary}-500/20
        `}
      />
    </div>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

// User List Component
const UserList = ({ users }) => {
  const { isDark, palette } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        rounded-3xl border overflow-hidden shadow-2xl
        ${isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
        }
      `}
    >
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {users.map((username, index) => (
            <motion.div
              key={username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`border-b last:border-b-0 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}
            >
              <motion.a
                whileHover={{ x: 4 }}
                href={`https://www.instagram.com/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center justify-between p-5 transition-all duration-200 group
                  ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${palette.gradients.card} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`
                    font-medium text-lg transition-colors duration-200
                    ${isDark 
                      ? `text-white group-hover:text-${palette.primary}-300` 
                      : `text-gray-900 group-hover:text-${palette.primary}-600`
                    }
                  `}>
                    @{username}
                  </span>
                </div>
                <ArrowTopRightOnSquareIcon className={`
                  w-6 h-6 transition-all duration-200 group-hover:scale-110
                  ${isDark 
                    ? `text-slate-400 group-hover:text-${palette.primary}-400` 
                    : `text-gray-500 group-hover:text-${palette.primary}-500`
                  }
                `} />
              </motion.a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// No Users Message Component
const NoUsersMessage = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        text-center py-20 px-8 rounded-3xl border
        ${isDark 
          ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30' 
          : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
        }
      `}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <CheckCircleIcon className={`w-20 h-20 mx-auto mb-8 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
      </motion.div>
      <h3 className={`text-3xl font-bold mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
        Perfect! 🎉
      </h3>
      <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
        All users are following you back!
      </p>
    </motion.div>
  );
};

// Drag Overlay Component
const DragOverlay = () => {
  const { isDark, palette } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`
          rounded-3xl p-16 border-2 border-dashed shadow-2xl text-center max-w-md mx-4
          ${isDark 
            ? `bg-gradient-to-br from-${palette.primary}-900 to-${palette.secondary}-900 border-${palette.primary}-400` 
            : `bg-gradient-to-br from-${palette.primary}-100 to-${palette.secondary}-100 border-${palette.primary}-400`
          }
        `}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <DocumentIcon className={`w-24 h-24 mx-auto mb-8 ${isDark ? `text-${palette.primary}-300` : `text-${palette.primary}-600`}`} />
        </motion.div>
        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Drop your ZIP file here
        </h2>
        <p className={`text-xl ${isDark ? `text-${palette.primary}-200` : `text-${palette.primary}-700`}`}>
          Release to upload your Instagram data
        </p>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [notFollowingBack, setNotFollowingBack] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const rootRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file || !file.name.endsWith('.zip')) {
      toast.error('Please upload a valid ZIP file.', {
        icon: React.createElement(ExclamationTriangleIcon, { className: "w-5 h-5" }),
      });
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing your Instagram data...');

    try {
      const zip = await JSZip.loadAsync(file);

      const followersFile = zip.file(/followers_1\.json$/i)[0];
      const followersList = followersFile
        ? JSON.parse(await followersFile.async('string')).map((item) =>
            item.string_list_data[0].value.toLowerCase()
          )
        : [];

      const followingFile = zip.file(/following\.json$/i)[0];
      const followingList = followingFile
        ? JSON.parse(await followingFile.async('string')).relationships_following.map((item) =>
            item.string_list_data[0].value.toLowerCase()
          )
        : [];

      const notFollowingBackList = followingList.filter(
        (username) => !followersList.includes(username)
      );

      setNotFollowingBack(notFollowingBackList);
      setIsUploaded(true);

      toast.success(
        `Found ${notFollowingBackList.length} users not following back!`,
        {
          id: loadingToast,
          icon: React.createElement(CheckCircleIcon, { className: "w-5 h-5" }),
        }
      );
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(
        'Error processing file. Please ensure your ZIP file is valid.',
        {
          id: loadingToast,
          icon: React.createElement(ExclamationTriangleIcon, { className: "w-5 h-5" }),
        }
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setNotFollowingBack([]);
      setSearchTerm('');
      setIsUploaded(false);
      processFile(file);
    }
  }, [processFile]);

  const onFileDrop = useCallback((file) => {
    setNotFollowingBack([]);
    setSearchTerm('');
    setIsUploaded(false);
    processFile(file);
  }, [processFile]);

  const { isDragActive } = useDragAndDrop(rootRef, onFileDrop);

  const filteredUsers = notFollowingBack.filter((username) =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider>
      <AppContent
        isDragActive={isDragActive}
        handleFileChange={handleFileChange}
        isProcessing={isProcessing}
        isUploaded={isUploaded}
        notFollowingBack={notFollowingBack}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredUsers={filteredUsers}
        rootRef={rootRef}
      />
    </ThemeProvider>
  );
}

const AppContent = ({
  isDragActive,
  handleFileChange,
  isProcessing,
  isUploaded,
  notFollowingBack,
  searchTerm,
  setSearchTerm,
  filteredUsers,
  rootRef
}) => {
  const { isDark, palette } = useTheme();

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${isDark 
        ? `bg-gradient-to-br ${palette.gradients.background} text-white` 
        : `bg-gradient-to-br ${palette.gradients.backgroundLight} text-gray-900`
      }
    `}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#1e293b',
            border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
            borderRadius: '16px',
          },
        }}
      />

      <SettingsPanel />

      <div className="container mx-auto px-4 py-12" ref={rootRef}>
        <div className="max-w-4xl mx-auto">
          <Header />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`
              rounded-3xl border shadow-2xl p-8 md:p-12 backdrop-blur-xl
              ${isDark 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white/50 border-gray-200'
              }
            `}
          >
            {!isUploaded && (
              <UploadArea
                isDragActive={isDragActive}
                onFileChange={handleFileChange}
                isProcessing={isProcessing}
              />
            )}

            <AnimatePresence mode="wait">
              {isUploaded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <StatsCard count={notFollowingBack.length} />

                  {notFollowingBack.length > 0 ? (
                    <>
                      <SearchInput
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                      />
                      <UserList users={filteredUsers} />
                    </>
                  ) : (
                    <NoUsersMessage />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isDragActive && <DragOverlay />}
      </AnimatePresence>
    </div>
  );
};

AppContent.propTypes = {
  isDragActive: PropTypes.bool.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  isUploaded: PropTypes.bool.isRequired,
  notFollowingBack: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filteredUsers: PropTypes.array.isRequired,
  rootRef: PropTypes.object.isRequired,
};

export default App;