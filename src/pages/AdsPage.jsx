import PropTypes from 'prop-types';
import { Grid, Stack, Box, Typography, alpha } from '@mui/material';
import { Campaign as CampaignIcon } from '@mui/icons-material';
import BarChart from '../components/charts/BarChart.jsx';
import StatMini from '../components/common/StatMini.jsx';
import AdsTopicsPanel from '../components/ads/AdsTopicsPanel.jsx';

export default function AdsPage({ advanced, mode }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CampaignIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Ads & Topics</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Impressions and ad topics summary
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Top Ad Authors</Typography>
              <BarChart
                mode={mode}
                categories={(advanced.ads.topAuthors || []).slice(0, 10).map((a) => a.key)}
                values={(advanced.ads.topAuthors || []).slice(0, 10).map((a) => a.count)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Statistics</Typography>
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
        </Box>
      </Box>
    </Box>
  );
}

AdsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};
