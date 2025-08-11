import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Tabs, Tab, Stack, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { useTheme } from '../../theme/ThemeProvider.jsx';
import { useTheme as useMuiTheme, alpha } from '@mui/material/styles';
import {
  Settings as SettingsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SettingsSystemDaydream as SystemIcon,
  Tune as TuneIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
  Code as CodeIcon,
  Update as UpdateIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  ColorLens as ColorLensIcon,
} from '@mui/icons-material';
import { deepPurple, teal, deepOrange, pink, indigo, green, amber } from '@mui/material/colors';
import { CheckCircle as CheckCircleIconMUI } from '@mui/icons-material';
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Palette swatch helper mapping (for preview bars)
const muiColorMap = {
  purple: { primary: deepPurple, secondary: indigo },
  green: { primary: teal, secondary: green },
  orange: { primary: deepOrange, secondary: amber },
  pink: { primary: pink, secondary: deepPurple },
  indigo: { primary: indigo, secondary: deepPurple },
};

const SettingsDialogModal = () => {
  const { isDark, toggleTheme, currentPalette, changePalette, showSettings, toggleSettings } = useTheme();
  const theme = useMuiTheme();
  const [themeMode, setThemeMode] = React.useState(() => {
    const saved = localStorage.getItem('peeksta_theme_mode');
    return saved || 'system';
  });
  const [activeTab, setActiveTab] = React.useState(0);

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
    { value: 'system', label: 'System', icon: <SystemIcon />, description: 'Follow system preference', color: theme.palette.info.main },
    { value: 'light', label: 'Light', icon: <LightModeIcon />, description: 'Always use light theme', color: theme.palette.warning.main },
    { value: 'dark', label: 'Dark', icon: <DarkModeIcon />, description: 'Always use dark theme', color: theme.palette.text.primary },
  ];

  const settingsSections = [
    { title: 'Appearance', icon: <ColorLensIcon />, items: [
      { type: 'theme-selector', title: 'Theme Mode', description: 'Choose your preferred color scheme' },
      { type: 'color-palette', title: 'Color Palette', description: 'Dynamic color system based on Material You' },
    ] },
    { title: 'Privacy & Data', icon: <SecurityIcon />, items: [
      { type: 'info', title: 'Local Processing', description: 'All data is processed locally in your browser. Nothing is sent to external servers.', status: 'Enabled' },
      { type: 'info', title: 'Data Storage', description: 'Instagram data is stored securely in your browser\'s IndexedDB.', status: 'Local Only' },
    ] },
    { title: 'Performance', icon: <TuneIcon />, items: [
      { type: 'info', title: 'Media Processing', description: 'Configure whether to include media files in analysis for better performance.', status: 'Configurable' },
    ] },
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
    <Dialog open={showSettings} onClose={toggleSettings} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 0, maxHeight: '90vh', backgroundImage: 'none' } }}>
      <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white', p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 0, backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <Button onClick={toggleSettings} sx={{ color: 'white', minWidth: 0, p: 1.25, bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ '& .MuiTab-root': { borderRadius: 0, textTransform: 'none', fontWeight: 600, minHeight: 56 } }}>
            <Tab label="Appearance" icon={<ColorLensIcon />} iconPosition="start" sx={{ gap: 1 }} />
            <Tab label="Privacy & Data" icon={<SecurityIcon />} iconPosition="start" sx={{ gap: 1 }} />
            <Tab label="About" icon={<InfoIcon />} iconPosition="start" sx={{ gap: 1 }} />
          </Tabs>
        </Box>

        <Box sx={{ minHeight: 500 }}>
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SystemIcon color="primary" />
                  Theme Mode
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose how you want the app to look. System mode automatically adapts to your device preferences.
                </Typography>
                <Stack spacing={2}>
                  {themeOptions.map((option) => (
                    <Card key={option.value} variant="outlined" sx={{ borderRadius: 0, cursor: 'pointer', border: themeMode === option.value ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                      bgcolor: themeMode === option.value ? alpha(theme.palette.primary.main, 0.08) : theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { bgcolor: themeMode === option.value ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.08), borderColor: themeMode === option.value ? theme.palette.primary.main : theme.palette.primary.light } }} onClick={() => handleThemeChange(option.value)}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Box sx={{ width: 56, height: 56, borderRadius: 0, backgroundColor: themeMode === option.value ? theme.palette.primary.main : option.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {React.cloneElement(option.icon, { sx: { fontSize: 28, color: 'white' } })}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>{option.label}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{option.description}</Typography>
                          </Box>
                          {themeMode === option.value && (
                            <Box sx={{ width: 32, height: 32, borderRadius: 0, backgroundColor: theme.palette.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CheckCircleIconMUI sx={{ fontSize: 20, color: 'white' }} />
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ColorLensIcon color="primary" />
                  Color Palette
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Material You dynamic color system with adaptive colors
                </Typography>
                <Stack spacing={2}>
                  {Object.entries(muiColorMap).map(([key]) => (
                    <Card key={key} variant="outlined" sx={{ borderRadius: 0, cursor: 'pointer', border: currentPalette === key ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                      bgcolor: currentPalette === key ? alpha(theme.palette.primary.main, 0.08) : theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { bgcolor: currentPalette === key ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.08), borderColor: currentPalette === key ? theme.palette.primary.main : theme.palette.primary.light } }} onClick={() => changePalette(key)}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Stack direction="row" spacing={1}>
                            <Box sx={{ width: 48, height: 56, borderRadius: 0, backgroundColor: theme.palette.mode === 'dark' ? muiColorMap[key].primary[400] : muiColorMap[key].primary[600] }} />
                            <Box sx={{ width: 24, height: 56, borderRadius: 0, backgroundColor: theme.palette.mode === 'dark' ? muiColorMap[key].secondary[400] : muiColorMap[key].secondary[600] }} />
                            <Box sx={{ width: 12, height: 56, borderRadius: 0, backgroundColor: theme.palette.mode === 'dark' ? pink[400] : pink[600] }} />
                          </Stack>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {/* Descriptive labels retained in original palette object; key names used here */}
                            </Typography>
                          </Box>
                          {currentPalette === key && (
                            <Box sx={{ width: 32, height: 32, borderRadius: 0, backgroundColor: theme.palette.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <Box key={index} sx={{ mb: 2, p: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', border: `2px solid ${colors[index]}`, borderRadius: 0 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box sx={{ width: 56, height: 56, borderRadius: 0, backgroundColor: colors[index], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {React.cloneElement(icons[index], { sx: { fontSize: 28, color: 'white' } })}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>{item.description}</Typography>
                        <Chip label={item.status} color="success" variant="filled" sx={{ borderRadius: 0, fontWeight: 700, fontSize: '0.75rem', height: 28 }} />
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
              <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'success.50', border: `2px solid ${theme.palette.success.main}`, borderRadius: 0 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ width: 56, height: 56, borderRadius: 0, backgroundColor: theme.palette.success.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StorageIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: 'success.main' }}>Zero Server Communication</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Your Instagram data never leaves your browser. Everything is processed locally using modern web technologies.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="primary" />
                About Peeksta
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Modern Instagram analytics dashboard built with privacy in mind.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', border: `2px solid ${theme.palette.warning.main}`, borderRadius: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 0, backgroundColor: theme.palette.warning.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UpdateIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.main' }}>Version Information</Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Current Version</Typography>
                        <Chip label={`v${appInfo.version}`} color="warning" variant="filled" sx={{ borderRadius: 0, fontWeight: 700, fontSize: '0.8rem' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Release Date</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{appInfo.releaseDate}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>License</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{appInfo.license}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', border: `2px solid ${theme.palette.secondary.main}`, borderRadius: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 0, backgroundColor: theme.palette.secondary.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CodeIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main' }}>Technology Stack</Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {appInfo.builtWith.map((tech) => (
                        <Chip key={tech} label={tech} size="small" color="secondary" variant="filled" sx={{ borderRadius: 0, fontWeight: 700, fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : alpha(theme.palette.primary.main, 0.05), border: `2px solid ${theme.palette.primary.main}`, borderRadius: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Box sx={{ width: 56, height: 56, borderRadius: 0, backgroundColor: theme.palette.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GitHubIcon sx={{ fontSize: 28, color: 'white' }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: 'primary.main' }}>Open Source Project</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
                            Peeksta is open source! View the code, report bugs, request features, or contribute.
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {appInfo.github}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button variant="contained" startIcon={<ArrowTopRightOnSquareIcon className="w-4 h-4" />} href={appInfo.github} target="_blank" rel="noopener noreferrer" sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 700, px: 4, py: 1.5, fontSize: '0.9rem' }}>
                        View on GitHub
                      </Button>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', border: `2px solid ${theme.palette.info.main}`, borderRadius: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 0, backgroundColor: theme.palette.info.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SpeedIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'info.main' }}>System Information</Typography>
                    </Stack>
                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Browser</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Platform</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{navigator.platform}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Resolution</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{screen.width} × {screen.height}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Color Depth</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{screen.colorDepth}-bit</Typography>
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

      <DialogActions sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100', borderTop: `2px solid ${theme.palette.primary.main}` }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
              {appInfo.name} v{appInfo.version}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              © 2024 {appInfo.author} • Made with ❤️ for Instagram users
            </Typography>
          </Box>
          <Button onClick={toggleSettings} variant="contained" sx={{ borderRadius: 0, px: 4, py: 1.5, fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Done
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

SettingsDialogModal.propTypes = {
  // component uses context only; kept for parity and future extension
};

export default SettingsDialogModal;


