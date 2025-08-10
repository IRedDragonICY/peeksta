import React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  DashboardOutlined as DashboardIcon,
  PeopleAltOutlined as PeopleIcon,
  ChatBubbleOutline as ChatIcon,
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  Apps as AppsIcon,
  Insights as InsightsIcon,
  Forum as ForumIcon,
  Tune as TuneIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  FolderZip as FolderZipIcon,
} from '@mui/icons-material';

const drawerWidth = 256;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: theme.spacing(1.5, 1),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const items = [
  { key: 'overview', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'datasets', label: 'Datasets', icon: <FolderZipIcon /> },
  { key: 'connections', label: 'Connections', icon: <PeopleIcon /> },
  { key: 'messages', label: 'Messages', icon: <ChatIcon /> },
  { key: 'link-history', label: 'Links', icon: <LinkIcon /> },
  { key: 'logged-information', label: 'Logged Info', icon: <AnalyticsIcon /> },
  { key: 'ads', label: 'Ads & Topics', icon: <CampaignIcon /> },
  { key: 'apps', label: 'Apps & Websites', icon: <AppsIcon /> },
  { key: 'insights', label: 'Insights', icon: <InsightsIcon /> },
  { key: 'threads', label: 'Threads', icon: <ForumIcon /> },
  { key: 'preferences', label: 'Preferences', icon: <TuneIcon /> },
  { key: 'security', label: 'Security', icon: <SecurityIcon /> },
  { key: 'personal', label: 'Personal Info', icon: <PersonIcon /> },
];

const STORAGE_KEY = 'peeksta_sidebar_open';

export default function MiniDrawer({ title, renderHeaderActions, activeSection, onSelect, children, isItemDisabled }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === null ? true : (v === '1' || v === 'true');
    } catch (_) {
      return true;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, open ? '1' : '0');
    } catch (_) {
      // ignore storage errors
    }
  }, [open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
            {!open && (
              <IconButton onClick={handleDrawerOpen} size="small">
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap sx={{ fontWeight: 800, opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 0.5 }}>
            <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen} size="small">
              {open ? (theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />) : <MenuIcon />}
            </IconButton>
            {renderHeaderActions?.()}
          </Box>
        </DrawerHeader>
        <Divider />
        <List>
          {items.map((it) => {
            const disabled = isItemDisabled?.(it.key) || false;
            return (
              <ListItem key={it.key} disablePadding sx={{ display: 'block', opacity: disabled ? 0.5 : 1 }}>
                <ListItemButton
                  disabled={disabled}
                  onClick={() => !disabled && onSelect?.(it.key)}
                  sx={[{ minHeight: 48, px: 2.5 }, open ? { justifyContent: 'initial' } : { justifyContent: 'center' }]}
                  selected={activeSection === it.key}
                >
                  <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, open ? { mr: 3 } : { mr: 'auto' }]}>
                    {it.icon}
                  </ListItemIcon>
                  <ListItemText primary={it.label} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        {children}
      </Box>
    </Box>
  );
}

MiniDrawer.propTypes = {
  title: PropTypes.string,
  renderHeaderActions: PropTypes.func,
  activeSection: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  children: PropTypes.node,
  isItemDisabled: PropTypes.func,
};


