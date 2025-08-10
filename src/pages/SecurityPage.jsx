import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText } from '@mui/material';
import Section from '../components/common/Section.jsx';

export default function SecurityPage({ advanced }) {
  return (
    <Section id="security" title="Security & Logins" subtitle="Recent login activity">
      <List dense>
        {(advanced.security.logins || []).slice(0, 8).map((l, idx) => (
          <ListItemButton key={idx} divider>
            <ListItemText primary={`${l.ip || '-'} • ${l.lang || ''}`} secondary={`${new Date((l.time || 0) * 1000).toLocaleString()} • ${l.ua || ''}`} />
          </ListItemButton>
        ))}
      </List>
    </Section>
  );
}

SecurityPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};




