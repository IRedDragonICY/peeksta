import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText, Stack, Chip } from '@mui/material';
import Section from '../components/common/Section.jsx';

export default function ThreadsPage({ advanced, mode }) {
  return (
    <Section id="threads" title="Threads" subtitle="Activity on Threads">
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        <Chip label={`Posts: ${advanced.threads.postsCount}`} />
        <Chip label={`Liked: ${advanced.threads.likedCount}`} />
        <Chip label={`Viewed: ${advanced.threads.viewedCount}`} />
        <Chip label={`Followers: ${advanced.threadsExtra.followers}`} />
        <Chip label={`Following: ${advanced.threadsExtra.following}`} />
        <Chip label={`Drafts: ${advanced.threadsExtra.drafts}`} />
      </Stack>
      <List dense>
        {(advanced.threads.recentPosts || []).slice(0, 8).map((p, idx) => (
          <ListItemButton key={idx} divider>
            <ListItemText primary={p.title || 'Untitled'} secondary={new Date((p.timestamp || 0) * 1000).toLocaleString()} />
          </ListItemButton>
        ))}
      </List>
    </Section>
  );
}

ThreadsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




