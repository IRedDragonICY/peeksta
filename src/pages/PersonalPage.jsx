import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography, Chip, Box, alpha, Grid } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

export default function PersonalPage({ advanced }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <PersonIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Personal Info</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Profile information and about you
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3 }}>
        <Stack spacing={3}>
          {/* Profile Information */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Profile Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Username</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{advanced.profile?.username || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{advanced.profile?.name || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{advanced.profile?.email || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{advanced.profile?.phone || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Website</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{advanced.profile?.website || '-'}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Additional Information */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Additional Information</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip label={`Contacts synced: ${advanced.contacts.synced || 0}`} />
              <Chip label={`Locations of interest: ${advanced.infoAboutYou.locationsOfInterest || 0}`} />
              <Chip label={`Possible phone numbers: ${advanced.infoAboutYou.possiblePhoneNumbers || 0}`} />
              <Chip label={`Profile based in: ${advanced.infoAboutYou.profileBasedIn || '-'}`} />
              <Chip label={`Friend map entries: ${advanced.personalInfoDetails.friendMap || 0}`} />
              <Chip label={`Note interactions: ${advanced.personalInfoDetails.noteInteractions || 0}`} />
              <Chip label={`Profile changes: ${advanced.personalInfoDetails.profileChanges || 0}`} />
              <Chip label={`Cameras: ${advanced.cameras || 0}`} />
              <Chip label={`Devices: ${(advanced.devices || []).length}`} />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

PersonalPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};
