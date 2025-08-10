import PropTypes from 'prop-types';
import Section from '../components/common/Section.jsx';
import ComprehensiveAppsAnalysis from '../components/apps/ComprehensiveAppsAnalysis.jsx';

export default function AppsPage({ advanced }) {
  return (
    <Section id="apps" title="Apps & Websites" subtitle="Complete analysis of your connected apps and web activity">
      <ComprehensiveAppsAnalysis 
        activeApps={advanced.apps.active || []}
        expiredApps={advanced.apps.expired || []}
        offMetaActivity={advanced.apps.offMetaActivity || []}
        offMetaSettings={advanced.apps.offMetaSettings || {}}
      />
    </Section>
  );
}

AppsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};




