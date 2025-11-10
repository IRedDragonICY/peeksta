import PropTypes from 'prop-types';
import { Box, Stack, Typography, alpha } from '@mui/material';
import { Apps as AppsIcon } from '@mui/icons-material';
import ComprehensiveAppsAnalysis from '../components/apps/ComprehensiveAppsAnalysis.jsx';

export default function AppsPage({ advanced }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AppsIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Apps & Websites</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Complete analysis of your connected apps and web activity
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
          <ComprehensiveAppsAnalysis
            activeApps={advanced.apps.active || []}
            expiredApps={advanced.apps.expired || []}
            offMetaActivity={advanced.apps.offMetaActivity || []}
            offMetaSettings={advanced.apps.offMetaSettings || {}}
          />
        </Box>
      </Box>
    </Box>
  );
}

AppsPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};
