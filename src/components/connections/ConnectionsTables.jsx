import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Button,
  Link as MuiLink,
  Pagination,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  TableContainer,
  InputAdornment,
  Tooltip,
  Fade,
  Badge,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Schedule as ScheduleIcon,
  Block as BlockIcon,
  Favorite as FavoriteIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { toast } from 'react-hot-toast';

function toRowsFromUsernames(usernames) {
  return (usernames || []).map((u) => ({ username: u }));
}

function downloadCsv(filename, rows) {
  const header = ['username'];
  const lines = [header.join(',')].concat(rows.map((r) => `${r.username}`));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Get tab icon based on key
function getTabIcon(key) {
  const iconMap = {
    followers: PeopleIcon,
    following: PersonAddIcon,
    notBack: PersonRemoveIcon,
    close: FavoriteIcon,
    pending: ScheduleIcon,
    recent: ScheduleIcon,
    removed: BlockIcon,
    unfollowed: PersonRemoveIcon,
  };
  return iconMap[key] || PersonIcon;
}

// Get tab color based on key
function getTabColor(key) {
  const colorMap = {
    followers: 'primary',
    following: 'secondary',
    notBack: 'error',
    close: 'warning',
    pending: 'info',
    recent: 'info',
    removed: 'error',
    unfollowed: 'error',
  };
  return colorMap[key] || 'default';
}

export default function ConnectionsTables({ data, initialTab }) {
  const theme = useTheme();
  const [tab, setTab] = useState(initialTab || 0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15; // Increased for better modern experience
  const [sortDir, setSortDir] = useState('asc');

  // Update tab when initialTab changes
  React.useEffect(() => {
    if (initialTab !== undefined && initialTab !== tab) {
      setTab(initialTab);
      setPage(1);
      setSearch('');
    }
  }, [initialTab]);

  const tabs = useMemo(() => {
    return [
      { 
        key: 'followers', 
        label: 'Followers', 
        rows: toRowsFromUsernames(data.connectionLists.followers),
        color: 'primary',
        description: 'People who follow you'
      },
      { 
        key: 'following', 
        label: 'Following', 
        rows: toRowsFromUsernames(data.connectionLists.following),
        color: 'secondary',
        description: 'People you follow'
      },
      { 
        key: 'notBack', 
        label: 'Not Follow Back', 
        rows: toRowsFromUsernames(data.notFollowingBack || []),
        color: 'error',
        description: 'People who don\'t follow you back'
      },
      { 
        key: 'close', 
        label: 'Close Friends', 
        rows: toRowsFromUsernames(data.connectionLists.closeFriends),
        color: 'warning',
        description: 'Your close friends list'
      },
      { 
        key: 'pending', 
        label: 'Pending', 
        rows: toRowsFromUsernames(data.connectionLists.pendingRequests),
        color: 'info',
        description: 'Pending follow requests'
      },
      { 
        key: 'recent', 
        label: 'Recent Requests', 
        rows: toRowsFromUsernames(data.connectionLists.recentRequests),
        color: 'info',
        description: 'Recent follow requests'
      },
      { 
        key: 'removed', 
        label: 'Removed Suggestions', 
        rows: toRowsFromUsernames(data.connectionLists.removedSuggestions),
        color: 'error',
        description: 'Removed suggested users'
      },
      { 
        key: 'unfollowed', 
        label: 'Recently Unfollowed', 
        rows: toRowsFromUsernames(data.connectionLists.recentlyUnfollowed),
        color: 'error',
        description: 'Recently unfollowed accounts'
      },
    ];
  }, [data]);

  const current = tabs[tab] || { rows: [] };
  const filtered = current.rows
    .filter((r) => r.username.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const handleCopy = async (username) => {
    try {
      await navigator.clipboard.writeText(username);
      toast.success(`Copied @${username} to clipboard`, {
        duration: 2000,
      });
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const currentTab = tabs[tab] || { rows: [], label: '', description: '', color: 'default' };
  const TabIcon = getTabIcon(currentTab.key);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: theme.shadows[1],
      }}
    >
      {/* Header with current tab info */}
      <CardContent sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: `${currentTab.color}.main`,
              color: `${currentTab.color}.contrastText`,
              width: 48,
              height: 48,
            }}
          >
            <TabIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {currentTab.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTab.description}
            </Typography>
          </Box>
          <Chip
            label={`${filtered.length} ${filtered.length === 1 ? 'person' : 'people'}`}
            color={currentTab.color}
            variant="outlined"
          />
        </Stack>

        {/* Search and Export Controls */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <TextField
            size="small"
            placeholder="Search username..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => downloadCsv(`${tabs[tab]?.key || 'list'}.csv`, filtered)}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: { xs: 'auto', sm: 140 },
            }}
          >
            Export CSV
          </Button>
        </Stack>

        {/* Modern Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tab} 
            onChange={(_, v) => { setTab(v); setPage(1); }} 
            variant="scrollable" 
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
                borderRadius: 2,
                mx: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                },
              },
            }}
          >
            {tabs.map((t, idx) => {
              const Icon = getTabIcon(t.key);
              return (
                <Tab
                  key={t.key}
                  icon={
                    <Badge badgeContent={t.rows.length} color={t.color} max={9999}>
                      <Icon />
                    </Badge>
                  }
                  label={t.label}
                  iconPosition="start"
                  value={idx}
                />
              );
            })}
          </Tabs>
        </Box>
      </CardContent>

      {/* Table Container */}
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  cursor: 'pointer',
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                  transition: 'background-color 0.2s ease',
                }} 
                onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Username
                  </Typography>
                  <Tooltip title={`Sort ${sortDir === 'asc' ? 'descending' : 'ascending'}`}>
                    <SortIcon 
                      fontSize="small" 
                      sx={{ 
                        transform: sortDir === 'desc' ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                      }} 
                    />
                  </Tooltip>
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((r, index) => (
              <Fade in={true} timeout={300 + index * 50} key={r.username}>
                <TableRow 
                  hover 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          width: 32,
                          height: 32,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {r.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        @{r.username}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Profile">
                        <IconButton
                          size="small"
                          component={MuiLink}
                          href={`https://www.instagram.com/${r.username}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                            },
                          }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy Username">
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(r.username)}
                          sx={{
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: 'secondary.main',
                              color: 'secondary.contrastText',
                            },
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              </Fade>
            ))}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'grey.100', color: 'grey.500', width: 64, height: 64 }}>
                      <GroupsIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      No users found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {search ? 'Try adjusting your search query' : 'This list is empty'}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      <CardContent sx={{ pt: 0 }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)} - {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </Typography>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, v) => setPage(v)} 
            size="medium"
            color="primary"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

ConnectionsTables.propTypes = {
  data: PropTypes.object.isRequired,
  initialTab: PropTypes.number,
};


