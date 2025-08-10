import PropTypes from 'prop-types';
import { Grid, Stack } from '@mui/material';
import Section from '../components/common/Section.jsx';
import BarChart from '../components/charts/BarChart.jsx';
import StatMini from '../components/common/StatMini.jsx';

export default function MessagesPage({ advanced, mode }) {
  return (
    <Section id="messages" title="Messages" subtitle="Top conversations">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <BarChart
            mode={mode}
            categories={(advanced.messages.topPeople || []).slice(0, 8).map((p) => p.name)}
            values={(advanced.messages.topPeople || []).slice(0, 8).map((p) => p.count)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <StatMini label="Messages" value={advanced.messages.messagesCount} />
            <StatMini label="Conversations" value={advanced.messages.conversationsCount} />
            <StatMini label="Reported" value={advanced.messagesExtra.reportedConversations} />
            <StatMini label="Secret" value={advanced.messagesExtra.secretConversations} />
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}

MessagesPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




