import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';

function AdvancedPieChart({ 
  data, 
  height = 300, 
  title, 
  subtitle,
  showLegend = true,
  showValues = true,
  showPercentages = true,
  interactive = true,
  size = 160,
  strokeWidth = 20
}) {
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];
    
    let cumulativeAngle = 0;
    
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      
      cumulativeAngle += angle;
      
      return {
        ...item,
        percentage,
        angle,
        startAngle,
        endAngle,
        color: item.color || getColorByIndex(index, theme),
      };
    });
  }, [data, theme]);

  const getColorByIndex = (index, theme) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#f5576c',
    ];
    return colors[index % colors.length];
  };

  const getPath = (startAngle, endAngle, outerRadius, innerRadius = 0) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    const x1 = outerRadius + outerRadius * Math.cos(startAngleRad);
    const y1 = outerRadius + outerRadius * Math.sin(startAngleRad);
    const x2 = outerRadius + outerRadius * Math.cos(endAngleRad);
    const y2 = outerRadius + outerRadius * Math.sin(endAngleRad);
    
    if (innerRadius > 0) {
      // Donut chart
      const x3 = outerRadius + innerRadius * Math.cos(endAngleRad);
      const y3 = outerRadius + innerRadius * Math.sin(endAngleRad);
      const x4 = outerRadius + innerRadius * Math.cos(startAngleRad);
      const y4 = outerRadius + innerRadius * Math.sin(startAngleRad);
      
      return [
        "M", x1, y1,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
        "L", x3, y3,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
        "Z"
      ].join(" ");
    } else {
      // Pie chart
      return [
        "M", outerRadius, outerRadius,
        "L", x1, y1,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
        "Z"
      ].join(" ");
    }
  };

  if (!processedData.length) {
    return (
      <Card variant="outlined" sx={{ height }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="text.secondary">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const radius = size / 2;
  const innerRadius = strokeWidth ? radius - strokeWidth : 0;

  return (
    <Card variant="outlined" sx={{ height }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        {(title || subtitle) && (
          <Box sx={{ mb: 2 }}>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* Chart and Legend Container */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: showLegend ? 'space-between' : 'center',
          gap: 2
        }}>
          {/* SVG Chart */}
          <Box sx={{ position: 'relative' }}>
            <svg width={size} height={size} style={{ overflow: 'visible' }}>
              {processedData.map((item, index) => (
                <Tooltip
                  key={index}
                  title={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2">
                        Value: {item.value.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Percentage: {item.percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                  }
                  placement="top"
                  arrow
                >
                  <path
                    d={getPath(item.startAngle, item.endAngle, radius, innerRadius)}
                    fill={item.color}
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                    style={{
                      cursor: interactive ? 'pointer' : 'default',
                      transition: 'all 0.2s ease-in-out',
                      filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
                      transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                      transformOrigin: `${radius}px ${radius}px`,
                    }}
                    onMouseEnter={() => interactive && setHoveredIndex(index)}
                    onMouseLeave={() => interactive && setHoveredIndex(null)}
                  />
                </Tooltip>
              ))}
            </svg>

            {/* Center text for donut chart */}
            {innerRadius > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {processedData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total
                </Typography>
              </Box>
            )}
          </Box>

          {/* Legend */}
          {showLegend && (
            <Box sx={{ flexShrink: 0, maxWidth: '40%' }}>
              <List dense>
                {processedData.map((item, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      py: 0.5,
                      px: 0,
                      cursor: interactive ? 'pointer' : 'default',
                      borderRadius: 1,
                      '&:hover': interactive ? {
                        backgroundColor: 'action.hover',
                      } : {},
                    }}
                    onMouseEnter={() => interactive && setHoveredIndex(index)}
                    onMouseLeave={() => interactive && setHoveredIndex(null)}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CircleIcon sx={{ color: item.color, fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {showValues && (
                            <Typography variant="caption">
                              {item.value.toLocaleString()}
                            </Typography>
                          )}
                          {showPercentages && (
                            <Typography variant="caption" color="text.secondary">
                              {item.percentage.toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

AdvancedPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  height: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showLegend: PropTypes.bool,
  showValues: PropTypes.bool,
  showPercentages: PropTypes.bool,
  interactive: PropTypes.bool,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

export default AdvancedPieChart;
