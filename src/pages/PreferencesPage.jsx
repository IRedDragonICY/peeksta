import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText, Stack, Chip } from '@mui/material';
import Section from '../components/common/Section.jsx';

export default function PreferencesPage({ advanced }) {
  return (
    <Section id="preferences" title="Preferences" subtitle="Notifications and settings">
      <List dense>
        {(advanced.preferences || []).slice(0, 12).map((p, idx) => (
          <ListItemButton key={idx} divider>
            <ListItemText primary={`${p.type}`} secondary={`${p.channel} • ${p.value}`} />
          </ListItemButton>
        ))}
      </List>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
        <Chip label={`Comments from: ${advanced.preferencesExtended.commentsAllowedFrom || '-'}`} />
        <Chip label={`Consents: ${advanced.preferencesExtended.consents || 0}`} />
        <Chip label={`Filtered keywords: ${advanced.preferencesExtended.filteredKeywords || 0}`} />
        <Chip label={`Cross-app messaging: ${advanced.preferencesExtended.crossAppMessaging || '-'}`} />
      </Stack>
    </Section>
  );
}

PreferencesPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};




