import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText } from '@mui/material';

export default function ActiveAppsList({ apps }) {
  return (
    <List dense>
      {(apps || []).slice(0, 10).map((a, idx) => (
        <ListItemButton key={idx} divider>
          <ListItemText primary={a.title || 'Unknown app'} secondary={`Added: ${a.addedAt ? new Date(a.addedAt * 1000).toLocaleDateString() : '-'} • Last active: ${a.lastActiveAt ? new Date(a.lastActiveAt * 1000).toLocaleDateString() : '-'}`} />
        </ListItemButton>
      ))}
    </List>
  );
}

ActiveAppsList.propTypes = {
  apps: PropTypes.array,
};




