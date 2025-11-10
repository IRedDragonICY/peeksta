import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText, Stack, Chip, Box, Typography, alpha } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

export default function PreferencesPage({ advanced }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <SettingsIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Preferences</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Notifications and account settings
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Stack spacing={3}>
          {/* Preference List */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Notification Settings</Typography>
            <List dense disablePadding>
              {(advanced.preferences || []).slice(0, 12).map((p, idx) => (
                <ListItemButton key={idx} divider sx={{ borderRadius: 1 }}>
                  <ListItemText primary={`${p.type}`} secondary={`${p.channel} • ${p.value}`} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Extended Settings */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Additional Settings</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip label={`Comments from: ${advanced.preferencesExtended.commentsAllowedFrom || '-'}`} />
              <Chip label={`Consents: ${advanced.preferencesExtended.consents || 0}`} />
              <Chip label={`Filtered keywords: ${advanced.preferencesExtended.filteredKeywords || 0}`} />
              <Chip label={`Cross-app messaging: ${advanced.preferencesExtended.crossAppMessaging || '-'}`} />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

PreferencesPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};




