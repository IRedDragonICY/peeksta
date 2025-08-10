import PropTypes from 'prop-types';
import { Grid, Stack } from '@mui/material';
import Section from '../components/common/Section.jsx';
import BarChart from '../components/charts/BarChart.jsx';
import StatMini from '../components/common/StatMini.jsx';
import AdsTopicsPanel from '../components/ads/AdsTopicsPanel.jsx';

export default function AdsPage({ advanced, mode }) {
  return (
    <Section id="ads" title="Ads & Topics" subtitle="Impressions and ad topics summary">
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <BarChart
            mode={mode}
            categories={(advanced.ads.topAuthors || []).slice(0, 10).map((a) => a.key)}
            values={(advanced.ads.topAuthors || []).slice(0, 10).map((a) => a.count)}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={1}>
            <StatMini label="Ad impressions" value={advanced.ads.impressionsCount} />
            <StatMini label="Posts viewed" value={advanced.adsTopics.postsViewed} />
            <StatMini label="Not interested (posts)" value={advanced.adsTopics.postsNotInterested} />
            <StatMini label="Not interested (profiles)" value={advanced.adsTopics.profilesNotInterested} />
            <StatMini label="Suggested profiles viewed" value={advanced.adsTopics.suggestedProfilesViewed} />
            <StatMini label="Videos watched" value={advanced.adsTopics.videosWatched} />
            <StatMini label="In-app messages" value={advanced.adsTopics.inAppMessages} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AdsTopicsPanel adsBusiness={advanced.adsBusiness} topics={advanced.topics} details={advanced.adsDetails} />
        </Grid>
      </Grid>
    </Section>
  );
}

AdsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




