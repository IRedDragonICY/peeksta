import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  LinearProgress,
  Alert,
  AlertTitle,
  Badge,
  IconButton,
  Button
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Apps as AppsIcon,
  Language as WebsiteIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Smartphone as AppIcon,
  Public as PublicIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  BarChart as ChartIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#1976d2', '#dc004e', '#ff9800', '#4caf50', '#9c27b0', '#00bcd4', '#8bc34a', '#ffc107'];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`apps-tabpanel-${index}`}
      aria-labelledby={`apps-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function formatTimestamp(timestamp) {
  if (!timestamp) return 'Never';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Never';
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}

export default function ComprehensiveAppsAnalysis({ 
  activeApps = [], 
  expiredApps = [], 
  offMetaActivity = [], 
  offMetaSettings = {} 
}) {
  const [tabValue, setTabValue] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // Process off-meta activity for analysis
  const processedActivity = useMemo(() => {
    if (!Array.isArray(offMetaActivity)) return {};

    const stats = {
      totalApps: offMetaActivity.length,
      totalEvents: 0,
      eventTypes: {},
      timeDistribution: {},
      topApps: {},
      categories: { apps: 0, websites: 0 }
    };

    offMetaActivity.forEach(app => {
      if (!app.events) return;
      
      stats.totalEvents += app.events.length;
      
      // Categorize as app or website
      if (app.name.includes('.')) {
        stats.categories.websites++;
      } else {
        stats.categories.apps++;
      }

      // Count events per app
      stats.topApps[app.name] = (stats.topApps[app.name] || 0) + app.events.length;

      app.events.forEach(event => {
        // Event types
        stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
        
        // Time distribution (by month)
        const date = new Date(event.timestamp * 1000);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        stats.timeDistribution[monthKey] = (stats.timeDistribution[monthKey] || 0) + 1;
      });
    });

    return stats;
  }, [offMetaActivity]);

  // Prepare chart data
  const eventTypeChartData = Object.entries(processedActivity.eventTypes || {}).map(([type, count]) => ({
    name: type.replace(/_/g, ' '),
    value: count,
    percentage: ((count / processedActivity.totalEvents) * 100).toFixed(1)
  }));

  const topAppsData = Object.entries(processedActivity.topApps || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      fullName: name,
      events: count
    }));

  const timelineData = Object.entries(processedActivity.timeDistribution || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, count]) => ({
      month,
      events: count
    }));

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AppsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Apps & Websites Analysis
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Comprehensive overview of your connected apps and web activity tracking
            </Typography>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  {activeApps.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Apps
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'warning.50' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  {expiredApps.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expired Apps
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'info.50' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="info.main" fontWeight="bold">
                  {processedActivity.totalApps || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tracked Services
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'success.50' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {(processedActivity.totalEvents || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Events
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Active Apps" icon={<CheckIcon />} />
            <Tab label="Expired Apps" icon={<WarningIcon />} />
            <Tab label="Off-Meta Activity" icon={<TimelineIcon />} />
            <Tab label="Privacy Settings" icon={<SecurityIcon />} />
            <Tab label="Analytics" icon={<ChartIcon />} />
          </Tabs>
        </Box>

        {/* Active Apps Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon sx={{ mr: 1, color: 'success.main' }} />
            Currently Active Apps & Services
          </Typography>
          {activeApps.length === 0 ? (
            <Alert severity="info">
              <AlertTitle>No Active Apps</AlertTitle>
              You don't have any currently active third-party apps connected to your Instagram account.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {activeApps.map((app, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <AppIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" noWrap>
                            {app.title || 'Unknown App'}
                          </Typography>
                          <Chip 
                            label="Active" 
                            color="success" 
                            size="small"
                            icon={<CheckIcon />}
                          />
                        </Box>
                      </Stack>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <TimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Added
                          </Typography>
                          <Typography variant="body1">
                            {formatTimestamp(app.addedAt)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(app.addedAt)}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <HistoryIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Last Active
                          </Typography>
                          <Typography variant="body1">
                            {formatTimestamp(app.lastActiveAt)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(app.lastActiveAt)}
                          </Typography>
                        </Box>
                        
                        {app.appUserId && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              App User ID
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {app.appUserId}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Expired Apps Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
            Expired Apps & Services
          </Typography>
          {expiredApps.length === 0 ? (
            <Alert severity="info">
              <AlertTitle>No Expired Apps</AlertTitle>
              You don't have any expired third-party app connections.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {expiredApps.map((app, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%', bgcolor: 'warning.50' }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <CloseIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" noWrap>
                            {app.title || 'Unknown App'}
                          </Typography>
                          <Chip 
                            label="Expired" 
                            color="warning" 
                            size="small"
                            icon={<WarningIcon />}
                          />
                        </Box>
                      </Stack>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <CloseIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Expired On
                          </Typography>
                          <Typography variant="body1">
                            {formatTimestamp(app.expiredAt)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(app.expiredAt)}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <HistoryIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Last Active
                          </Typography>
                          <Typography variant="body1">
                            {formatTimestamp(app.lastActiveAt)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(app.lastActiveAt)}
                          </Typography>
                        </Box>
                        
                        {app.appUserId && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              App User ID
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {app.appUserId}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Off-Meta Activity Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TimelineIcon sx={{ mr: 1, color: 'info.main' }} />
            Off-Meta Activity Tracking
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>About Off-Meta Activity</AlertTitle>
            This shows websites and apps that have sent information about your activity to Meta for advertising purposes.
          </Alert>

          <Grid container spacing={3}>
            {/* Activity Summary */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Activity Summary
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Services
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        {processedActivity.totalApps || 0}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Apps vs Websites
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={`${processedActivity.categories?.apps || 0} Apps`} 
                          color="primary" 
                          size="small" 
                        />
                        <Chip 
                          label={`${processedActivity.categories?.websites || 0} Websites`} 
                          color="secondary" 
                          size="small" 
                        />
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Events
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {(processedActivity.totalEvents || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Services */}
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Most Active Services
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topAppsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value, name, props) => [
                          `${value} events`, 
                          props.payload.fullName
                        ]}
                      />
                      <Bar dataKey="events" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Activity List */}
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Detailed Activity ({offMetaActivity.length} services)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAllActivity(!showAllActivity)}
                  startIcon={<FilterIcon />}
                >
                  {showAllActivity ? 'Show Less' : 'Show All'}
                </Button>
              </Box>
              
              <List dense>
                {(showAllActivity ? offMetaActivity : offMetaActivity.slice(0, 10)).map((app, index) => (
                  <Accordion 
                    key={index}
                    expanded={expandedAccordion === `activity-${index}`}
                    onChange={handleAccordionChange(`activity-${index}`)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                        <Avatar sx={{ bgcolor: app.name.includes('.') ? 'secondary.main' : 'primary.main' }}>
                          {app.name.includes('.') ? <WebsiteIcon /> : <AppIcon />}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" noWrap>
                            {app.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {app.events?.length || 0} events tracked
                          </Typography>
                        </Box>
                        <Chip 
                          label={app.name.includes('.') ? 'Website' : 'App'} 
                          size="small"
                          color={app.name.includes('.') ? 'secondary' : 'primary'}
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Event Type</TableCell>
                              <TableCell>Timestamp</TableCell>
                              <TableCell>ID</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(app.events || []).slice(0, 10).map((event, eventIndex) => (
                              <TableRow key={eventIndex}>
                                <TableCell>
                                  <Chip 
                                    label={event.type.replace(/_/g, ' ')} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {formatTimestamp(event.timestamp)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatRelativeTime(event.timestamp)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                    {event.id}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                            {(app.events || []).length > 10 && (
                              <TableRow>
                                <TableCell colSpan={3} align="center">
                                  <Typography variant="caption" color="text.secondary">
                                    ... and {(app.events || []).length - 10} more events
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
              
              {!showAllActivity && offMetaActivity.length > 10 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing 10 of {offMetaActivity.length} services
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Privacy Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1, color: 'warning.main' }} />
            Off-Meta Technologies Settings
          </Typography>
          
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Account Association
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography>
                      {offMetaSettings.label_values?.find(lv => lv.label === 'Account association state')?.value || 'Not Available'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                    Privacy Actions Taken
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Clear History Actions:</Typography>
                      <Chip 
                        label={offMetaSettings.label_values?.find(lv => lv.label === 'Number of times the clear history action has been taken')?.value || '0'} 
                        size="small" 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Settings Disabled:</Typography>
                      <Chip 
                        label={offMetaSettings.label_values?.find(lv => lv.label === 'Number of times the account association settings have been disabled')?.value || '0'} 
                        size="small" 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Settings Enabled:</Typography>
                      <Chip 
                        label={offMetaSettings.label_values?.find(lv => lv.label === 'Number of times the account association settings have been enabled')?.value || '0'} 
                        size="small" 
                      />
                    </Box>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Settings Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Settings Updated
                      </Typography>
                      <Typography>
                        {formatTimestamp(offMetaSettings.timestamp)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Facebook ID
                      </Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {offMetaSettings.fbid || 'Not Available'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Latest Activity Time
                      </Typography>
                      <Typography>
                        {formatTimestamp(offMetaSettings.label_values?.find(lv => lv.label === 'Latest activity time')?.timestamp_value)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ChartIcon sx={{ mr: 1, color: 'primary.main' }} />
            Activity Analytics & Insights
          </Typography>
          
          <Grid container spacing={3}>
            {/* Event Types Distribution */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Event Types Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventTypeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {eventTypeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Timeline */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Activity Timeline (Last 12 Months)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="events" stroke="#1976d2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Statistics Overview */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Detailed Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                        <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" color="primary.main">
                          {Math.round((processedActivity.totalEvents || 0) / (processedActivity.totalApps || 1))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Events per Service
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                        <AppIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" color="success.main">
                          {processedActivity.categories?.apps || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mobile Apps
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                        <PublicIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="h4" color="info.main">
                          {processedActivity.categories?.websites || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Websites
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                        <TimeIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" color="warning.main">
                          {timelineData.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Months
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </CardContent>
    </Card>
  );
}

ComprehensiveAppsAnalysis.propTypes = {
  activeApps: PropTypes.array,
  expiredApps: PropTypes.array,
  offMetaActivity: PropTypes.array,
  offMetaSettings: PropTypes.object,
};
