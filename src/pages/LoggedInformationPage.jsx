import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Tabs,
  Tab,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  LinearProgress,
  Avatar,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  AlertTitle,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Link as LinkIcon,
  Insights as InsightsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  PlayArrow as PlayArrowIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import Section from '../components/common/Section.jsx';
import KpiCard from '../components/overview/KpiCard.jsx';
import BarChart from '../components/charts/BarChart.jsx';
import PieChart from '../components/charts/PieChart.jsx';
import AdvancedBarChart from '../components/charts/AdvancedBarChart.jsx';
import AdvancedPieChart from '../components/charts/AdvancedPieChart.jsx';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`logged-info-tabpanel-${index}`}
      aria-labelledby={`logged-info-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Audience Demographics Component
function AudienceDemographics({ audienceData }) {
  if (!audienceData || !audienceData.organic_insights_audience || audienceData.organic_insights_audience.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>No Audience Data</AlertTitle>
        Audience insights data is not available in your Instagram export.
      </Alert>
    );
  }

  const data = audienceData.organic_insights_audience[0]?.string_map_data || {};
  
  // Parse demographics data
  const totalFollowers = data['Followers']?.value || '0';
  const followersDelta = data['Followers Delta']?.value || 'No change';
  const dateRange = data['Date Range']?.value || 'Unknown period';
  
  // Gender distribution
  const menPercentage = parseFloat(data['Total Follower Percentage for Men']?.value?.replace('%', '') || 0);
  const womenPercentage = parseFloat(data['Total Follower Percentage for Women']?.value?.replace('%', '') || 0);
  
  // Top countries
  const countriesData = data['Follower Percentage by Country']?.value || '';
  const citiesData = data['Follower Percentage by City']?.value || '';
  
  // Parse countries and cities
  const countries = countriesData.split(', ').map(item => {
    const [name, percentage] = item.split(': ');
    return { name, value: parseFloat(percentage?.replace('%', '') || 0) };
  }).filter(item => item.name && item.value > 0);
  
  const cities = citiesData.split(', ').map(item => {
    const [name, percentage] = item.split(': ');
    return { name, value: parseFloat(percentage?.replace('%', '') || 0) };
  }).filter(item => item.name && item.value > 0);

  // Age distribution
  const ageData = data['Follower Percentage by Age for All Genders']?.value || '';
  const ages = ageData.split(', ').map(item => {
    const [range, percentage] = item.split(': ');
    return { range, value: parseFloat(percentage?.replace('%', '') || 0) };
  }).filter(item => item.range && item.value > 0);

  return (
    <Grid container spacing={3}>
      {/* Overview Cards */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="Total Followers" 
              value={totalFollowers}
              subtitle={followersDelta}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="Analysis Period" 
              value={dateRange}
              subtitle="Date Range"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="New Follows" 
              value={data['Follows']?.value || '0'}
              subtitle={`${data['Unfollows']?.value || '0'} unfollows`}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="Net Change" 
              value={data['Overall followers']?.value || '0'}
              subtitle="Follower Growth"
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Gender Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              Gender Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedPieChart
                data={[
                  { label: 'Men', value: menPercentage, color: '#1976d2' },
                  { label: 'Women', value: womenPercentage, color: '#d32f2f' },
                ]}
                height={300}
                showPercentages={true}
                interactive={true}
                size={160}
                strokeWidth={20}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Age Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              Age Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedBarChart
                data={ages.map(age => ({ label: age.range, value: age.value }))}
                height={300}
                yAxisLabel="Percentage (%)"
                xAxisLabel="Age Groups"
                colorScheme="gradient"
                showValues={true}
                interactive={true}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Geographic Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon color="primary" />
              Top Countries
            </Typography>
            <List dense>
              {countries.slice(0, 5).map((country, index) => (
                <React.Fragment key={country.name}>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={country.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={country.value} 
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" sx={{ minWidth: 35 }}>
                            {country.value}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < countries.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Cities */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon color="primary" />
              Top Cities
            </Typography>
            <List dense>
              {cities.slice(0, 5).map((city, index) => (
                <React.Fragment key={city.name}>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={city.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={city.value} 
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" sx={{ minWidth: 35 }}>
                            {city.value}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < cities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Activity Times */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon color="primary" />
              Follower Activity by Day
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedBarChart
                data={[
                  { label: 'Mon', value: parseInt(data['Monday Follower Activity']?.value || 0) },
                  { label: 'Tue', value: parseInt(data['Tuesday Follower Activity']?.value || 0) },
                  { label: 'Wed', value: parseInt(data['Wednesday Follower Activity']?.value || 0) },
                  { label: 'Thu', value: parseInt(data['Thursday Follower Activity']?.value || 0) },
                  { label: 'Fri', value: parseInt(data['Friday Follower Activity']?.value || 0) },
                  { label: 'Sat', value: parseInt(data['Saturday Follower Activity']?.value || 0) },
                  { label: 'Sun', value: parseInt(data['Sunday Follower Activity']?.value || 0) },
                ]}
                height={300}
                yAxisLabel="Active Followers"
                xAxisLabel="Day of Week"
                colorScheme="primary"
                showValues={true}
                interactive={true}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// Content Interactions Analysis
function ContentInteractions({ interactionsData }) {
  if (!interactionsData || !interactionsData.organic_insights_interactions || interactionsData.organic_insights_interactions.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>No Interaction Data</AlertTitle>
        Content interaction insights are not available in your Instagram export.
      </Alert>
    );
  }

  const data = interactionsData.organic_insights_interactions[0]?.string_map_data || {};
  
  const interactions = [
    { label: 'Post Likes', value: parseInt(data['Post Likes']?.value || 0), icon: ThumbUpIcon, color: '#1976d2' },
    { label: 'Post Comments', value: parseInt(data['Post Comments']?.value || 0), icon: CommentIcon, color: '#388e3c' },
    { label: 'Post Shares', value: parseInt(data['Post Shares']?.value || 0), icon: ShareIcon, color: '#f57c00' },
    { label: 'Post Saves', value: parseInt(data['Post Saves']?.value || 0), icon: BookmarkIcon, color: '#7b1fa2' },
  ];

  const reelsInteractions = [
    { label: 'Reels Likes', value: parseInt(data['Reels Likes']?.value || 0), icon: ThumbUpIcon, color: '#1976d2' },
    { label: 'Reels Comments', value: parseInt(data['Reels Comments']?.value || 0), icon: CommentIcon, color: '#388e3c' },
    { label: 'Reels Shares', value: parseInt(data['Reels Shares']?.value || 0), icon: ShareIcon, color: '#f57c00' },
    { label: 'Reels Saves', value: parseInt(data['Reels Saves']?.value || 0), icon: BookmarkIcon, color: '#7b1fa2' },
  ];

  return (
    <Grid container spacing={3}>
      {/* Overview Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="Total Interactions" 
              value={data['Content Interactions']?.value || '0'}
              subtitle={data['Content Interactions Delta']?.value || 'No change'}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="Post Interactions" 
              value={data['Post Interactions']?.value || '0'}
              subtitle={data['Post Interactions Delta']?.value || 'No change'}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="Reels Interactions" 
              value={data['Reels Interactions']?.value || '0'}
              subtitle={data['Reels Interactions Delta']?.value || 'No change'}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard 
              label="Accounts Engaged" 
              value={data['Accounts engaged']?.value || '0'}
              subtitle={data['Accounts Engaged Delta']?.value || 'No change'}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Post Interactions Breakdown */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InsightsIcon color="primary" />
              Post Interactions Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedBarChart
                data={interactions.map(i => ({ 
                  label: i.label.replace('Post ', ''), 
                  value: i.value,
                  color: i.color 
                }))}
                height={300}
                yAxisLabel="Interactions"
                xAxisLabel="Interaction Type"
                showValues={true}
                interactive={true}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Reels Interactions Breakdown */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlayArrowIcon color="primary" />
              Reels Interactions Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedBarChart
                data={reelsInteractions.map(i => ({ 
                  label: i.label.replace('Reels ', ''), 
                  value: i.value,
                  color: i.color 
                }))}
                height={300}
                yAxisLabel="Interactions"
                xAxisLabel="Interaction Type"
                showValues={true}
                interactive={true}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Engagement Type Distribution */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" />
              Engagement Analysis
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[...interactions, ...reelsInteractions].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        borderRadius: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <IconComponent sx={{ fontSize: 40, color: item.color, mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.value.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            
            {/* Engagement Insights */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Engagement Insights
              </Typography>
              <Stack spacing={1}>
                <Chip 
                  label={`Follower vs Non-follower Engagement: ${data['Engaged Account By Follow Type']?.value || 'N/A'}`}
                  variant="outlined" 
                  sx={{ alignSelf: 'flex-start' }}
                />
                <Chip 
                  label={`Story Interactions: ${data['Story Interactions']?.value || '0'} (${data['Story Interactions Delta']?.value || 'No change'})`}
                  variant="outlined" 
                  sx={{ alignSelf: 'flex-start' }}
                />
                <Chip 
                  label={`Story Replies: ${data['Story Replies']?.value || '0'}`}
                  variant="outlined" 
                  sx={{ alignSelf: 'flex-start' }}
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// Link History Enhanced Analysis
function LinkHistoryAnalysis({ linkHistoryData, mode }) {
  if (!linkHistoryData || !Array.isArray(linkHistoryData) || linkHistoryData.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>No Link History</AlertTitle>
        Link history data is not available in your Instagram export.
      </Alert>
    );
  }

  // Normalize link items: support either raw JSON (with label_values) or processed items (with url/domain)
  const processedLinks = linkHistoryData
    .map((item) => {
      // Processed shape from parser
      if (item?.url) {
        const domain = item.domain || (item.url ? new URL(item.url).hostname : '');
        return {
          url: item.url,
          title: item.title || domain,
          startTime: item.startTime || '',
          endTime: item.endTime || '',
          timestamp: item.timestamp || 0,
          domain,
        };
      }

      // Raw shape from export
      const url = item?.label_values?.find((lv) => lv.label?.toLowerCase().includes('website link'))?.value || '';
      const title = item?.label_values?.find((lv) => lv.label?.toLowerCase().includes('title'))?.value || '';
      const startTime = item?.label_values?.find((lv) => lv.label?.toLowerCase().includes('start time'))?.value || '';
      const endTime = item?.label_values?.find((lv) => lv.label?.toLowerCase().includes('end time'))?.value || '';
      const domain = url ? new URL(url).hostname : '';
      return {
        url,
        title: title || domain,
        startTime,
        endTime,
        timestamp: item?.timestamp || 0,
        domain,
      };
    })
    .filter((link) => Boolean(link.url));

  // Domain analysis
  const domainCounts = {};
  processedLinks.forEach((link) => {
    if (link.domain) {
      domainCounts[link.domain] = (domainCounts[link.domain] || 0) + 1;
    }
  });

  const topDomains = Object.entries(domainCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([domain, count]) => ({ domain, count }));

  const mostVisited = topDomains[0]?.domain || 'N/A';
  const mostVisitedCount = topDomains[0]?.count || 0;

  return (
    <Grid container spacing={3}>
      {/* Overview */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <KpiCard label="Total Links Visited" value={processedLinks.length} subtitle="External websites" />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard label="Unique Domains" value={Object.keys(domainCounts).length} subtitle="Different websites" />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard label="Most Visited" value={mostVisited} subtitle={`${mostVisitedCount} visits`} />
          </Grid>
        </Grid>
      </Grid>

      {/* Top Domains Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon color="primary" />
              Top Visited Domains
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedBarChart
                data={topDomains.map((d) => ({ label: d.domain, value: d.count, subtitle: `${d.count} visit${d.count !== 1 ? 's' : ''}` }))}
                height={300}
                yAxisLabel="Visit Count"
                xAxisLabel="Domain"
                colorScheme="gradient"
                showValues={true}
                interactive={true}
                maxBars={8}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Domain Distribution */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon color="primary" />
              Domain Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedPieChart
                data={topDomains.slice(0, 5).map((domain, index) => ({
                  label: domain.domain,
                  value: domain.count,
                  color: `hsl(${index * 72}, 70%, 50%)`,
                }))}
                height={300}
                showPercentages={true}
                showValues={true}
                interactive={true}
                size={180}
                strokeWidth={30}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Links */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon color="primary" />
              Recent Links Visited
            </Typography>
            <List>
              {processedLinks.slice(0, 10).map((link, index) => (
                <React.Fragment key={`${link.url}-${index}`}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <LinkIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={<Typography variant="subtitle2" component="div" sx={{ fontWeight: 600 }}>{link.title || link.domain}</Typography>}
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" component="div" color="text.secondary" noWrap>
                            {link.url}
                          </Typography>
                          <Typography variant="caption" component="div" color="text.secondary">
                            Visited: {link.startTime || new Date(link.timestamp * 1000).toLocaleString()} {link.endTime ? `• Until: ${link.endTime}` : ''}
                          </Typography>
                          <Chip label={link.domain} size="small" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < processedLinks.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// Profile Searches Analysis
function ProfileSearches({ searchData }) {
  if (!searchData || !searchData.searches_user || !Array.isArray(searchData.searches_user) || searchData.searches_user.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>No Search Data</AlertTitle>
        Profile search data is not available in your Instagram export.
      </Alert>
    );
  }

  const searches = searchData.searches_user.map(search => ({
    query: search.string_map_data?.Search?.value || '',
    timestamp: search.string_map_data?.Time?.timestamp || 0,
    time: search.string_map_data?.Time?.value || '',
  })).filter(search => search.query);

  // Count search frequency
  const searchCounts = {};
  searches.forEach(search => {
    searchCounts[search.query] = (searchCounts[search.query] || 0) + 1;
  });

  const topSearches = Object.entries(searchCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  return (
    <Grid container spacing={3}>
      {/* Overview */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <KpiCard 
              label="Total Searches" 
              value={searches.length}
              subtitle="Profile searches"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard 
              label="Unique Profiles" 
              value={Object.keys(searchCounts).length}
              subtitle="Different users searched"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard 
              label="Most Searched" 
              value={topSearches[0]?.query || 'N/A'}
              subtitle={`${topSearches[0]?.count || 0} times`}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Top Searches */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon color="primary" />
              Most Searched Profiles
            </Typography>
            <Box sx={{ mt: 2 }}>
              <AdvancedBarChart
                data={topSearches.map(s => ({ 
                  label: s.query, 
                  value: s.count,
                  subtitle: `${s.count} search${s.count !== 1 ? 'es' : ''}`
                }))}
                height={300}
                yAxisLabel="Search Count"
                xAxisLabel="Profile"
                colorScheme="primary"
                showValues={true}
                interactive={true}
                maxBars={8}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Search Frequency Distribution */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Patterns
            </Typography>
            <List dense>
              {topSearches.slice(0, 8).map((search, index) => (
                <React.Fragment key={search.query}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {search.query.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary={`@${search.query}`}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(search.count / topSearches[0].count) * 100} 
                            sx={{ flexGrow: 1, height: 4, borderRadius: 2 }}
                          />
                          <Typography variant="caption">
                            {search.count}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < topSearches.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Searches */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon color="primary" />
              Recent Search History
            </Typography>
            <List>
              {searches.slice(0, 15).map((search, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <SearchIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`@${search.query}`}
                      secondary={search.time || new Date(search.timestamp * 1000).toLocaleString()}
                    />
                  </ListItem>
                  {index < searches.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// Media Upload Settings Component
function MediaUploadSettings({ includeMedia, onToggleMedia, mediaCount }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityIcon color="primary" />
          Media Display Settings
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={includeMedia}
                onChange={(e) => onToggleMedia(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">Include Media in Analysis</Typography>
                <Typography variant="body2" color="text.secondary">
                  {includeMedia 
                    ? `Displaying media content (${mediaCount || 0} items). This may use more bandwidth.`
                    : 'Media content is hidden to save bandwidth. Toggle to show images and videos.'
                  }
                </Typography>
              </Box>
            }
          />
          {!includeMedia && (
            <Alert severity="info" sx={{ mt: 1 }}>
              <AlertTitle>Bandwidth Saving Mode</AlertTitle>
              Media content is currently hidden. Enable to view post images, videos, and other media content in your analysis.
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

MediaUploadSettings.propTypes = {
  includeMedia: PropTypes.bool.isRequired,
  onToggleMedia: PropTypes.func.isRequired,
  mediaCount: PropTypes.number,
};

export default function LoggedInformationPage({ advanced, mode }) {
  const [tabValue, setTabValue] = useState(0);
  const [includeMedia, setIncludeMedia] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  // Process logged information data
  const loggedData = useMemo(() => {
    if (!advanced || !advanced.loggedInformation) {
      console.log('No advanced data or loggedInformation:', { advanced: !!advanced, loggedInfo: advanced?.loggedInformation });
      return null;
    }
    console.log('LoggedInformationPage received data:', advanced.loggedInformation);
    return advanced.loggedInformation;
  }, [advanced]);

  // Filter data based on search term and date range
  const filteredData = useMemo(() => {
    if (!loggedData) return null;

    const now = new Date();
    const getDateThreshold = (range) => {
      switch (range) {
        case 'week':
          return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case '3months':
          return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        case 'year':
          return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return null;
      }
    };

    const dateThreshold = getDateThreshold(dateRange);
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filterByDate = (item) => {
      if (!dateThreshold) return true;
      const itemDate = new Date(item.timestamp * 1000);
      return itemDate >= dateThreshold;
    };

    const filterBySearch = (item, searchFields) => {
      if (!searchTerm) return true;
      return searchFields.some(field => 
        field && field.toLowerCase().includes(lowerSearchTerm)
      );
    };

    // Filter link history
    let filteredLinkHistory = loggedData.linkHistory?.data || [];
    if (searchTerm || dateRange !== 'all') {
      filteredLinkHistory = filteredLinkHistory.filter(item => {
        const matchesDate = filterByDate(item);
        const matchesSearch = filterBySearch(item, [item.url, item.title, item.domain]);
        return matchesDate && matchesSearch;
      });
    }

    // Filter profile searches
    let filteredProfileSearches = loggedData.profileSearches?.data?.searches_user || [];
    if (searchTerm || dateRange !== 'all') {
      filteredProfileSearches = filteredProfileSearches.filter(item => {
        const matchesDate = filterByDate({ timestamp: item.string_map_data?.Time?.timestamp });
        const matchesSearch = filterBySearch(item, [item.string_map_data?.Search?.value]);
        return matchesDate && matchesSearch;
      });
    }

    return {
      ...loggedData,
      linkHistory: {
        ...loggedData.linkHistory,
        data: filteredLinkHistory
      },
      profileSearches: {
        ...loggedData.profileSearches,
        data: { ...loggedData.profileSearches?.data, searches_user: filteredProfileSearches }
      }
    };
  }, [loggedData, searchTerm, dateRange]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleToggleMedia = (enabled) => {
    setIncludeMedia(enabled);
  };

  if (!advanced) {
    return (
      <Alert severity="warning">
        <AlertTitle>No Data Available</AlertTitle>
        Please upload your Instagram data export to view logged information analysis.
      </Alert>
    );
  }

  return (
    <Section 
      id="logged-information" 
      title="Logged Information Analysis" 
      subtitle="Comprehensive analysis of your Instagram activity logs"
    >
      {/* Media Upload Settings */}
      <MediaUploadSettings 
        includeMedia={includeMedia}
        onToggleMedia={handleToggleMedia}
        mediaCount={filteredData?.mediaCount || 0}
      />

      {/* Search and Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon color="primary" />
            Search & Filter
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search links, profiles, or domains..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setDateRange('all');
                }}
                disabled={!searchTerm && dateRange === 'all'}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="logged information tabs"
        >
          <Tab label="Link History" icon={<LinkIcon />} />
          <Tab label="Audience Insights" icon={<PeopleIcon />} />
          <Tab label="Content Interactions" icon={<InsightsIcon />} />
          <Tab label="Profile Searches" icon={<SearchIcon />} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <LinkHistoryAnalysis 
          linkHistoryData={filteredData?.linkHistory?.data} 
          mode={mode}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AudienceDemographics 
          audienceData={filteredData?.audienceInsights}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ContentInteractions 
          interactionsData={filteredData?.contentInteractions}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ProfileSearches 
          searchData={filteredData?.profileSearches?.data}
        />
      </TabPanel>
    </Section>
  );
}

LoggedInformationPage.propTypes = {
  advanced: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
};
