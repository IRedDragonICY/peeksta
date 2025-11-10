import PropTypes from 'prop-types';
import { Box, Stack, Typography, Grid, alpha } from '@mui/material';
import { ChatBubble as ChatBubbleIcon } from '@mui/icons-material';
import BarChart from '../components/charts/BarChart.jsx';
import StatMini from '../components/common/StatMini.jsx';

export default function MessagesPage({ advanced, mode }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <ChatBubbleIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Messages</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Top conversations and messaging activity
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Top Conversations</Typography>
              <BarChart
                mode={mode}
                categories={(advanced.messages.topPeople || []).slice(0, 8).map((p) => p.name)}
                values={(advanced.messages.topPeople || []).slice(0, 8).map((p) => p.count)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Statistics</Typography>
              <Stack spacing={1}>
                <StatMini label="Messages" value={advanced.messages.messagesCount} />
                <StatMini label="Conversations" value={advanced.messages.conversationsCount} />
                <StatMini label="Reported" value={advanced.messagesExtra.reportedConversations} />
                <StatMini label="Secret" value={advanced.messagesExtra.secretConversations} />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

MessagesPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};
