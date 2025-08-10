import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';

export default function StatMini({ label, value, color }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: color }}>{Number(value).toLocaleString()}</Typography>
    </Paper>
  );
}

StatMini.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};




