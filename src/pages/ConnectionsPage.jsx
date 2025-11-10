import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, alpha } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import PieChart from '../components/charts/PieChart.jsx';
import ConnectionsTables from '../components/connections/ConnectionsTables.jsx';

export default function ConnectionsPage({ advanced, initialSection }) {
  const theme = useTheme();
  const mode = theme.palette.mode === 'dark' ? 'dark' : 'light';

  // Map section names to tab indices
  const sectionToTabMap = {
    'followers': 0,
    'following': 1,
    'notBack': 2,
    'close': 3,
    'pending': 4,
    'recent': 5,
    'removed': 6,
    'unfollowed': 7,
  };

  const initialTab = initialSection ? sectionToTabMap[initialSection] : undefined;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <PeopleIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Connections</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Followers, following, and relationship insights
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Stack spacing={3}>
          {/* Connections Chart */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Connection Distribution</Typography>
            <PieChart
              title="Connections"
              mode={mode}
              height={550}
              data={[
                { name: 'Followers', value: advanced.followers.count || 0 },
                { name: 'Following', value: advanced.following.count || 0 },
                { name: 'Not Follow Back', value: (advanced.notFollowingBack || []).length },
                { name: 'Close friends', value: advanced.connectionsExtra.closeFriends || 0 },
                { name: 'Pending requests', value: advanced.connectionsExtra.pendingRequests || 0 },
                { name: 'Recent requests', value: advanced.connectionsExtra.recentRequests || 0 },
                { name: 'Removed suggestions', value: advanced.connectionsExtra.removedSuggestions || 0 },
                { name: 'Recently unfollowed', value: (advanced.recentlyUnfollowed || []).length },
              ]}
            />
          </Box>

          {/* People Lists */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>People</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Browse followers, following, not-follow-back and more
            </Typography>
            <ConnectionsTables data={advanced} initialTab={initialTab} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

ConnectionsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  initialSection: PropTypes.string,
};
