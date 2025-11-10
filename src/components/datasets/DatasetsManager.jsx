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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        width: '100%',
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
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        px: { xs: 3, md: 6 },
        py: { xs: 2.5, md: 3 },
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} sx={{ mb: 2.5 }}>
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
              bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3),
              '& fieldset': {
                border: 'none',
              },
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.5),
              },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
                boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* List */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: 'background.default',
        px: { xs: 3, md: 6 },
        py: 2,
        '&::-webkit-scrollbar': {
          width: '10px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: (theme) => alpha(theme.palette.text.secondary, 0.2),
          borderRadius: 2,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.text.secondary, 0.3),
          }
        }
      }}>
        <List disablePadding>
        {filtered.map((d, index) => (
          <ListItemButton
            key={d.id}
            onClick={() => onLoad?.(d.id)}
            selected={currentId === d.id}
            sx={{
              borderRadius: 2,
              bgcolor: 'transparent',
              transition: 'all 0.15s',
              mb: 0.5,
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.6),
              },
              '&.Mui-selected': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                }
              },
              py: 2,
              px: 2,
            }}
          >
            <ListItemAvatar sx={{ minWidth: 60 }}>
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: (theme) => currentId === d.id ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: currentId === d.id ? 'primary.contrastText' : 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                }}
              >
                {(d.name || d.fileName || 'D')[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box component="div">
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                      {d.name || d.fileName || d.id}
                    </Typography>
                    {d.username && (
                      <Chip
                        size="small"
                        label={`@${d.username}`}
                        sx={{
                          fontWeight: 600,
                          height: 20,
                          bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    )}
                    {currentId === d.id && (
                      <Chip
                        size="small"
                        label="Active"
                        sx={{
                          fontWeight: 600,
                          height: 20,
                          bgcolor: (theme) => alpha(theme.palette.success.main, 0.15),
                          color: 'success.dark',
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          '& .MuiChip-label': { px: 1 }
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
              <Tooltip title="Load">
                <IconButton
                  size="medium"
                  onClick={(e) => { e.stopPropagation(); onLoad?.(d.id); }}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rename">
                <IconButton
                  size="medium"
                  onClick={(e) => { e.stopPropagation(); handleRename(d.id, d.name); }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="medium"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = window.confirm('Delete this dataset?');
                    if (ok) { await onDelete?.(d.id); await onRefresh?.(); }
                  }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </ListItemButton>
        ))}
          {!filtered.length && (
            <Box sx={{
              py: 16,
              textAlign: 'center',
            }}>
              <FolderZipIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2, opacity: 0.4 }} />
              <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
                No datasets yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload a ZIP file or folder to get started
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Box>
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




