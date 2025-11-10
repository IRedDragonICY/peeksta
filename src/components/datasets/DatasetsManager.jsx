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
        borderRadius: 4,
        p: 3,
        background: (theme) => theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${theme.palette.background.paper} 100%)`,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
          transform: 'translateY(-2px)',
        }
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
        mb: 3,
        pb: 2,
        borderBottom: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{
              p: 1.5,
              borderRadius: 3,
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }}>
              <FolderZipIcon sx={{ color: 'primary.contrastText', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                Datasets
              </Typography>
              {!!datasets?.length && (
                <Typography variant="caption" color="text.secondary">
                  {datasets.length} {datasets.length === 1 ? 'dataset' : 'datasets'} saved
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<CreateNewFolderIcon />}
              onClick={() => folderInputRef.current?.click()}
              disabled={isProcessing || loading}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                '&:hover': {
                  borderColor: 'primary.main',
                  background: (theme) => alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Folder
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || loading}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.success.main, 0.25)}`,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                '&:hover': {
                  boxShadow: (theme) => `0 6px 20px ${alpha(theme.palette.success.main, 0.35)}`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Add ZIP
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={loading || isProcessing}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  boxShadow: (theme) => `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Search/Filter */}
      <TextField
        size="medium"
        placeholder="Search datasets..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.6),
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
            },
            '&.Mui-focused': {
              backgroundColor: (theme) => alpha(theme.palette.background.default, 1),
              boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FilterListIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          )
        }}
      />

      {/* List */}
      <List
        sx={{
          maxHeight: 450,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: (theme) => alpha(theme.palette.divider, 0.1),
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            background: (theme) => alpha(theme.palette.primary.main, 0.3),
            borderRadius: 4,
            '&:hover': {
              background: (theme) => alpha(theme.palette.primary.main, 0.5),
            }
          }
        }}
      >
        {filtered.map((d, index) => (
          <ListItemButton
            key={d.id}
            onClick={() => onLoad?.(d.id)}
            selected={currentId === d.id}
            sx={{
              mb: 1.5,
              borderRadius: 3,
              border: (theme) => currentId === d.id
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: (theme) => currentId === d.id
                ? alpha(theme.palette.primary.main, 0.08)
                : alpha(theme.palette.background.default, 0.4),
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: (theme) => currentId === d.id
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.background.default, 0.7),
                transform: 'translateX(4px)',
                boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
              p: 2,
            }}
          >
            <ListItemAvatar sx={{ minWidth: 56 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: (theme) => currentId === d.id
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.7)}, ${alpha(theme.palette.primary.main, 0.7)})`,
                  color: 'primary.contrastText',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                }}
              >
                {(d.name || d.fileName || 'D')[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box component="div">
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
                    <Typography variant="body1" component="span" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                      {d.name || d.fileName || d.id}
                    </Typography>
                    {d.username && (
                      <Chip
                        size="small"
                        label={`@${d.username}`}
                        sx={{
                          fontWeight: 600,
                          background: (theme) => alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                          borderRadius: 2,
                        }}
                      />
                    )}
                    {currentId === d.id && (
                      <Chip
                        size="small"
                        label="Active"
                        sx={{
                          fontWeight: 700,
                          background: (theme) => `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                          color: 'success.contrastText',
                          borderRadius: 2,
                          boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              }
              secondary={
                <Box component="div" sx={{ mt: 0.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    {d.type && (
                      <Chip
                        size="small"
                        label={d.type.toUpperCase()}
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                      />
                    )}
                    <Typography variant="caption" component="span" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {formatSize(d.size)}
                    </Typography>
                    {d.lastUsedAt && (
                      <Typography variant="caption" component="span" color="text.secondary">
                        Used {new Date(d.lastUsedAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              }
            />
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Load Dataset" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onLoad?.(d.id); }}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      background: (theme) => alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rename" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleRename(d.id, d.name); }}
                  sx={{
                    color: 'info.main',
                    '&:hover': {
                      background: (theme) => alpha(theme.palette.info.main, 0.1),
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton
                  size="small"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = window.confirm('Delete this dataset?');
                    if (ok) { await onDelete?.(d.id); await onRefresh?.(); }
                  }}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      background: (theme) => alpha(theme.palette.error.main, 0.1),
                      transform: 'scale(1.1)',
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
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: (theme) => alpha(theme.palette.background.default, 0.4),
            border: (theme) => `2px dashed ${alpha(theme.palette.divider, 0.2)}`,
          }}>
            <FolderZipIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              No datasets yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a ZIP file to create your first dataset
            </Typography>
          </Box>
        )}
      </List>
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




