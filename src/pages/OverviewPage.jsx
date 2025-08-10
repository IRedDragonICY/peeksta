import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, Typography, Card, CardContent, Box, Chip } from '@mui/material';
import Section from '../components/common/Section.jsx';
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

export default function OverviewPage({ advanced, mode }) {
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}><KpiCard label="Followers" value={advanced.followers.count} /></Grid>
        <Grid item xs={12} md={3}><KpiCard label="Following" value={advanced.following.count} /></Grid>
        <Grid item xs={12} md={3}><KpiCard label="Not Follow Back" value={advanced.notFollowingBack.length} /></Grid>
        <Grid item xs={12} md={3}><KpiCard label="Links Visited" value={advanced.linkHistory.count} /></Grid>
      </Grid>
      <Section id="engagement" title="Engagement Over Time">
        <InsightsChart data={advanced.insights.posts} mode={mode} />
      </Section>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Top Link Domains</Typography>
          <Stack spacing={0.75}>
            {advanced.linkHistory.topDomains.slice(0, 8).map((d) => {
              const k = typeof d.key === 'string' ? d.key : String(d.key);
              return <RowMini key={k} primary={k} secondary={`${d.count}`} />;
            })}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

OverviewPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};


