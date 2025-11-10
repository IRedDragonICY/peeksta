import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  FolderZip as FolderZipIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CreateNewFolder as CreateNewFolderIcon,
} from '@mui/icons-material';

export default function DatasetsManager({ datasets, loading, onRefresh, onLoad, onDelete, onRename, currentId, onFileChange, onFolderChange, isProcessing }) {
  const [filter, setFilter] = useState('');
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const filtered = (datasets || []).filter((d) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(f) ||
      (d.fileName || '').toLowerCase().includes(f) ||
      (d.username || '').toLowerCase().includes(f)
    );
  });

  const handleRename = useCallback(async (id, currentName) => {
    const newName = window.prompt('Rename dataset', currentName || '');
    if (newName && newName !== currentName) {
      await onRename?.(id, newName);
      await onRefresh?.();
    }
  }, [onRename, onRefresh]);

  const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let n = bytes;
    let i = 0;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024; i += 1;
    }
    return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        bgcolor: 'background.default',
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
      }}
    >
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={onFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={onFolderChange}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <Box sx={{
        bgcolor: 'background.paper',
        boxShadow: (theme) => `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
      }}>
        <Box sx={{
          maxWidth: 1400,
          mx: 'auto',
          px: 4,
          py: 3,
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FolderZipIcon sx={{ color: 'primary.main', fontSize: 40 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', mb: 0 }}>
                  Datasets
                </Typography>
                {!!datasets?.length && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {datasets.length} {datasets.length === 1 ? 'dataset' : 'datasets'} saved
                  </Typography>
                )}
              </Box>
            </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="text"
              size="large"
              startIcon={<CreateNewFolderIcon />}
              onClick={() => folderInputRef.current?.click()}
              disabled={isProcessing || loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                }
              }}
            >
              Folder
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                }
              }}
            >
              Add ZIP
            </Button>
            <IconButton
              size="large"
              onClick={onRefresh}
              disabled={loading || isProcessing}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Search/Filter */}
        <TextField
          size="medium"
          placeholder="Search datasets..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.default',
              '& fieldset': {
                border: 'none',
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
              '&.Mui-focused': {
                bgcolor: 'background.default',
                boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            )
          }}
        />
      </Box>
      </Box>

      {/* List */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: 'background.paper',
        '&::-webkit-scrollbar': {
          width: '12px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
          borderRadius: 2,
          border: (theme) => `3px solid ${theme.palette.background.paper}`,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
          }
        }
      }}>
        <Box sx={{
          maxWidth: 1400,
          mx: 'auto',
          px: 4,
          py: 3,
        }}>
          <List disablePadding>
        {filtered.map((d, index) => (
          <ListItemButton
            key={d.id}
            onClick={() => onLoad?.(d.id)}
            selected={currentId === d.id}
            sx={{
              mb: 0,
              borderRadius: 3,
              bgcolor: (theme) => currentId === d.id
                ? alpha(theme.palette.primary.main, 0.12)
                : 'transparent',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: (theme) => currentId === d.id
                  ? alpha(theme.palette.primary.main, 0.16)
                  : alpha(theme.palette.action.hover, 0.6),
              },
              py: 3,
              px: 3,
              borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            }}
          >
            <ListItemAvatar sx={{ minWidth: 72 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: (theme) => currentId === d.id ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.12),
                  color: currentId === d.id ? 'primary.contrastText' : 'primary.main',
                  fontWeight: 800,
                  fontSize: '1.75rem',
                }}
              >
                {(d.name || d.fileName || 'D')[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box component="div">
                  <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
                      {d.name || d.fileName || d.id}
                    </Typography>
                    {d.username && (
                      <Chip
                        size="small"
                        label={`@${d.username}`}
                        sx={{
                          fontWeight: 600,
                          height: 24,
                          bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                          color: 'info.main',
                          borderRadius: 1,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                    {currentId === d.id && (
                      <Chip
                        size="small"
                        label="Active"
                        sx={{
                          fontWeight: 700,
                          height: 24,
                          bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                          color: 'success.main',
                          borderRadius: 1,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              }
              secondary={
                <Box component="div" sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    {d.type && (
                      <Typography variant="caption" component="span" sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {d.type}
                      </Typography>
                    )}
                    <Typography variant="body2" component="span" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {formatSize(d.size)}
                    </Typography>
                    {d.lastUsedAt && (
                      <Typography variant="body2" component="span" color="text.secondary">
                        • Used {new Date(d.lastUsedAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              }
            />
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Load Dataset" arrow>
                <IconButton
                  size="large"
                  onClick={(e) => { e.stopPropagation(); onLoad?.(d.id); }}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rename" arrow>
                <IconButton
                  size="large"
                  onClick={(e) => { e.stopPropagation(); handleRename(d.id, d.name); }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton
                  size="large"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = window.confirm('Delete this dataset?');
                    if (ok) { await onDelete?.(d.id); await onRefresh?.(); }
                  }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </ListItemButton>
        ))}
          {!filtered.length && (
            <Box sx={{
              py: 12,
              px: 4,
              textAlign: 'center',
            }}>
              <FolderZipIcon sx={{ fontSize: 96, color: 'text.disabled', mb: 3, opacity: 0.3 }} />
              <Typography variant="h4" color="text.primary" sx={{ fontWeight: 700, mb: 1 }}>
                No datasets yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Upload a ZIP file or folder to get started
              </Typography>
            </Box>
          )}
          </List>
        </Box>
      </Box>
    </Paper>
  );
}

DatasetsManager.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    username: PropTypes.string,
    type: PropTypes.string,
    fileName: PropTypes.string,
    size: PropTypes.number,
    createdAt: PropTypes.number,
    lastUsedAt: PropTypes.number,
  })),
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
  onLoad: PropTypes.func,
  onDelete: PropTypes.func,
  onRename: PropTypes.func,
  currentId: PropTypes.string,
  onFileChange: PropTypes.func,
  onFolderChange: PropTypes.func,
  isProcessing: PropTypes.bool,
};




