import React, { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  FolderZip as FolderZipIcon,
} from '@mui/icons-material';

export default function DatasetsManager({ datasets, loading, onRefresh, onLoad, onDelete, onRename, currentId }) {
  const [filter, setFilter] = useState('');

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
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FolderZipIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Datasets</Typography>
          {!!datasets?.length && <Chip size="small" label={datasets.length} />}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" onClick={onRefresh} disabled={loading}>Refresh</Button>
        </Stack>
      </Stack>
      <TextField
        size="small"
        placeholder="Filter datasets..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        sx={{ mb: 1.5 }}
        InputProps={{ startAdornment: (
          <InputAdornment position="start">
            <FilterListIcon fontSize="small" />
          </InputAdornment>
        )}}
      />
      <Divider sx={{ mb: 1 }} />
      <List dense sx={{ maxHeight: 420, overflow: 'auto' }}>
        {filtered.map((d) => (
          <ListItemButton key={d.id} divider onClick={() => onLoad?.(d.id)} selected={currentId === d.id}>
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar sx={{ bgcolor: currentId === d.id ? 'primary.main' : 'primary.light', color: currentId === d.id ? 'primary.contrastText' : 'primary.main' }}>{(d.name || d.fileName || 'D')[0].toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box component="div">
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body1" component="span" sx={{ fontWeight: 700 }}>{d.name || d.fileName || d.id}</Typography>
                    {d.username && <Chip size="small" label={`@${d.username}`} />}
                    {currentId === d.id && <Chip size="small" color="success" label="Loaded" />}
                  </Stack>
                </Box>
              }
              secondary={
                <Box component="div">
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="caption" component="span" color="text.secondary">{d.type?.toUpperCase()}</Typography>
                    {d.fileName && <Typography variant="caption" component="span" color="text.secondary">{d.fileName}</Typography>}
                    <Typography variant="caption" component="span" color="text.secondary">{formatSize(d.size)}</Typography>
                    {d.createdAt && <Typography variant="caption" component="span" color="text.secondary">Created {new Date(d.createdAt).toLocaleString()}</Typography>}
                    {d.lastUsedAt && <Typography variant="caption" component="span" color="text.secondary">Last used {new Date(d.lastUsedAt).toLocaleString()}</Typography>}
                  </Stack>
                </Box>
              }
            />
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Load">
                <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); onLoad?.(d.id); }}>
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rename">
                <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); handleRename(d.id, d.name); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton edge="end" size="small" onClick={async (e) => {
                  e.stopPropagation();
                  const ok = window.confirm('Delete this dataset?');
                  if (ok) { await onDelete?.(d.id); await onRefresh?.(); }
                }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </ListItemButton>
        ))}
        {!filtered.length && (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">No datasets saved yet. Upload a ZIP to save it here.</Typography>
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
};




