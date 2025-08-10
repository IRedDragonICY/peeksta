import React from 'react';
import PropTypes from 'prop-types';
import Section from '../components/common/Section.jsx';
import BarChart from '../components/charts/BarChart.jsx';

export default function LinkHistoryPage({ advanced, mode }) {
  return (
    <Section id="link-history" title="Link History" subtitle="Top domains visited">
      <BarChart
        mode={mode}
        categories={(advanced.linkHistory.topDomains || []).slice(0, 10).map((d) => (typeof d.key === 'string' ? d.key : String(d.key)))}
        values={(advanced.linkHistory.topDomains || []).slice(0, 10).map((d) => d.count)}
      />
    </Section>
  );
}

LinkHistoryPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




