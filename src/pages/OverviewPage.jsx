import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography, Box, Grid, alpha, LinearProgress, Avatar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Link as LinkIcon,
  TrendingUp as TrendingUpIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import InsightsChart from '../components/charts/InsightsChart.jsx';

// Modern KPI Card Component
function ModernKpiCard({ icon: Icon, label, value, color = 'primary.main', bgColor, onClick }) {
  const isNumber = typeof value === 'number' && isFinite(value);
  const displayValue = isNumber ? value.toLocaleString() : (value ?? '0');

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 3,
        transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: (theme) => onClick
            ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`
            : 'none',
        }
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Avatar
            sx={{
              bgcolor: bgColor || alpha(color, 0.1),
              color: color,
              width: 56,
              height: 56,
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1, color: color }}>
              {displayValue}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {label}
        </Typography>
      </Stack>
    </Box>
  );
}

ModernKpiCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  onClick: PropTypes.func,
};

// Domain Row Component
function DomainRow({ domain, count, maxCount, index }) {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const colors = ['#1976d2', '#dc004e', '#9c27b0', '#f57c00', '#388e3c', '#00acc1', '#7b1fa2', '#c62828'];
  const color = colors[index % colors.length];

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: alpha(color, 0.15),
              color: color,
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {index + 1}
          </Avatar>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {domain}
          </Typography>
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 700, color: color }}>
          {count}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: (theme) => alpha(theme.palette.action.hover, 0.5),
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: color,
          }
        }}
      />
    </Box>
  );
}

DomainRow.propTypes = {
  domain: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default function OverviewPage({ advanced, mode, onNavigateToConnections }) {
  const topDomains = advanced.linkHistory.topDomains.slice(0, 6);
  const maxCount = topDomains.length > 0 ? Math.max(...topDomains.map(d => d.count)) : 0;

  const handleNavigateToSection = (section) => {
    if (onNavigateToConnections) {
      onNavigateToConnections(section);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`, px: { xs: 3, md: 6 }, py: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DashboardIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Overview</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Key metrics and engagement insights
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', px: { xs: 3, md: 6 }, py: 3, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '1400px' }}>
          <Stack spacing={3}>
            {/* KPI Cards */}
            <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} lg={3}>
              <ModernKpiCard
                icon={PeopleIcon}
                label="Followers"
                value={advanced.followers.count}
                color="#1976d2"
                onClick={() => handleNavigateToSection('followers')}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <ModernKpiCard
                icon={PersonAddIcon}
                label="Following"
                value={advanced.following.count}
                color="#388e3c"
                onClick={() => handleNavigateToSection('following')}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <ModernKpiCard
                icon={PersonRemoveIcon}
                label="Not Follow Back"
                value={advanced.notFollowingBack.length}
                color="#f57c00"
                onClick={() => handleNavigateToSection('notBack')}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <ModernKpiCard
                icon={LinkIcon}
                label="Links Visited"
                value={advanced.linkHistory.count}
                color="#9c27b0"
              />
            </Grid>
          </Grid>

          {/* Two Column Layout */}
          <Grid container spacing={3}>
            {/* Engagement Chart */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Engagement Over Time</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Track your content performance
                    </Typography>
                  </Box>
                </Stack>
                <InsightsChart data={advanced.insights.posts} mode={mode} />
              </Box>
            </Grid>

            {/* Top Link Domains */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                      color: 'info.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <LanguageIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Top Domains</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Most visited websites
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ mt: 2 }}>
                  {topDomains.length > 0 ? (
                    topDomains.map((d, index) => {
                      const k = typeof d.key === 'string' ? d.key : String(d.key);
                      return (
                        <DomainRow
                          key={k}
                          domain={k}
                          count={d.count}
                          maxCount={maxCount}
                          index={index}
                        />
                      );
                    })
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No link history available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

OverviewPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  onNavigateToConnections: PropTypes.func,
};
