import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';

export default function BarChart({ categories, values, mode }) {
  const themeText = mode === 'dark' ? '#E6EAF2' : '#101528';
  const option = {
    textStyle: { color: themeText },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: categories, axisLabel: { color: themeText } },
    yAxis: { type: 'value', axisLabel: { color: themeText } },
    series: [{ type: 'bar', data: values, itemStyle: { borderRadius: 6 } }],
    grid: { left: 24, right: 16, top: 24, bottom: 24, containLabel: true },
  };
  return (
    <Box sx={{ height: 260 }}>
      <ReactECharts option={option} style={{ height: 260, width: '100%' }} />
    </Box>
  );
}

BarChart.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




