import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { toast } from 'react-hot-toast';
import createAppTheme from '../materialTheme';

// Local Storage Helper (scoped to theme settings)
const SafeStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  },
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (_) {
      return defaultValue;
    }
  }
};

// Color Palettes (UI gradients + labels used across the app)
export const colorPalettes = {
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

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => SafeStorage.getItem('peeksta_theme', true));
  const [currentPalette, setCurrentPalette] = useState(() => SafeStorage.getItem('peeksta_palette', 'purple'));
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    SafeStorage.setItem('peeksta_theme', isDark);
  }, [isDark]);

  useEffect(() => {
    SafeStorage.setItem('peeksta_palette', currentPalette);
  }, [currentPalette]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    toast.success(`Switched to ${!isDark ? 'Dark' : 'Light'} mode`, { duration: 2000 });
  }, [isDark]);

  const changePalette = useCallback((paletteKey) => {
    setCurrentPalette(paletteKey);
    toast.success(`Changed to ${colorPalettes[paletteKey].name} theme`, { duration: 2000 });
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const palette = colorPalettes[currentPalette];

  const contextValue = useMemo(() => ({
    isDark,
    toggleTheme,
    currentPalette,
    changePalette,
    palette,
    showSettings,
    toggleSettings,
  }), [isDark, toggleTheme, currentPalette, changePalette, palette, showSettings, toggleSettings]);

  const muiTheme = useMemo(
    () => createAppTheme({ mode: isDark ? 'dark' : 'light', paletteKey: currentPalette }),
    [isDark, currentPalette]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;


