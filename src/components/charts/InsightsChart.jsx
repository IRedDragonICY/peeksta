import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';

export default function InsightsChart({ data, mode }) {
  const themeText = mode === 'dark' ? '#E6EAF2' : '#101528';
  const themeGrid = mode === 'dark' ? '#1a2235' : '#f3f5fa';
  const x = (Array.isArray(data) ? data : []).map((d) => new Date(d.timestamp * 1000).toLocaleDateString());
  const likes = (Array.isArray(data) ? data : []).map((d) => d.likes);
  const comments = (Array.isArray(data) ? data : []).map((d) => d.comments);
  const saves = (Array.isArray(data) ? data : []).map((d) => d.saves);
  const option = {
    textStyle: { color: themeText },
    tooltip: { trigger: 'axis' },
    grid: { left: 32, right: 16, top: 24, bottom: 28, containLabel: true, backgroundColor: themeGrid, borderRadius: 12 },
    legend: { data: ['Likes', 'Comments', 'Saves'] },
    xAxis: { type: 'category', data: x, axisLabel: { color: themeText } },
    yAxis: { type: 'value', axisLabel: { color: themeText } },
    series: [
      { name: 'Likes', type: 'line', smooth: true, areaStyle: {}, data: likes },
      { name: 'Comments', type: 'line', smooth: true, areaStyle: {}, data: comments },
      { name: 'Saves', type: 'line', smooth: true, areaStyle: {}, data: saves },
    ],
  };
  return (
    <Box sx={{ height: 260 }}>
      <ReactECharts option={option} style={{ height: 260, width: '100%' }} opts={{ renderer: 'canvas' }} />
    </Box>
  );
}

InsightsChart.propTypes = {
  data: PropTypes.array,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};




