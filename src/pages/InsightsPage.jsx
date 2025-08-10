import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Chip } from '@mui/material';
import Section from '../components/common/Section.jsx';
import InsightsChart from '../components/charts/InsightsChart.jsx';

export default function InsightsPage({ advanced, mode }) {
  return (
    <Section id="insights" title="Insights" subtitle="Content performance">
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        <Chip label={`Posts: ${advanced.insights.postsCount}`} />
        <Chip label={`Likes: ${advanced.insights.totals.likes}`} />
        <Chip label={`Comments: ${advanced.insights.totals.comments}`} />
        <Chip label={`Saves: ${advanced.insights.totals.saves}`} />
        <Chip label={`Avg likes: ${advanced.insights.avg.likes}`} />
      </Stack>
      <InsightsChart data={advanced.insights.posts} mode={mode} />
    </Section>
  );
}

InsightsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




