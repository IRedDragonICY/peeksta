import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText, Stack, Chip, Box, Typography, alpha } from '@mui/material';
import { Forum as ForumIcon } from '@mui/icons-material';

export default function ThreadsPage({ advanced, mode }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <ForumIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Threads</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Activity on Threads platform
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Stack spacing={3}>
          {/* Statistics */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Activity Summary</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip label={`Posts: ${advanced.threads.postsCount}`} />
              <Chip label={`Liked: ${advanced.threads.likedCount}`} />
              <Chip label={`Viewed: ${advanced.threads.viewedCount}`} />
              <Chip label={`Followers: ${advanced.threadsExtra.followers}`} />
              <Chip label={`Following: ${advanced.threadsExtra.following}`} />
              <Chip label={`Drafts: ${advanced.threadsExtra.drafts}`} />
            </Stack>
          </Box>

          {/* Recent Posts */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Posts</Typography>
            <List dense disablePadding>
              {(advanced.threads.recentPosts || []).slice(0, 8).map((p, idx) => (
                <ListItemButton key={idx} divider sx={{ borderRadius: 1 }}>
                  <ListItemText primary={p.title || 'Untitled'} secondary={new Date((p.timestamp || 0) * 1000).toLocaleString()} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

ThreadsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




