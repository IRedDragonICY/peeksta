import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography, Chip } from '@mui/material';
import Section from '../components/common/Section.jsx';

export default function PersonalPage({ advanced }) {
  return (
    <Section id="personal" title="Personal Info" subtitle="Profile and about you">
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="body2">Username: {advanced.profile?.username || '-'}</Typography>
        <Typography variant="body2">Name: {advanced.profile?.name || '-'}</Typography>
        <Typography variant="body2">Email: {advanced.profile?.email || '-'}</Typography>
        <Typography variant="body2">Phone: {advanced.profile?.phone || '-'}</Typography>
        <Typography variant="body2">Website: {advanced.profile?.website || '-'}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
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
    </Section>
  );
}

PersonalPage.propTypes = {
  advanced: PropTypes.object.isRequired,
};




