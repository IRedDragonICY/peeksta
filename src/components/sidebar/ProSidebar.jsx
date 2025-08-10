import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Chip, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
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
} from '@mui/icons-material';

export default function ProSidebar({ advanced }) {
  const theme = useMuiTheme();
  const isDark = theme.palette.mode === 'dark';
  const groups = [
    {
      title: 'GENERAL',
      items: [
        { key: 'overview', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
        { key: 'connections', label: 'Connections', icon: <PeopleIcon fontSize="small" /> },
        { key: 'messages', label: 'Messages', icon: <ChatIcon fontSize="small" /> },
        { key: 'link-history', label: 'Links', icon: <LinkIcon fontSize="small" /> },
        { key: 'ads', label: 'Ads & Topics', icon: <CampaignIcon fontSize="small" /> },
        { key: 'apps', label: 'Apps & Websites', icon: <AppsIcon fontSize="small" /> },
        { key: 'insights', label: 'Insights', icon: <InsightsIcon fontSize="small" /> },
        { key: 'threads', label: 'Threads', icon: <ForumIcon fontSize="small" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'preferences', label: 'Preferences', icon: <TuneIcon fontSize="small" /> },
        { key: 'security', label: 'Security', icon: <SecurityIcon fontSize="small" /> },
        { key: 'personal', label: 'Personal Info', icon: <PersonIcon fontSize="small" /> },
      ],
    },
  ];
  const counts = {
    overview: advanced ? (advanced.notFollowingBack?.length || 0) : 0,
    connections: advanced ? (advanced.followers?.count || 0) : 0,
    messages: advanced ? (advanced.messages?.messagesCount || 0) : 0,
    'link-history': advanced ? (advanced.linkHistory?.count || 0) : 0,
    ads: advanced ? (advanced.ads?.impressionsCount || 0) : 0,
    apps: advanced ? (advanced.apps?.active?.length || 0) : 0,
    insights: advanced ? (advanced.insights?.postsCount || 0) : 0,
    threads: advanced ? (advanced.threads?.postsCount || 0) : 0,
    preferences: advanced ? (advanced.preferences?.length || 0) : 0,
    security: advanced ? (advanced.security?.logins?.length || 0) : 0,
    personal: advanced ? (advanced.contacts?.synced || 0) : 0,
  };
  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 3, px: 1.5, py: 2, height: '100%', overflow: 'auto' }}
    >
      {groups.map((g) => (
        <Box key={g.title} sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>{g.title}</Typography>
          <List dense>
            {g.items.map((it) => (
              <ListItemButton key={it.key} component="a" href={`#${it.key}`} sx={{ borderRadius: 2, my: 0.25 }}>
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: isDark ? 'primary.dark' : 'primary.light', color: 'primary.main' }}>
                    {it.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={it.label} />
                {!!counts[it.key] && <Chip size="small" label={counts[it.key]} />}
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
    </Paper>
  );
}

ProSidebar.propTypes = {
  advanced: PropTypes.object,
};




