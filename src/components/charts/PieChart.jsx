import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Stack, 
  Chip, 
  Paper,
  Grid,
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';
import { alpha } from '@mui/material/styles';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Favorite as FavoriteIcon,
  Schedule as ScheduleIcon,
  Block as BlockIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

// Get icon for connection type
function getConnectionIcon(name) {
  const iconMap = {
    'Followers': PeopleIcon,
    'Following': PersonAddIcon,
    'Not Follow Back': PersonRemoveIcon,
    'Close friends': FavoriteIcon,
    'Pending requests': ScheduleIcon,
    'Recent requests': ScheduleIcon,
    'Removed suggestions': BlockIcon,
    'Recently unfollowed': PersonRemoveIcon,
  };
  return iconMap[name] || GroupsIcon;
}

// Get color for connection type
function getConnectionColor(name) {
  const colorMap = {
    'Followers': '#1976d2',      // Primary blue
    'Following': '#9c27b0',      // Purple
    'Not Follow Back': '#d32f2f', // Red
    'Close friends': '#ff9800',   // Orange
    'Pending requests': '#2196f3', // Light blue
    'Recent requests': '#00bcd4',  // Cyan
    'Removed suggestions': '#f44336', // Red
    'Recently unfollowed': '#e91e63', // Pink
  };
  return colorMap[name] || '#757575';
}

export default function PieChart({ title, data, mode, height = 400 }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  
  // Filter out zero values and prepare data
  const validData = useMemo(() => {
    return (data || [])
      .filter(d => d.value > 0)
      .map((d, idx) => ({
        id: idx,
        label: d.name,
        value: d.value,
        color: getConnectionColor(d.name),
      }));
  }, [data]);

  const totalConnections = useMemo(() => {
    return validData.reduce((sum, item) => sum + item.value, 0);
  }, [validData]);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      setWidth(el.clientWidth);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  if (validData.length === 0) {
    return (
      <Paper 
        variant="outlined" 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 3,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'grey.100', color: 'grey.500', width: 64, height: 64 }}>
            <GroupsIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            No connection data available
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (validData.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'grey.100', color: 'grey.500', width: 64, height: 64 }}>
            <GroupsIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            No connection data available
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ minHeight: Math.max(height || 500, 500) }}>
      {/* Chart Section */}
      <Grid 
        item 
        xs={12} 
        md={7} 
        sx={{ 
          position: 'relative',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: 400,
        }}
        ref={containerRef}
      >
        {/* Chart Container with centered positioning */}
        <Box 
          sx={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MuiPieChart
            height={360}
            width={Math.min(Math.max(300, width * 0.8), 360)}
            series={[
              {
                data: validData,
                innerRadius: '45%',
                outerRadius: '75%',
                paddingAngle: 3,
                cornerRadius: 8,
                startAngle: -90,
                endAngle: 270,
                arcLabel: (item) => (item.value > 100 ? item.value.toLocaleString() : ''),
                arcLabelMinAngle: 20,
                valueFormatter: (item) => `${item.value.toLocaleString()} (${((item.value / totalConnections) * 100).toFixed(1)}%)`,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { 
                  additionalRadius: -10, 
                  innerRadius: '45%',
                  color: (theme.palette.mode === 'dark' ? '#ffffff30' : '#00000030'),
                },
              },
            ]}
            colors={validData.map(d => d.color)}
            slotProps={{ 
              legend: { hidden: true },
              pieArc: {
                style: {
                  stroke: theme.palette.background.paper,
                  strokeWidth: 2,
                },
              },
            }}
            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            skipAnimation={false}
          />
          
          {/* Center Text - positioned absolutely in the center of the donut */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 1000,
              pointerEvents: 'none',
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900,
                color: 'primary.main',
                lineHeight: 0.9,
                mb: 0.5,
                fontSize: { xs: '2.2rem', sm: '2.8rem' },
              }}
            >
              {totalConnections.toLocaleString()}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: 1.5,
                fontSize: '0.7rem',
              }}
            >
              TOTAL CONNECTIONS
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Legend Section */}
      <Grid item xs={12} md={5}>
        <Box sx={{ py: 2, minHeight: 400 }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TrendingUpIcon color="primary" />
                Connection Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distribution of your Instagram connections
              </Typography>
            </Box>

            <List dense sx={{ flexGrow: 1, mb: 2 }}>
              {validData
                .sort((a, b) => b.value - a.value)
                .map((item, index) => {
                  const Icon = getConnectionIcon(item.label);
                  const percentage = ((item.value / totalConnections) * 100).toFixed(1);
                  
                  return (
                    <React.Fragment key={item.id}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar sx={{ minWidth: 44 }}>
                          <Avatar
                            sx={{
                              bgcolor: item.color,
                              color: 'white',
                              width: 36,
                              height: 36,
                            }}
                          >
                            <Icon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.label}
                            </Typography>
                          }
                          secondary={
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                              <Chip
                                label={item.value.toLocaleString()}
                                size="small"
                                sx={{
                                  bgcolor: alpha(item.color, 0.1),
                                  color: item.color,
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  height: 22,
                                  '& .MuiChip-label': {
                                    px: 1,
                                    fontSize: '0.75rem',
                                  },
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {percentage}%
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                      {index < validData.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  );
                })}
            </List>

            {/* Summary Stats */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                mt: 'auto',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Quick Stats
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Largest segment:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {validData[0]?.label || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Categories:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {validData.length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}

PieChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.number })).isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  height: PropTypes.number,
};


