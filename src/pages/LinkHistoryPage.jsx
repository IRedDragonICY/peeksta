import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, alpha } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import BarChart from '../components/charts/BarChart.jsx';

export default function LinkHistoryPage({ advanced, mode }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <LinkIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Link History</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Top domains visited from Instagram
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Most Visited Domains</Typography>
          <BarChart
            mode={mode}
            categories={(advanced.linkHistory.topDomains || []).slice(0, 10).map((d) => (typeof d.key === 'string' ? d.key : String(d.key)))}
            values={(advanced.linkHistory.topDomains || []).slice(0, 10).map((d) => d.count)}
          />
        </Box>
      </Box>
    </Box>
  );
}

LinkHistoryPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};
