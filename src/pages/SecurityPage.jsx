import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText, Box, Stack, Typography, alpha } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

export default function SecurityPage({ advanced }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <SecurityIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Security & Logins</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Recent login activity and security events
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Login Activity</Typography>
          <List dense disablePadding>
            {(advanced.security.logins || []).slice(0, 8).map((l, idx) => (
              <ListItemButton key={idx} divider sx={{ borderRadius: 1 }}>
                <ListItemText
                  primary={`${l.ip || '-'} • ${l.lang || ''}`}
                  secondary={`${new Date((l.time || 0) * 1000).toLocaleString()} • ${l.ua || ''}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}

SecurityPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};
