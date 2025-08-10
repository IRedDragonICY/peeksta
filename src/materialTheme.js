import { createTheme } from '@mui/material/styles';
import {
  blue,
  cyan,
  teal,
  green,
  indigo,
  deepPurple,
  deepOrange,
  orange,
  pink,
  purple,
  amber
} from '@mui/material/colors';

// Map app palette keys to MUI color objects
const muiColorMap = {
  purple: { primary: deepPurple, secondary: blue },
  green: { primary: teal, secondary: green },
  orange: { primary: deepOrange, secondary: amber },
  pink: { primary: pink, secondary: purple },
  indigo: { primary: indigo, secondary: deepPurple },
};

function getMainShade(colorObj, mode) {
  if (!colorObj) return '#6750A4';
  // Use slightly deeper shade in dark mode for better contrast
  return mode === 'dark' ? colorObj[400] : colorObj[600] || colorObj[500];
}

export function createAppTheme({ mode = 'light', paletteKey = 'purple' } = {}) {
  const { primary: primaryColorObj, secondary: secondaryColorObj } =
    muiColorMap[paletteKey] || muiColorMap.purple;

  const primaryMain = getMainShade(primaryColorObj, mode);
  const secondaryMain = getMainShade(secondaryColorObj, mode);

  return createTheme({
    palette: {
      mode,
      primary: { main: primaryMain },
      secondary: { main: secondaryMain },
      background: {
        default: mode === 'dark' ? '#0B1020' : '#FAFAFD',
        paper: mode === 'dark' ? '#101528' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: 'Roboto, Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: -0.5 },
      h2: { fontWeight: 800, letterSpacing: -0.3 },
      h3: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 }, // Flat design - no shadows
        styleOverrides: {
          root: {
            borderRadius: 0, // Material Design You flat
            backgroundImage: 'none', // Remove MUI default gradients for cleaner look
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Flat design
            paddingInline: 16,
            paddingBlock: 10,
            textTransform: 'none',
            fontWeight: 600,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { color: 'transparent', elevation: 0 },
        styleOverrides: {
          root: {
            backdropFilter: 'saturate(180%) blur(12px)',
            backgroundColor: 'transparent',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Flat design
            backgroundImage: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 0, // Flat design for settings
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            borderRadius: '0 24px 24px 0', // Rounded right corners for modern look
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            marginLeft: 8,
            marginRight: 8,
            marginTop: 2,
            marginBottom: 2,
            '&:hover': {
              transform: 'translateX(4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            '&.Mui-selected': {
              backgroundColor: mode === 'dark' 
                ? `rgba(${primaryMain.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.12)`
                : `rgba(${primaryMain.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.08)`,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 4,
                height: 24,
                backgroundColor: primaryMain,
                borderRadius: '0 4px 4px 0',
              },
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'dark' ? 'rgba(55, 65, 81, 0.95)' : 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 12,
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
          arrow: {
            color: mode === 'dark' ? 'rgba(55, 65, 81, 0.95)' : 'rgba(17, 24, 39, 0.95)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Flat design
            '&:hover': {
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: 0, // Flat
              backgroundColor: primaryMain,
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Flat
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 64,
            fontSize: '0.875rem',
            '&.Mui-selected': {
              color: primaryMain,
              fontWeight: 800,
            },
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Flat design
            fontWeight: 600,
          },
        },
      },
    },
  });
}

export default createAppTheme;





