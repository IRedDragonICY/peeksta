import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Stack, Tooltip } from '@mui/material';
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

export default function SidebarRail() {
  const items = [
    { key: 'overview', icon: <DashboardIcon fontSize="small" />, label: 'Dashboard' },
    { key: 'connections', icon: <PeopleIcon fontSize="small" />, label: 'Connections' },
    { key: 'messages', icon: <ChatIcon fontSize="small" />, label: 'Messages' },
    { key: 'link-history', icon: <LinkIcon fontSize="small" />, label: 'Links' },
    { key: 'ads', icon: <CampaignIcon fontSize="small" />, label: 'Ads' },
    { key: 'apps', icon: <AppsIcon fontSize="small" />, label: 'Apps' },
    { key: 'insights', icon: <InsightsIcon fontSize="small" />, label: 'Insights' },
    { key: 'threads', icon: <ForumIcon fontSize="small" />, label: 'Threads' },
    { key: 'preferences', icon: <TuneIcon fontSize="small" />, label: 'Prefs' },
    { key: 'security', icon: <SecurityIcon fontSize="small" />, label: 'Security' },
    { key: 'personal', icon: <PersonIcon fontSize="small" />, label: 'Personal' },
  ];
  return (
    <Stack spacing={1} alignItems="center" sx={{ pt: 1 }}>
      {items.map((it) => (
        <Tooltip key={it.key} title={it.label} placement="right">
          <IconButton component="a" href={`#${it.key}`} size="small" sx={{ bgcolor: 'action.hover' }}>
            {it.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
}

SidebarRail.propTypes = {
  advanced: PropTypes.object,
};




