import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Stack, Typography } from '@mui/material';

export default function KpiCard({ label, value, subtitle }) {
  const isNumber = typeof value === 'number' && isFinite(value);
  const displayValue = isNumber ? value.toLocaleString() : (value ?? '—');

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, overflow: 'hidden', borderColor: 'divider' }}>
      <Stack direction="column" spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {displayValue}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        )}
      </Stack>
    </Paper>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subtitle: PropTypes.string,
};


