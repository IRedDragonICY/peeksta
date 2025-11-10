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
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}>
        <Box sx={{
          maxWidth: 1200,
          mx: 'auto',
          p: 3,
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FolderZipIcon sx={{ color: 'primary.contrastText', fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px', mb: 0.5 }}>
                Datasets
              </Typography>
              {!!datasets?.length && (
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {datasets.length} {datasets.length === 1 ? 'dataset' : 'datasets'} saved
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<CreateNewFolderIcon />}
              onClick={() => folderInputRef.current?.click()}
              disabled={isProcessing || loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Folder
            </Button>
            <Button
              variant="contained"
              size="large"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
              }}
            >
              Add ZIP
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={loading || isProcessing}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
              }}
            >
              Refresh
            </Button>
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
              borderRadius: 2,
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
          maxWidth: 1200,
          mx: 'auto',
          p: 3,
        }}>
          <List disablePadding>
        {filtered.map((d, index) => (
          <ListItemButton
            key={d.id}
            onClick={() => onLoad?.(d.id)}
            selected={currentId === d.id}
            sx={{
              mb: 1,
              borderRadius: 2,
              border: (theme) => currentId === d.id
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${theme.palette.divider}`,
              bgcolor: (theme) => currentId === d.id
                ? alpha(theme.palette.primary.main, 0.08)
                : 'background.default',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: (theme) => currentId === d.id
                  ? alpha(theme.palette.primary.main, 0.12)
                  : 'action.hover',
                borderColor: 'primary.main',
              },
              py: 2.5,
              px: 2.5,
            }}
          >
            <ListItemAvatar sx={{ minWidth: 64 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: currentId === d.id ? 'primary.main' : 'primary.light',
                  color: 'primary.contrastText',
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
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                      {d.name || d.fileName || d.id}
                    </Typography>
                    {d.username && (
                      <Chip
                        size="medium"
                        label={`@${d.username}`}
                        sx={{
                          fontWeight: 600,
                          bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                          borderRadius: 1.5,
                        }}
                      />
                    )}
                    {currentId === d.id && (
                      <Chip
                        size="medium"
                        label="Active"
                        color="success"
                        sx={{
                          fontWeight: 700,
                          borderRadius: 1.5,
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              }
              secondary={
                <Box component="div" sx={{ mt: 0.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    {d.type && (
                      <Chip
                        size="small"
                        label={d.type.toUpperCase()}
                        variant="outlined"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                      />
                    )}
                    <Typography variant="body2" component="span" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {formatSize(d.size)}
                    </Typography>
                    {d.lastUsedAt && (
                      <Typography variant="body2" component="span" color="text.secondary">
                        Used {new Date(d.lastUsedAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              }
            />
            <Stack direction="row" spacing={1}>
              <Tooltip title="Load Dataset" arrow>
                <IconButton
                  size="medium"
                  color="primary"
                  onClick={(e) => { e.stopPropagation(); onLoad?.(d.id); }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rename" arrow>
                <IconButton
                  size="medium"
                  color="info"
                  onClick={(e) => { e.stopPropagation(); handleRename(d.id, d.name); }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton
                  size="medium"
                  color="error"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = window.confirm('Delete this dataset?');
                    if (ok) { await onDelete?.(d.id); await onRefresh?.(); }
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
              p: 8,
              textAlign: 'center',
              borderRadius: 2,
              border: (theme) => `2px dashed ${theme.palette.divider}`,
              bgcolor: 'background.default',
              my: 4,
            }}>
              <FolderZipIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
                No datasets yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload a ZIP file to create your first dataset
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




