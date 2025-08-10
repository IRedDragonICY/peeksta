import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Tooltip, Card, CardContent } from '@mui/material';

// Hoisted function to avoid TDZ when referenced in useMemo
function getColorByIndex(index, scheme, theme) {
  const colors = {
    primary: [
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.dark,
      theme.palette.secondary.main,
      theme.palette.secondary.light,
    ],
    gradient: [
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#f5576c',
      '#4facfe',
      '#00f2fe',
      '#43e97b',
      '#38f9d7',
      '#ffecd2',
      '#fcb69f',
    ],
  };

  const colorArray = colors[scheme] || colors.primary;
  return colorArray[index % colorArray.length];
}

function AdvancedBarChart({ 
  data, 
  height = 300, 
  title, 
  subtitle,
  xAxisLabel,
  yAxisLabel,
  showValues = true,
  interactive = true,
  colorScheme = 'primary',
  maxBars = 10
}) {
  const theme = useTheme();
  
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    // Sort and limit data
    const sorted = data.sort((a, b) => b.value - a.value).slice(0, maxBars);
    const maxValue = Math.max(...sorted.map(item => item.value));
    
    return sorted.map((item, index) => ({
      ...item,
      percentage: maxValue > 0 ? (item.value / maxValue) * 100 : 0,
      color: item.color || getColorByIndex(index, colorScheme, theme),
    }));
  }, [data, maxBars, colorScheme, theme]);

  if (!processedData.length) {
    return (
      <Card variant="outlined" sx={{ height }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="text.secondary">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

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

        {/* Chart Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Y-Axis Label */}
          {yAxisLabel && (
            <Typography 
              variant="caption" 
              sx={{ 
                transform: 'rotate(-90deg)', 
                position: 'absolute', 
                left: 8, 
                top: '50%',
                transformOrigin: 'center',
                color: 'text.secondary'
              }}
            >
              {yAxisLabel}
            </Typography>
          )}

          {/* Bars Container */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-around',
              height: '100%',
              px: 2,
              py: 1,
              gap: 1
            }}
          >
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
                    {item.subtitle && (
                      <Typography variant="caption" color="text.secondary">
                        {item.subtitle}
                      </Typography>
                    )}
                  </Box>
                }
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1,
                    maxWidth: '60px',
                    minWidth: '30px',
                    cursor: interactive ? 'pointer' : 'default',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': interactive ? {
                      transform: 'translateY(-2px)',
                      '& .bar': {
                        filter: 'brightness(1.1)',
                      }
                    } : {},
                  }}
                >
                  {/* Value Label */}
                  {showValues && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        mb: 0.5, 
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'center'
                      }}
                    >
                      {item.value > 999 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                    </Typography>
                  )}

                  {/* Bar */}
                  <Box
                    className="bar"
                    sx={{
                      width: '100%',
                      height: `${item.percentage}%`,
                      minHeight: item.value > 0 ? '4px' : '0px',
                      backgroundColor: item.color,
                      borderRadius: '4px 4px 0 0',
                      background: `linear-gradient(to top, ${item.color}, ${item.color}88)`,
                      position: 'relative',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow: theme.shadows[1],
                    }}
                  />

                  {/* Label */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 0.5, 
                      textAlign: 'center',
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      lineHeight: 1.2,
                      wordBreak: 'break-word',
                      maxWidth: '100%'
                    }}
                  >
                    {item.label.length > 8 ? `${item.label.substring(0, 6)}...` : item.label}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>

          {/* X-Axis Label */}
          {xAxisLabel && (
            <Typography 
              variant="caption" 
              sx={{ 
                textAlign: 'center', 
                mt: 1,
                color: 'text.secondary'
              }}
            >
              {xAxisLabel}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

AdvancedBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
      subtitle: PropTypes.string,
    })
  ).isRequired,
  height: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  showValues: PropTypes.bool,
  interactive: PropTypes.bool,
  colorScheme: PropTypes.oneOf(['primary', 'gradient']),
  maxBars: PropTypes.number,
};

export default AdvancedBarChart;
