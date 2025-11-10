import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography, Box, Chip, Grid, alpha } from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import KpiCard from '../components/overview/KpiCard.jsx';
import InsightsChart from '../components/charts/InsightsChart.jsx';

function RowMini({ primary, secondary }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="body2">{primary}</Typography>
      <Chip size="small" label={secondary} />
    </Box>
  );
}

RowMini.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
};

export default function OverviewPage({ advanced, mode }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DashboardIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Overview</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Key metrics and engagement insights
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Stack spacing={3}>
          {/* KPI Cards */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}><KpiCard label="Followers" value={advanced.followers.count} /></Grid>
            <Grid item xs={12} md={3}><KpiCard label="Following" value={advanced.following.count} /></Grid>
            <Grid item xs={12} md={3}><KpiCard label="Not Follow Back" value={advanced.notFollowingBack.length} /></Grid>
            <Grid item xs={12} md={3}><KpiCard label="Links Visited" value={advanced.linkHistory.count} /></Grid>
          </Grid>

          {/* Engagement Chart */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Engagement Over Time</Typography>
            <InsightsChart data={advanced.insights.posts} mode={mode} />
          </Box>

          {/* Top Link Domains */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Top Link Domains</Typography>
            <Stack spacing={0.75}>
              {advanced.linkHistory.topDomains.slice(0, 8).map((d) => {
                const k = typeof d.key === 'string' ? d.key : String(d.key);
                return <RowMini key={k} primary={k} secondary={`${d.count}`} />;
              })}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

OverviewPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};
