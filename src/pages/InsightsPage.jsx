import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Chip, Box, Typography, alpha } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import InsightsChart from '../components/charts/InsightsChart.jsx';

export default function InsightsPage({ advanced, mode }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Insights</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Content performance metrics and analytics
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Stack spacing={3}>
          {/* Statistics */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Performance Metrics</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip label={`Posts: ${advanced.insights.postsCount}`} />
              <Chip label={`Likes: ${advanced.insights.totals.likes}`} />
              <Chip label={`Comments: ${advanced.insights.totals.comments}`} />
              <Chip label={`Saves: ${advanced.insights.totals.saves}`} />
              <Chip label={`Avg likes: ${advanced.insights.avg.likes}`} />
            </Stack>
          </Box>

          {/* Chart */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Engagement Over Time</Typography>
            <InsightsChart data={advanced.insights.posts} mode={mode} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

InsightsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};
