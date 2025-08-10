import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper } from '@mui/material';
import ProSidebar from './ProSidebar';
import SidebarRail from './SidebarRail';

export default function AppSidebar({ open, advanced }) {
  const width = open ? 256 : 64;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        height: 'calc(100vh - 64px)',
        width: width,
        transition: 'width .25s ease',
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      <Box sx={{ position: 'sticky', top: 88 }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, height: 'calc(100vh - 96px)', p: open ? 1.5 : 1, overflow: 'auto' }}>
          {open ? <ProSidebar advanced={advanced} /> : <SidebarRail />}
        </Paper>
      </Box>
    </Box>
  );
}

AppSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  advanced: PropTypes.object,
};




