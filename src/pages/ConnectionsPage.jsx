import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Section from '../components/common/Section.jsx';
import PieChart from '../components/charts/PieChart.jsx';
import ConnectionsTables from '../components/connections/ConnectionsTables.jsx';

export default function ConnectionsPage({ advanced }) {
  const theme = useTheme();
  const mode = theme.palette.mode === 'dark' ? 'dark' : 'light';

  return (
    <>
      <Section id="connections" title="Connections" subtitle="Followers vs Following vs Not Follow Back">
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Section>

      <Section id="connections-lists" title="People" subtitle="Browse followers/following/not-follow-back and more">
        <ConnectionsTables data={advanced} />
      </Section>
    </>
  );
}

ConnectionsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};




