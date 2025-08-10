import React, { useState, useRef, useCallback, createContext, useContext, useEffect, useMemo } from 'react';
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
import { ThemeProvider as MuiThemeProvider, useTheme as useMuiTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Box,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  Tooltip,
  Link,
  Drawer,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  OpenInNew as OpenInNewIcon,
  Settings as SettingsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIconMUI,
  ColorLens as ColorLensIcon,
  MenuRounded,
  Computer as ComputerIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
  Code as CodeIcon,
  Update as UpdateIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SettingsSystemDaydream as SystemIcon
} from '@mui/icons-material';
import {
  DashboardOutlined as DashboardIcon,
  PeopleAltOutlined as PeopleIcon,
  ChatBubbleOutline as ChatIcon,
  Link as LinkIcon,
  Campaign as CampaignIcon,
  Apps as AppsIcon,
  Insights as InsightsIcon,
  Forum as ForumIcon,
  Tune as TuneIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { deepPurple, teal, deepOrange, pink, indigo, green, amber } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import createAppTheme from './materialTheme';

// Import color map for settings
const muiColorMap = {
  purple: { primary: deepPurple, secondary: indigo },
  green: { primary: teal, secondary: green },
  orange: { primary: deepOrange, secondary: amber },
  pink: { primary: pink, secondary: deepPurple },
  indigo: { primary: indigo, secondary: deepPurple },
};
import { ingestZipFile, ingestDirectoryFiles, analyzeVfs } from './ig/analysis';
import DatasetsManager from './components/datasets/DatasetsManager.jsx';
import {
  listDatasets,
  getDataset,
  addDataset,
  deleteDataset as idbDeleteDataset,
  renameDataset as idbRenameDataset,
  touchDataset,
  generateDatasetId,
  buildZipDataset,
} from './storage/datasets';
import InsightsChart from './components/charts/InsightsChart.jsx';
import BarChart from './components/charts/BarChart.jsx';
import PieChart from './components/charts/PieChart.jsx';
import Section from './components/common/Section.jsx';
import ProSidebar from './components/sidebar/ProSidebar.jsx';
import SidebarRail from './components/sidebar/SidebarRail.jsx';
import MiniDrawer from './components/layout/MiniDrawer.jsx';
import StatMini from './components/common/StatMini.jsx';
import KpiCard from './components/overview/KpiCard.jsx';
import ActiveAppsList from './components/apps/ActiveAppsList.jsx';
import AdsTopicsPanel from './components/ads/AdsTopicsPanel.jsx';
import ConnectionsTables from './components/connections/ConnectionsTables.jsx';
import {
  OverviewPage,
  ConnectionsPage,
  MessagesPage,
  LinkHistoryPage,
  LoggedInformationPage,
  AdsPage,
  AppsPage,
  InsightsPage,
  ThreadsPage,
  PreferencesPage,
  PersonalPage,
  SecurityPage,
} from './pages';

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

const LAST_DATASET_KEY = 'peeksta_last_dataset_id';

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
  const dragCounter = useRef(0);

  const prevent = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleWindowDragEnter = useCallback((event) => {
    prevent(event);
    if (event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.includes('Files')) {
      dragCounter.current += 1;
      setIsDragActive(true);
    }
  }, [prevent]);

  const handleWindowDragOver = useCallback((event) => {
    prevent(event);
  }, [prevent]);

  const handleWindowDragLeave = useCallback((event) => {
    prevent(event);
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  }, [prevent]);

  const handleWindowDrop = useCallback((event) => {
    prevent(event);
    setIsDragActive(false);
    dragCounter.current = 0;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileDrop(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [prevent, onFileDrop]);

  useEffect(() => {
    // Attach global listeners to prevent browser default navigation/download
    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [handleWindowDragEnter, handleWindowDragOver, handleWindowDragLeave, handleWindowDrop]);

  return { isDragActive };
}

// Modern Settings Dialog (Material Design You)
const SettingsDialog = () => {
  const { isDark, toggleTheme, currentPalette, changePalette, showSettings, toggleSettings } = useTheme();
  const theme = useMuiTheme();
  const [themeMode, setThemeMode] = React.useState(() => {
    const saved = localStorage.getItem('peeksta_theme_mode');
    return saved || 'system';
  });
  const [activeTab, setActiveTab] = React.useState(0);

  // System theme detection
  React.useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        const systemDark = e.matches;
        if (isDark !== systemDark) {
          toggleTheme();
        }
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [themeMode, isDark, toggleTheme]);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('peeksta_theme_mode', mode);
    
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark !== systemDark) toggleTheme();
    } else if (mode === 'dark' && !isDark) {
      toggleTheme();
    } else if (mode === 'light' && isDark) {
      toggleTheme();
    }
  };

  const themeOptions = [
    { 
      value: 'system', 
      label: 'System', 
      icon: <SystemIcon />, 
      description: 'Follow system preference',
      color: theme.palette.info.main
    },
    { 
      value: 'light', 
      label: 'Light', 
      icon: <LightModeIcon />, 
      description: 'Always use light theme',
      color: theme.palette.warning.main
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      icon: <DarkModeIcon />, 
      description: 'Always use dark theme',
      color: theme.palette.text.primary
    },
  ];

  const settingsSections = [
    {
      title: 'Appearance',
      icon: <ColorLensIcon />,
      items: [
        {
          type: 'theme-selector',
          title: 'Theme Mode',
          description: 'Choose your preferred color scheme',
        },
        {
          type: 'color-palette',
          title: 'Color Palette',
          description: 'Dynamic color system based on Material You',
        }
      ]
    },
    {
      title: 'Privacy & Data',
      icon: <SecurityIcon />,
      items: [
        {
          type: 'info',
          title: 'Local Processing',
          description: 'All data is processed locally in your browser. Nothing is sent to external servers.',
          status: 'Enabled'
        },
        {
          type: 'info',
          title: 'Data Storage',
          description: 'Instagram data is stored securely in your browser\'s IndexedDB.',
          status: 'Local Only'
        }
      ]
    },
    {
      title: 'Performance',
      icon: <TuneIcon />,
      items: [
        {
          type: 'info',
          title: 'Media Processing',
          description: 'Configure whether to include media files in analysis for better performance.',
          status: 'Configurable'
        }
      ]
    }
  ];

  const appInfo = {
    name: 'Peeksta',
    version: '2.1.0',
    description: 'Modern Instagram Analytics Dashboard',
    github: 'https://github.com/IRedDragonICY/peeksta',
    author: 'IRedDragonICY',
    license: 'MIT',
    builtWith: ['React 18', 'Material-UI v7', 'Framer Motion', 'ECharts', 'Vite', 'JSZip'],
    releaseDate: 'January 2024',
    features: ['Local Processing', 'Zero Server', 'Material You', 'Privacy First']
  };

  return (
    <Dialog 
      open={showSettings} 
      onClose={toggleSettings} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 0, // Flat design - no rounded corners
          maxHeight: '90vh',
          backgroundImage: 'none',
        }
      }}
    >
      {/* Modern Header */}
      <DialogTitle sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        p: 3,
      }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 0, // Flat
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SettingsIcon sx={{ fontSize: 28 }} />
            </Box>
              <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                Settings
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Customize your Peeksta experience
              </Typography>
              </Box>
            </Stack>
          <IconButton 
            onClick={toggleSettings}
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <XMarkIcon className="w-6 h-6" />
          </IconButton>
          </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Modern Tabs */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                borderRadius: 0, // Flat
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 56,
              }
            }}
          >
            <Tab 
              label="Appearance" 
              icon={<ColorLensIcon />} 
              iconPosition="start"
              sx={{ gap: 1 }}
            />
            <Tab 
              label="Privacy & Data" 
              icon={<SecurityIcon />} 
              iconPosition="start"
              sx={{ gap: 1 }}
            />
            <Tab 
              label="About" 
              icon={<InfoIcon />} 
              iconPosition="start"
              sx={{ gap: 1 }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ minHeight: 500 }}>
          {/* Appearance Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              
                            {/* Theme Mode Selector */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ComputerIcon color="primary" />
                  Theme Mode
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose how you want the app to look. System mode automatically adapts to your device preferences.
                </Typography>
                
                                <Stack spacing={2}>
                  {themeOptions.map((option) => (
                <Card
                      key={option.value}
                      variant="outlined"
                  sx={{
                        borderRadius: 0, // Material Design You flat
                        cursor: 'pointer',
                        border: themeMode === option.value 
                          ? `3px solid ${theme.palette.primary.main}` 
                          : `1px solid ${theme.palette.divider}`,
                        bgcolor: themeMode === option.value 
                          ? alpha(theme.palette.primary.main, 0.08) 
                          : theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: themeMode === option.value 
                            ? alpha(theme.palette.primary.main, 0.12) 
                            : alpha(theme.palette.action.hover, 0.08),
                          borderColor: themeMode === option.value 
                            ? theme.palette.primary.main 
                            : theme.palette.primary.light,
                        }
                      }}
                      onClick={() => handleThemeChange(option.value)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          {/* Icon Container */}
                        <Box sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 0, // Flat
                            backgroundColor: themeMode === option.value 
                              ? theme.palette.primary.main 
                              : option.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {React.cloneElement(option.icon, { 
                              sx: { fontSize: 28, color: 'white' } 
                            })}
                          </Box>
                          
                          {/* Content */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                              {option.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {option.description}
                            </Typography>
                          </Box>
                          
                          {/* Selection Indicator */}
                          {themeMode === option.value && (
                            <Box sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 0, // Flat
                              backgroundColor: theme.palette.primary.main,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <CheckCircleIconMUI sx={{ fontSize: 20, color: 'white' }} />
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>

              {/* Color Palette */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ColorLensIcon color="primary" />
                  Color Palette
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Material You dynamic color system with adaptive colors
                </Typography>
                
                                                <Stack spacing={2}>
                  {Object.entries(colorPalettes).map(([key, pal]) => (
                    <Card
                      key={key}
                      variant="outlined"
                      sx={{
                        borderRadius: 0, // Material Design You flat
                        cursor: 'pointer',
                        border: currentPalette === key 
                          ? `3px solid ${theme.palette.primary.main}` 
                          : `1px solid ${theme.palette.divider}`,
                        bgcolor: currentPalette === key 
                          ? alpha(theme.palette.primary.main, 0.08) 
                          : theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: currentPalette === key 
                            ? alpha(theme.palette.primary.main, 0.12) 
                            : alpha(theme.palette.action.hover, 0.08),
                          borderColor: currentPalette === key 
                            ? theme.palette.primary.main 
                            : theme.palette.primary.light,
                        }
                      }}
                      onClick={() => changePalette(key)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          {/* Main Color Display */}
                          <Stack direction="row" spacing={1}>
                            <Box sx={{
                              width: 48,
                              height: 56,
                              borderRadius: 0, // Flat
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? muiColorMap[key]?.primary[400] || deepPurple[400]
                                : muiColorMap[key]?.primary[600] || deepPurple[600],
                            }} />
                            <Box sx={{
                              width: 24,
                              height: 56,
                              borderRadius: 0, // Flat
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? muiColorMap[key]?.secondary[400] || indigo[400]
                                : muiColorMap[key]?.secondary[600] || indigo[600],
                            }} />
                            <Box sx={{
                              width: 12,
                              height: 56,
                              borderRadius: 0, // Flat
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? muiColorMap[key]?.accent?.[400] || pink[400]
                                : muiColorMap[key]?.accent?.[600] || pink[600],
                            }} />
                          </Stack>
                          
                          {/* Color Info */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                              {pal.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {pal.primary} • {pal.secondary} • {pal.accent}
                            </Typography>
                      </Box>
                          
                          {/* Selection Indicator */}
                          {currentPalette === key && (
                            <Box sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 0, // Flat
                              backgroundColor: theme.palette.primary.main,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <CheckCircleIconMUI sx={{ fontSize: 20, color: 'white' }} />
                            </Box>
                          )}
                        </Stack>
                    </CardContent>
                </Card>
                  ))}
                </Stack>
              </Box>
            </Box>
          )}

          {/* Privacy & Data Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                Privacy & Data Protection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your privacy is our priority. All processing happens locally on your device.
              </Typography>
              
              {settingsSections[1].items.map((item, index) => {
                const icons = [<SecurityIcon />, <StorageIcon />];
                const colors = [theme.palette.success.main, theme.palette.info.main];
                
                return (
                  <Box key={index} sx={{ 
                    mb: 2, 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    border: `2px solid ${colors[index]}`,
                    borderRadius: 0 // Material Design You flat
                  }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 0, // Flat
                        backgroundColor: colors[index],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {React.cloneElement(icons[index], { sx: { fontSize: 28, color: 'white' } })}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>
                          {item.description}
                        </Typography>
                        <Chip 
                          label={item.status} 
                          color="success" 
                          variant="filled"
                          sx={{ 
                            borderRadius: 0, // Flat
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 28
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>
            );
          })}

              {/* Additional Privacy Features */}
              <Box sx={{ 
                p: 3, 
                bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'success.50',
                border: `2px solid ${theme.palette.success.main}`,
                borderRadius: 0 // Material Design You flat
              }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 0, // Flat
                    backgroundColor: theme.palette.success.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <StorageIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: 'success.main' }}>
                      Zero Server Communication
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Your Instagram data never leaves your browser. Everything is processed locally using modern web technologies.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}

          {/* About Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="primary" />
                About Peeksta
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Modern Instagram analytics dashboard built with privacy in mind.
              </Typography>

              {/* App Info Grid */}
              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    border: `2px solid ${theme.palette.warning.main}`,
                    borderRadius: 0 // Material Design You flat
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 0, // Flat
                        backgroundColor: theme.palette.warning.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <UpdateIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.main' }}>
                        Version Information
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Current Version</Typography>
                        <Chip 
                          label={`v${appInfo.version}`} 
                          color="warning" 
                          variant="filled"
                          sx={{ borderRadius: 0, fontWeight: 700, fontSize: '0.8rem' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Release Date</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {appInfo.releaseDate}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>License</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {appInfo.license}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
        </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    border: `2px solid ${theme.palette.secondary.main}`,
                    borderRadius: 0 // Material Design You flat
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 0, // Flat
                        backgroundColor: theme.palette.secondary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CodeIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                        Technology Stack
                      </Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {appInfo.builtWith.map((tech) => (
                        <Chip 
                          key={tech}
                          label={tech} 
                          size="small" 
                          color="secondary"
                          variant="filled"
                          sx={{ 
                            borderRadius: 0, // Flat
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : alpha(theme.palette.primary.main, 0.05),
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 0 // Material Design You flat
                  }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Box sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 0, // Flat
                          backgroundColor: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <GitHubIcon sx={{ fontSize: 28, color: 'white' }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: 'primary.main' }}>
                            Open Source Project
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
                            Peeksta is open source! View the code, report bugs, request features, or contribute.
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {appInfo.github}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        variant="contained"
                        startIcon={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
                        href={appInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          borderRadius: 0, // Flat
                          textTransform: 'none',
                          fontWeight: 700,
                          px: 4,
                          py: 1.5,
                          fontSize: '0.9rem'
                        }}
                      >
                        View on GitHub
                      </Button>
                    </Stack>
                  </Box>
                </Grid>

                {/* System Information */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    border: `2px solid ${theme.palette.info.main}`,
                    borderRadius: 0 // Material Design You flat
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 0, // Flat
                        backgroundColor: theme.palette.info.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <SpeedIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'info.main' }}>
                        System Information
                      </Typography>
                    </Stack>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Browser
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                             navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                             navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Platform
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {navigator.platform}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Resolution
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {screen.width} × {screen.height}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Color Depth
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {screen.colorDepth}-bit
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ 
        p: 3, 
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
        borderTop: `2px solid ${theme.palette.primary.main}`
      }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
              {appInfo.name} v{appInfo.version}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              © 2024 {appInfo.author} • Made with ❤️ for Instagram users
            </Typography>
          </Box>
          <Button 
            onClick={toggleSettings} 
            variant="contained"
            sx={{ 
              borderRadius: 0, // Material Design You flat
              px: 4, 
              py: 1.5,
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Done
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
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

// Upload Area Component (MUI)
const UploadArea = ({ isDragActive, onFileChange, onFolderChange, isProcessing }) => {
  const muiTheme = useMuiTheme();
  const folderInputRef = useRef(null);
  const triggerFolderPicker = useCallback(() => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  }, []);

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'relative',
        p: { xs: 4, sm: 6 },
        mb: 3,
        borderStyle: 'dashed',
        borderRadius: 3,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all .2s',
        bgcolor: isDragActive ? (muiTheme.palette.mode === 'dark' ? 'action.hover' : 'primary.50') : 'background.paper',
      }}
    >
      <input
        type="file"
        accept=".zip"
        onChange={onFileChange}
        disabled={isProcessing}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
      />
      {/* Hidden folder input for directory uploads */}
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={onFolderChange}
        disabled={isProcessing}
        style={{ display: 'none' }}
        ref={folderInputRef}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ width: 32, height: 32, border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
          ) : (
            <CloudUploadIcon fontSize="large" />
          )}
        </Box>
        <Typography variant="h6">
          {isProcessing ? 'Processing your data...' : 'Upload your Instagram export'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isDragActive ? 'Drop your ZIP here' : 'Drag & drop ZIP here, or click to browse (ZIP)'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Or load a folder export (Settings &gt; Accounts center &gt; Your information &gt; Download information)
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CloudUploadIcon />}
          onClick={triggerFolderPicker}
          sx={{ mt: 1 }}
          disabled={isProcessing}
        >
          Load Folder
        </Button>
      </Box>
    </Paper>
  );
};

UploadArea.propTypes = {
  isDragActive: PropTypes.bool.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onFolderChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

// Stats Card Component (MUI)
const StatsCard = ({ count }) => {
  return (
    <Paper variant="outlined" sx={{ p: 4, mb: 3, textAlign: 'center', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <GroupIcon color="primary" sx={{ fontSize: 56 }} />
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{count.toLocaleString()}</Typography>
      <Typography color="text.secondary">{count === 1 ? 'User' : 'Users'} not following back</Typography>
    </Paper>
  );
};

StatsCard.propTypes = {
  count: PropTypes.number.isRequired,
};

// Search Input Component (MUI)
const SearchInput = ({ searchTerm, onSearchChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search users..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

// User List Component (MUI)
const UserList = ({ users }) => {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <List disablePadding dense sx={{ maxHeight: 384, overflow: 'auto' }}>
        {users.map((username) => (
          <ListItemButton
              key={username}
            component="a"
                href={`https://www.instagram.com/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
            divider
              >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      {username.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`@${username}`} />
            <IconButton edge="end" aria-label="open profile">
              <OpenInNewIcon />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// No Users Message Component (MUI)
const NoUsersMessage = () => {
  return (
    <Paper variant="outlined" sx={{ textAlign: 'center', py: 8, px: 4, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <CheckCircleIconMUI color="success" sx={{ fontSize: 64 }} />
      </Box>
      <Typography variant="h5" color="success.main" sx={{ fontWeight: 700, mb: 1 }}>
        Perfect! 🎉
      </Typography>
      <Typography color="text.secondary">All users are following you back!</Typography>
    </Paper>
  );
};

// Drag Overlay Component (MUI)
const DragOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: (theme) => theme.zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <DescriptionIcon color="primary" sx={{ fontSize: 96, mb: 2 }} />
        </motion.div>
        <Typography variant="h5" sx={{ mb: 1 }}>Drop your ZIP file here</Typography>
        <Typography color="text.secondary">Release to upload your Instagram data</Typography>
      </Paper>
    </Box>
  );
};

// Media Choice Dialog Component (MUI)
const MediaChoiceDialog = ({ open, onChoice, fileName }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <VisibilityIcon color="primary" />
        Media Upload Options
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          How would you like to process your Instagram data?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          File: <strong>{fileName}</strong>
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined" 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => onChoice(false)}
            >
              <Box sx={{ mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Bandwidth Saving
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyze data without media content. Faster processing and less bandwidth usage.
              </Typography>
              <Chip 
                label="Recommended" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined" 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => onChoice(true)}
            >
              <Box sx={{ mb: 2 }}>
                <VisibilityIcon color="primary" sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Include Media
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Process with full media content including images and videos for complete analysis.
              </Typography>
              <Chip 
                label="Full Analysis" 
                color="primary" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
          You can change this setting later in the analysis page
        </Typography>
        <Button onClick={() => onChoice(false)} color="success" variant="contained">
          Skip Media
        </Button>
        <Button onClick={() => onChoice(true)} color="primary" variant="contained">
          Include Media
        </Button>
      </DialogActions>
    </Dialog>
  );
};

MediaChoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onChoice: PropTypes.func.isRequired,
  fileName: PropTypes.string,
};

// Main App Component
function App() {
  const [notFollowingBack, setNotFollowingBack] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [advanced, setAdvanced] = useState(null); // full analytics result
  const [progressText, setProgressText] = useState('');
  const rootRef = useRef(null);
  const folderInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState(() => {
    try {
      return localStorage.getItem('peeksta_active_section') || 'overview';
    } catch (_) {
      return 'overview';
    }
  });
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const restoreOnceRef = useRef(false);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [includeMediaGlobal, setIncludeMediaGlobal] = useState(false);
  const [currentDatasetId, setCurrentDatasetId] = useState(() => {
    try { return localStorage.getItem(LAST_DATASET_KEY) || null; } catch (_) { return null; }
  });

  const processFileWithMedia = useCallback(async (file, includeMedia = false) => {
    setIsProcessing(true);
    const loadingToastId = 'processing-upload';
    toast.loading('Processing your Instagram data...', { id: loadingToastId });

    try {
      // Advanced pipeline: ingest ZIP -> analyze
      const vfs = await ingestZipFile(file, (p, stage) => {
        if (stage) setProgressText(stage);
      });
      const analysis = await analyzeVfs(vfs, (_p, stage) => {
        if (stage) setProgressText(stage);
      });

      // Store media preference in analysis
      analysis.includeMedia = includeMedia;
      setIncludeMediaGlobal(includeMedia);

      setAdvanced(analysis);
      setNotFollowingBack(analysis.notFollowingBack || []);
      setIsUploaded(true);

      // Save dataset to IndexedDB for persistence
      try {
        const id = generateDatasetId();
        const ds = buildZipDataset({
          id,
          name: analysis?.profile?.username ? `${analysis.profile.username} (${file.name})` : file.name,
          fileName: file.name,
          blob: file,
          meta: { 
            username: analysis?.profile?.username || '',
            includeMedia: includeMedia
          },
        });
        await addDataset(ds);
        // Cache analysis for instant reload next time
        try {
          const { cacheAnalysis } = await import('./storage/datasets');
          await cacheAnalysis(id, analysis);
        } catch (_) {}
        await touchDataset(id);
        try { localStorage.setItem(LAST_DATASET_KEY, id); setCurrentDatasetId(id); } catch (_) {}
        // Refresh list after save
        try {
          const items = await listDatasets();
          setDatasets(items);
        } catch (_) {}
      } catch (e) {
        // non-fatal
        // console.warn('Failed to persist dataset', e);
      }

      const mediaText = includeMedia ? ' (with media)' : ' (media-free)';
      toast.success(`Found ${analysis.notFollowingBack?.length || 0} users not following back!${mediaText}`, { id: loadingToastId });
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file. Please ensure your ZIP file is valid.', { id: loadingToastId });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processFile = useCallback(async (file) => {
    if (!file || !file.name.endsWith('.zip')) {
      toast.error('Please upload a valid ZIP file.', {
        icon: React.createElement(ExclamationTriangleIcon, { className: "w-5 h-5" }),
      });
      return;
    }

    // Show media inclusion dialog
    setPendingFile(file);
    setShowMediaDialog(true);
  }, []);

  const handleMediaChoice = useCallback((includeMedia) => {
    setShowMediaDialog(false);
    if (pendingFile) {
      processFileWithMedia(pendingFile, includeMedia);
      setPendingFile(null);
    }
  }, [pendingFile, processFileWithMedia]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setNotFollowingBack([]);
      setSearchTerm('');
      setIsUploaded(false);
      setAdvanced(null);
      processFile(file);
    }
  }, [processFile]);

  const handleFolderChange = useCallback(async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const loadingToastId = 'processing-folder';
    toast.loading('Processing your Instagram folder...', { id: loadingToastId });
    try {
      const vfs = await ingestDirectoryFiles(files, (p, stage) => {
        if (stage) setProgressText(stage);
      });
      const analysis = await analyzeVfs(vfs, (_p, stage) => {
        if (stage) setProgressText(stage);
      });
      setAdvanced(analysis);
      setNotFollowingBack(analysis.notFollowingBack || []);
      setIsUploaded(true);
      toast.success(`Found ${analysis.notFollowingBack?.length || 0} users not following back!`, { id: loadingToastId });
    } catch (error) {
      console.error('Error processing folder:', error);
      toast.error('Error processing folder.', { id: loadingToastId });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const triggerFolderPicker = useCallback(() => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  }, []);

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

  const refreshDatasets = useCallback(async () => {
    setDatasetsLoading(true);
    try {
      const items = await listDatasets();
      setDatasets(items);
    } finally {
      setDatasetsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDatasets();
  }, [refreshDatasets]);

  const handleLoadDataset = useCallback(async (datasetId) => {
    try {
      const ds = await getDataset(datasetId);
      if (!ds) return;
      setIsProcessing(true);
      const loadingToastId = 'loading-dataset';
      toast.loading('Loading dataset...', { id: loadingToastId });
      let analysis = null;
      if (ds.analysis) {
        analysis = ds.analysis;
      } else if (ds.type === 'zip' && ds.blob) {
        const vfs = await ingestZipFile(ds.blob, (p, stage) => { if (stage) setProgressText(stage); });
        analysis = await analyzeVfs(vfs, (_p, stage) => { if (stage) setProgressText(stage); });
      } else if (ds.type === 'vfs' && Array.isArray(ds.vfs)) {
        const vfs = new Map(ds.vfs);
        analysis = await analyzeVfs(vfs, (_p, stage) => { if (stage) setProgressText(stage); });
      }
      if (analysis) {
        setAdvanced(analysis);
        setNotFollowingBack(analysis.notFollowingBack || []);
        setIsUploaded(true);
        setCurrentDatasetId(ds.id);
        try { localStorage.setItem(LAST_DATASET_KEY, ds.id); } catch (_) {}
        await touchDataset(ds.id);
        toast.success('Dataset loaded', { id: loadingToastId });
        await refreshDatasets();
      } else {
        toast.error('Failed to load dataset', { id: loadingToastId });
      }
    } catch (e) {
      console.error(e);
      toast.error('Error loading dataset');
    } finally {
      setIsProcessing(false);
    }
  }, [refreshDatasets]);

  const handleDeleteDataset = useCallback(async (datasetId) => {
    try {
      await idbDeleteDataset(datasetId);
      if (currentDatasetId === datasetId) {
        // Reset app state when deleting the dataset in use
        setAdvanced(null);
        setIsUploaded(false);
        setNotFollowingBack([]);
        setSearchTerm('');
        setCurrentDatasetId(null);
        try { localStorage.removeItem(LAST_DATASET_KEY); } catch (_) {}
        // Switch to datasets section for clarity
        setActiveSection('datasets');
      }
      await refreshDatasets();
      toast.success('Dataset deleted');
    } catch (e) {
      toast.error('Failed to delete dataset');
    }
  }, [currentDatasetId, refreshDatasets]);

  const handleRenameDataset = useCallback(async (datasetId, newName) => {
    await idbRenameDataset(datasetId, newName);
    await refreshDatasets();
  }, [refreshDatasets]);

  // Fast restore of last used dataset on app load for better UX
  useEffect(() => {
    (async () => {
      if (restoreOnceRef.current) return;
      restoreOnceRef.current = true;
      try {
        const lastId = StorageHelper.getItem(LAST_DATASET_KEY, null) || localStorage.getItem(LAST_DATASET_KEY);
        if (!lastId) return;
        const ds = await getDataset(lastId);
        if (!ds) return;
        if (ds.analysis) {
          // Instant hydrate without heavy processing
          setAdvanced(ds.analysis);
          setNotFollowingBack(ds.analysis.notFollowingBack || []);
          setIsUploaded(true);
          setCurrentDatasetId(ds.id);
          await touchDataset(ds.id);
          refreshDatasets();
          return;
        }
        // Fallback to normal loader
        await handleLoadDataset(lastId);
      } catch (_) {
        // ignore restore errors
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist active section
  useEffect(() => {
    try { localStorage.setItem('peeksta_active_section', activeSection); } catch (_) {}
  }, [activeSection]);

  return (
    <ThemeProvider>
      <AppContent
        isDragActive={isDragActive}
        handleFileChange={handleFileChange}
        handleFolderChange={handleFolderChange}
        isProcessing={isProcessing}
        isUploaded={isUploaded}
        notFollowingBack={notFollowingBack}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredUsers={filteredUsers}
        rootRef={rootRef}
        advanced={advanced}
        progressText={progressText}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        datasets={datasets}
        datasetsLoading={datasetsLoading}
        refreshDatasets={refreshDatasets}
        onLoadDataset={handleLoadDataset}
        onDeleteDataset={handleDeleteDataset}
        onRenameDataset={handleRenameDataset}
        showMediaDialog={showMediaDialog}
        pendingFile={pendingFile}
        handleMediaChoice={handleMediaChoice}
        includeMediaGlobal={includeMediaGlobal}
        currentDatasetId={currentDatasetId}
        isNavDisabled={!isUploaded}
      />
    </ThemeProvider>
  );
}

const AppContent = ({
  isDragActive,
  handleFileChange,
  handleFolderChange,
  isProcessing,
  isUploaded,
  notFollowingBack,
  searchTerm,
  setSearchTerm,
  filteredUsers,
  rootRef,
  advanced,
  progressText,
  activeSection,
  setActiveSection,
  datasets,
  datasetsLoading,
  refreshDatasets,
  onLoadDataset,
  onDeleteDataset,
  onRenameDataset,
  showMediaDialog,
  pendingFile,
  handleMediaChoice,
  includeMediaGlobal,
  currentDatasetId,
  isNavDisabled,
}) => {
  const { isDark, toggleTheme, toggleSettings } = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#101528' : '#ffffff',
            color: isDark ? '#E6EAF2' : '#101528',
            border: `1px solid ${isDark ? '#24304A' : '#e2e8f0'}`,
            borderRadius: '16px',
          },
        }}
      />

      <SettingsDialog />

      <MiniDrawer
        title="Peeksta"
        activeSection={activeSection}
        onSelect={(key) => {
          if (isNavDisabled && !['overview', 'datasets'].includes(key)) return;
          setActiveSection(key);
        }}
        renderHeaderActions={() => (
          <>
            <IconButton color="inherit" onClick={toggleSettings} aria-label="open settings">
              <SettingsIcon />
            </IconButton>
          </>
        )}
        isItemDisabled={(key) => isNavDisabled && !['overview', 'datasets'].includes(key)}
      >

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 3, md: 6 },
          '& .MuiPaper-root:empty': { display: 'none' },
        }}
        ref={rootRef}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
            {!isUploaded && (
                <UploadArea isDragActive={isDragActive} onFileChange={handleFileChange} onFolderChange={handleFolderChange} isProcessing={isProcessing} />
              )}
            {!!progressText && !isUploaded && (
              <Typography variant="caption" color="text.secondary">{progressText}</Typography>
            )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {activeSection === 'datasets' && (
                <DatasetsManager
                  datasets={datasets}
                  loading={datasetsLoading}
                  onRefresh={refreshDatasets}
                  onLoad={onLoadDataset}
                  onDelete={onDeleteDataset}
                  onRename={onRenameDataset}
                  currentId={currentDatasetId}
                />
              )}
              {(!isUploaded) && (
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>How it works</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Export your Instagram data (ZIP or folder) then drop the ZIP here. We process it locally in your browser; no data leaves your device.
                    </Typography>
                  </CardContent>
                </Card>
              )}
              {(!isUploaded) && (
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <ColorLensIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Material You</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Dynamic color system with accessible contrast and soft shapes.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Responsive" size="small" color="primary" variant="outlined" />
                      <Chip label="Modern" size="small" color="primary" variant="outlined" />
                      <Chip label="Accessible" size="small" color="primary" variant="outlined" />
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {isUploaded && advanced && activeSection === 'overview' && (
                <OverviewPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
              )}

              {isUploaded && advanced && activeSection === 'connections' && (
                <ConnectionsPage advanced={advanced} />
              )}

              {isUploaded && advanced && activeSection === 'messages' && (
                <MessagesPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
              )}

              {isUploaded && advanced && activeSection === 'link-history' && (
                <LinkHistoryPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
              )}

              {isUploaded && advanced && activeSection === 'logged-information' && (
                <LoggedInformationPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
              )}

              {isUploaded && advanced && activeSection === 'ads' && (
                <AdsPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
              )}

              {isUploaded && advanced && activeSection === 'apps' && (
                <AppsPage advanced={advanced} />
              )}

              {isUploaded && advanced && activeSection === 'insights' && (
                <InsightsPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
              )}

              {isUploaded && advanced && activeSection === 'threads' && (
                <ThreadsPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
              )}

              {isUploaded && advanced && activeSection === 'preferences' && (
                <PreferencesPage advanced={advanced} />
              )}

              {isUploaded && advanced && activeSection === 'security' && (
                <SecurityPage advanced={advanced} />
              )}

              {isUploaded && advanced && activeSection === 'personal' && (
                <PersonalPage advanced={advanced} />
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <AnimatePresence>{isDragActive && <DragOverlay />}</AnimatePresence>
      </MiniDrawer>
      
      {/* Media Choice Dialog */}
      <MediaChoiceDialog
        open={showMediaDialog}
        onChoice={handleMediaChoice}
        fileName={pendingFile?.name}
      />
    </Box>
  );
};

AppContent.propTypes = {
  isDragActive: PropTypes.bool.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleFolderChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  isUploaded: PropTypes.bool.isRequired,
  notFollowingBack: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filteredUsers: PropTypes.array.isRequired,
  rootRef: PropTypes.object.isRequired,
  advanced: PropTypes.object,
  progressText: PropTypes.string,
  activeSection: PropTypes.string,
  setActiveSection: PropTypes.func,
  datasets: PropTypes.array,
  datasetsLoading: PropTypes.bool,
  refreshDatasets: PropTypes.func,
  onLoadDataset: PropTypes.func,
  onDeleteDataset: PropTypes.func,
  onRenameDataset: PropTypes.func,
  showMediaDialog: PropTypes.bool,
  pendingFile: PropTypes.object,
  handleMediaChoice: PropTypes.func,
  includeMediaGlobal: PropTypes.bool,
  currentDatasetId: PropTypes.string,
  isNavDisabled: PropTypes.bool,
};

export default App;

// Small UI helpers
// StatMini moved to components/common/StatMini.jsx

function RowMini({ primary, secondary }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="body2">{primary}</Typography>
      <Chip size="small" label={secondary} />
    </Box>
  );
}
RowMini.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
};

// InsightsChart moved to components/charts/InsightsChart.jsx

// Sidebar variants moved to components/sidebar/

//

//

// Section moved to components/common/Section.jsx

// BarChart moved to components/charts/BarChart.jsx

// ActiveAppsList moved to components/apps/ActiveAppsList.jsx