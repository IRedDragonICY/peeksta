import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import {
  IconButton,
  Typography,
  Container,
  Paper,
  Box,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  OpenInNew as OpenInNewIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  ColorLens as ColorLensIcon,
  Visibility as VisibilityIcon,
  CreateNewFolder as CreateNewFolderIcon,
} from '@mui/icons-material';
import SettingsDialogModal from './components/settings/SettingsDialog.jsx';
import ThemeProvider, {useTheme} from './theme/ThemeProvider.jsx';

import { ingestZipFile, ingestDirectoryFiles, analyzeVfs } from './ig/analysis';
import DatasetsManager from './components/datasets/DatasetsManager.jsx';
import {
  listDatasets,
  getDataset,
  addDataset,
  deleteDataset as idbDeleteDataset,
  renameDataset as idbRenameDataset,
  touchDataset,
  generateDatasetId,
  buildZipDataset,
} from './storage/datasets';

import MiniDrawer from './components/layout/MiniDrawer.jsx';
import {
  OverviewPage,
  ConnectionsPage,
  MessagesPage,
  LinkHistoryPage,
  LoggedInformationPage,
  AdsPage,
  AppsPage,
  InsightsPage,
  ThreadsPage,
  PreferencesPage,
  PersonalPage,
  SecurityPage,
} from './pages';

// Local Storage Helper
const StorageHelper = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  }
};

const LAST_DATASET_KEY = 'peeksta_last_dataset_id';

// Theme moved to src/theme/ThemeProvider.jsx

// Custom Hook for Drag and Drop
function useDragAndDrop(rootRef, onFileDrop) {
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useRef(0);

  const prevent = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleWindowDragEnter = useCallback((event) => {
    prevent(event);
    if (event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.includes('Files')) {
      dragCounter.current += 1;
      setIsDragActive(true);
    }
  }, [prevent]);

  const handleWindowDragOver = useCallback((event) => {
    prevent(event);
  }, [prevent]);

  const handleWindowDragLeave = useCallback((event) => {
    prevent(event);
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  }, [prevent]);

  const handleWindowDrop = useCallback((event) => {
    prevent(event);
    setIsDragActive(false);
    dragCounter.current = 0;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileDrop(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [prevent, onFileDrop]);

  useEffect(() => {
    // Attach global listeners to prevent browser default navigation/download
    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [handleWindowDragEnter, handleWindowDragOver, handleWindowDragLeave, handleWindowDrop]);

  return { isDragActive };
}

// Modern Settings Dialog (Material Design You)
// Header Component
// Upload Area Component (MUI) - Modern Flat Material You Design
const UploadArea = ({ isDragActive, onFileChange, onFolderChange, isProcessing }) => {
  const muiTheme = useMuiTheme();
  const folderInputRef = useRef(null);
  const triggerFolderPicker = useCallback(() => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box sx={{
        bgcolor: 'background.paper',
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        px: { xs: 3, md: 6 },
        py: { xs: 2.5, md: 3 },
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CloudUploadIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              {isProcessing ? 'Processing...' : 'Upload Dataset'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
              Import your Instagram data to get started
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 6 },
        py: 4,
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
        }}>
          {/* Drop Zone */}
          <Box
            sx={{
              position: 'relative',
              py: 8,
              px: 4,
              borderRadius: 3,
              bgcolor: isDragActive
                ? (theme) => alpha(theme.palette.primary.main, 0.08)
                : (theme) => alpha(theme.palette.action.hover, 0.3),
              border: (theme) => `2px dashed ${alpha(theme.palette.divider, 0.2)}`,
              transition: 'all 0.2s',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.5),
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
              }
            }}
          >
            <input
              type="file"
              accept=".zip"
              onChange={onFileChange}
              disabled={isProcessing}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={onFolderChange}
              disabled={isProcessing}
              style={{ display: 'none' }}
              ref={folderInputRef}
            />

            {isProcessing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 64,
                    height: 64,
                    border: '4px solid',
                    borderColor: muiTheme.palette.primary.main,
                    borderTopColor: 'transparent',
                    borderRadius: '50%'
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Processing your data...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a moment
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.6 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your ZIP file'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  or click to browse files
                </Typography>
              </Box>
            )}
          </Box>

          {/* Alternative Options */}
          {!isProcessing && (
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ flex: 1, height: 1, bgcolor: (theme) => alpha(theme.palette.divider, 0.1) }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: 1, bgcolor: (theme) => alpha(theme.palette.divider, 0.1) }} />
              </Stack>

              <Button
                variant="contained"
                size="large"
                startIcon={<CreateNewFolderIcon />}
                onClick={triggerFolderPicker}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  }
                }}
              >
                Load Folder
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, lineHeight: 1.6 }}>
                Export your Instagram data from: Settings → Accounts center → Your information → Download information
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

UploadArea.propTypes = {
  isDragActive: PropTypes.bool.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onFolderChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

// Stats Card Component (MUI)
const StatsCard = ({ count }) => {
  return (
    <Paper variant="outlined" sx={{ p: 4, mb: 3, textAlign: 'center', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <GroupIcon color="primary" sx={{ fontSize: 56 }} />
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{count.toLocaleString()}</Typography>
      <Typography color="text.secondary">{count === 1 ? 'User' : 'Users'} not following back</Typography>
    </Paper>
  );
};

StatsCard.propTypes = {
  count: PropTypes.number.isRequired,
};

// Search Input Component (MUI)
const SearchInput = ({ searchTerm, onSearchChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search users..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

// User List Component (MUI)
const UserList = ({ users }) => {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <List disablePadding dense sx={{ maxHeight: 384, overflow: 'auto' }}>
        {users.map((username) => (
          <ListItemButton
              key={username}
            component="a"
                href={`https://www.instagram.com/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
            divider
              >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      {username.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`@${username}`} />
            <IconButton edge="end" aria-label="open profile">
              <OpenInNewIcon />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// No Users Message Component (MUI)
// Drag Overlay Component (MUI)
const DragOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: (theme) => theme.zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <DescriptionIcon color="primary" sx={{ fontSize: 96, mb: 2 }} />
        </motion.div>
        <Typography variant="h5" sx={{ mb: 1 }}>Drop your ZIP file here</Typography>
        <Typography color="text.secondary">Release to upload your Instagram data</Typography>
      </Paper>
    </Box>
  );
};

// Media Choice Dialog Component (MUI)
const MediaChoiceDialog = ({ open, onChoice, fileName }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <VisibilityIcon color="primary" />
        Media Upload Options
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          How would you like to process your Instagram data?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          File: <strong>{fileName}</strong>
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined" 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => onChoice(false)}
            >
              <Box sx={{ mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Bandwidth Saving
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyze data without media content. Faster processing and less bandwidth usage.
              </Typography>
              <Chip 
                label="Recommended" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined" 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => onChoice(true)}
            >
              <Box sx={{ mb: 2 }}>
                <VisibilityIcon color="primary" sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Include Media
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Process with full media content including images and videos for complete analysis.
              </Typography>
              <Chip 
                label="Full Analysis" 
                color="primary" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
          You can change this setting later in the analysis page
        </Typography>
        <Button onClick={() => onChoice(false)} color="success" variant="contained">
          Skip Media
        </Button>
        <Button onClick={() => onChoice(true)} color="primary" variant="contained">
          Include Media
        </Button>
      </DialogActions>
    </Dialog>
  );
};

MediaChoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onChoice: PropTypes.func.isRequired,
  fileName: PropTypes.string,
};

// Main App Component
function App() {
  const [notFollowingBack, setNotFollowingBack] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [advanced, setAdvanced] = useState(null); // full analytics result
  const [progressText, setProgressText] = useState('');
  const rootRef = useRef(null);
  const folderInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState(() => {
    try {
      return localStorage.getItem('peeksta_active_section') || 'overview';
    } catch (_) {
      return 'overview';
    }
  });
  const [connectionSection, setConnectionSection] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const restoreOnceRef = useRef(false);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [includeMediaGlobal, setIncludeMediaGlobal] = useState(false);
  const [currentDatasetId, setCurrentDatasetId] = useState(() => {
    try { return localStorage.getItem(LAST_DATASET_KEY) || null; } catch (_) { return null; }
  });

  const processFileWithMedia = useCallback(async (file, includeMedia = false) => {
    setIsProcessing(true);
    const loadingToastId = 'processing-upload';
    toast.loading('Processing your Instagram data...', { id: loadingToastId });

    try {
      // Advanced pipeline: ingest ZIP -> analyze
      const vfs = await ingestZipFile(file, (p, stage) => {
        if (stage) setProgressText(stage);
      });
      const analysis = await analyzeVfs(vfs, (_p, stage) => {
        if (stage) setProgressText(stage);
      });

      // Store media preference in analysis
      analysis.includeMedia = includeMedia;
      setIncludeMediaGlobal(includeMedia);

      setAdvanced(analysis);
      setNotFollowingBack(analysis.notFollowingBack || []);
      setIsUploaded(true);

      // Save dataset to IndexedDB for persistence
      try {
        const id = generateDatasetId();
        const ds = buildZipDataset({
          id,
          name: analysis?.profile?.username ? `${analysis.profile.username} (${file.name})` : file.name,
          fileName: file.name,
          blob: file,
          meta: { 
            username: analysis?.profile?.username || '',
            includeMedia: includeMedia
          },
        });
        await addDataset(ds);
        // Cache analysis for instant reload next time
        try {
          const { cacheAnalysis } = await import('./storage/datasets');
          await cacheAnalysis(id, analysis);
        } catch (_) {}
        await touchDataset(id);
        try { localStorage.setItem(LAST_DATASET_KEY, id); setCurrentDatasetId(id); } catch (_) {}
        // Refresh list after save
        try {
          const items = await listDatasets();
          setDatasets(items);
        } catch (_) {}
      } catch (e) {
        // non-fatal
        // console.warn('Failed to persist dataset', e);
      }

      const mediaText = includeMedia ? ' (with media)' : ' (media-free)';
      toast.success(`Found ${analysis.notFollowingBack?.length || 0} users not following back!${mediaText}`, { id: loadingToastId });
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file. Please ensure your ZIP file is valid.', { id: loadingToastId });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processFile = useCallback(async (file) => {
    if (!file || !file.name.endsWith('.zip')) {
      toast.error('Please upload a valid ZIP file.', {
        icon: React.createElement(ExclamationTriangleIcon, { className: "w-5 h-5" }),
      });
      return;
    }

    // Show media inclusion dialog
    setPendingFile(file);
    setShowMediaDialog(true);
  }, []);

  const handleMediaChoice = useCallback((includeMedia) => {
    setShowMediaDialog(false);
    if (pendingFile) {
      processFileWithMedia(pendingFile, includeMedia);
      setPendingFile(null);
    }
  }, [pendingFile, processFileWithMedia]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setNotFollowingBack([]);
      setSearchTerm('');
      setIsUploaded(false);
      setAdvanced(null);
      processFile(file);
    }
  }, [processFile]);

  const handleFolderChange = useCallback(async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const loadingToastId = 'processing-folder';
    toast.loading('Processing your Instagram folder...', { id: loadingToastId });
    try {
      const vfs = await ingestDirectoryFiles(files, (p, stage) => {
        if (stage) setProgressText(stage);
      });
      const analysis = await analyzeVfs(vfs, (_p, stage) => {
        if (stage) setProgressText(stage);
      });
      setAdvanced(analysis);
      setNotFollowingBack(analysis.notFollowingBack || []);
      setIsUploaded(true);
      toast.success(`Found ${analysis.notFollowingBack?.length || 0} users not following back!`, { id: loadingToastId });
    } catch (error) {
      console.error('Error processing folder:', error);
      toast.error('Error processing folder.', { id: loadingToastId });
    } finally {
      setIsProcessing(false);
    }
  }, []);
  useCallback(() => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  }, []);
  const onFileDrop = useCallback((file) => {
    setNotFollowingBack([]);
    setSearchTerm('');
    setIsUploaded(false);
    processFile(file);
  }, [processFile]);

  const { isDragActive } = useDragAndDrop(rootRef, onFileDrop);

  const filteredUsers = notFollowingBack.filter((username) =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshDatasets = useCallback(async () => {
    setDatasetsLoading(true);
    try {
      const items = await listDatasets();
      setDatasets(items);
    } finally {
      setDatasetsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDatasets();
  }, [refreshDatasets]);

  const handleLoadDataset = useCallback(async (datasetId) => {
    try {
      const ds = await getDataset(datasetId);
      if (!ds) return;
      setIsProcessing(true);
      const loadingToastId = 'loading-dataset';
      toast.loading('Loading dataset...', { id: loadingToastId });
      let analysis = null;
      if (ds.analysis) {
        analysis = ds.analysis;
      } else if (ds.type === 'zip' && ds.blob) {
        const vfs = await ingestZipFile(ds.blob, (p, stage) => { if (stage) setProgressText(stage); });
        analysis = await analyzeVfs(vfs, (_p, stage) => { if (stage) setProgressText(stage); });
      } else if (ds.type === 'vfs' && Array.isArray(ds.vfs)) {
        const vfs = new Map(ds.vfs);
        analysis = await analyzeVfs(vfs, (_p, stage) => { if (stage) setProgressText(stage); });
      }
      if (analysis) {
        setAdvanced(analysis);
        setNotFollowingBack(analysis.notFollowingBack || []);
        setIsUploaded(true);
        setCurrentDatasetId(ds.id);
        try { localStorage.setItem(LAST_DATASET_KEY, ds.id); } catch (_) {}
        await touchDataset(ds.id);
        toast.success('Dataset loaded', { id: loadingToastId });
        await refreshDatasets();
      } else {
        toast.error('Failed to load dataset', { id: loadingToastId });
      }
    } catch (e) {
      console.error(e);
      toast.error('Error loading dataset');
    } finally {
      setIsProcessing(false);
    }
  }, [refreshDatasets]);

  const handleDeleteDataset = useCallback(async (datasetId) => {
    try {
      await idbDeleteDataset(datasetId);
      if (currentDatasetId === datasetId) {
        // Reset app state when deleting the dataset in use
        setAdvanced(null);
        setIsUploaded(false);
        setNotFollowingBack([]);
        setSearchTerm('');
        setCurrentDatasetId(null);
        try { localStorage.removeItem(LAST_DATASET_KEY); } catch (_) {}
        // Switch to datasets section for clarity
        setActiveSection('datasets');
      }
      await refreshDatasets();
      toast.success('Dataset deleted');
    } catch (e) {
      toast.error('Failed to delete dataset');
    }
  }, [currentDatasetId, refreshDatasets]);

  const handleRenameDataset = useCallback(async (datasetId, newName) => {
    await idbRenameDataset(datasetId, newName);
    await refreshDatasets();
  }, [refreshDatasets]);

  // Fast restore of last used dataset on app load for better UX
  useEffect(() => {
    (async () => {
      if (restoreOnceRef.current) return;
      restoreOnceRef.current = true;
      try {
        const lastId = StorageHelper.getItem(LAST_DATASET_KEY, null) || localStorage.getItem(LAST_DATASET_KEY);
        if (!lastId) return;
        const ds = await getDataset(lastId);
        if (!ds) return;
        if (ds.analysis) {
          // Instant hydrate without heavy processing
          setAdvanced(ds.analysis);
          setNotFollowingBack(ds.analysis.notFollowingBack || []);
          setIsUploaded(true);
          setCurrentDatasetId(ds.id);
          await touchDataset(ds.id);
          refreshDatasets();
          return;
        }
        // Fallback to normal loader
        await handleLoadDataset(lastId);
      } catch (_) {
        // ignore restore errors
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist active section
  useEffect(() => {
    try { localStorage.setItem('peeksta_active_section', activeSection); } catch (_) {}
  }, [activeSection]);

  // Handle navigation from Overview to Connections with specific section
  const handleNavigateToConnections = useCallback((section) => {
    setConnectionSection(section);
    setActiveSection('connections');
  }, []);

  return (
    <ThemeProvider>
      <AppContent
        isDragActive={isDragActive}
        handleFileChange={handleFileChange}
        handleFolderChange={handleFolderChange}
        isProcessing={isProcessing}
        isUploaded={isUploaded}
        notFollowingBack={notFollowingBack}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredUsers={filteredUsers}
        rootRef={rootRef}
        advanced={advanced}
        progressText={progressText}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        connectionSection={connectionSection}
        onNavigateToConnections={handleNavigateToConnections}
        datasets={datasets}
        datasetsLoading={datasetsLoading}
        refreshDatasets={refreshDatasets}
        onLoadDataset={handleLoadDataset}
        onDeleteDataset={handleDeleteDataset}
        onRenameDataset={handleRenameDataset}
        showMediaDialog={showMediaDialog}
        pendingFile={pendingFile}
        handleMediaChoice={handleMediaChoice}
        includeMediaGlobal={includeMediaGlobal}
        currentDatasetId={currentDatasetId}
        isNavDisabled={!isUploaded}
      />
    </ThemeProvider>
  );
}

const AppContent = ({
  isDragActive,
  handleFileChange,
  handleFolderChange,
  isProcessing,
  isUploaded,
  rootRef,
  advanced,
  progressText,
  activeSection,
  setActiveSection,
  connectionSection,
  onNavigateToConnections,
  datasets,
  datasetsLoading,
  refreshDatasets,
  onLoadDataset,
  onDeleteDataset,
  onRenameDataset,
  showMediaDialog,
  pendingFile,
  handleMediaChoice,
                      currentDatasetId,
  isNavDisabled,
}) => {
  const { isDark, toggleSettings } = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#e0e0e0' : '#1a1a1a',
            border: 'none',
            borderRadius: '12px',
            boxShadow: isDark
              ? '0 4px 12px rgba(0, 0, 0, 0.5)'
              : '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '16px 20px',
            fontSize: '0.95rem',
            fontWeight: 500,
            maxWidth: '500px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#ffffff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#2196f3',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <SettingsDialogModal />

      <MiniDrawer
        title="Peeksta"
        activeSection={activeSection}
        onSelect={(key) => {
          if (isNavDisabled && !['overview', 'datasets'].includes(key)) return;
          setActiveSection(key);
        }}
        renderHeaderActions={() => (
          <>
            <IconButton color="inherit" onClick={toggleSettings} aria-label="open settings">
              <SettingsIcon />
            </IconButton>
          </>
        )}
        isItemDisabled={(key) => isNavDisabled && !['overview', 'datasets'].includes(key)}
      >

      <Box
        sx={{
          height: '100vh',
          overflow: 'hidden',
        }}
        ref={rootRef}
      >
        {activeSection === 'datasets' ? (
          <DatasetsManager
            datasets={datasets}
            loading={datasetsLoading}
            onRefresh={refreshDatasets}
            onLoad={onLoadDataset}
            onDelete={onDeleteDataset}
            onRename={onRenameDataset}
            currentId={currentDatasetId}
            onFileChange={handleFileChange}
            onFolderChange={handleFolderChange}
            isProcessing={isProcessing}
          />
        ) : !isUploaded ? (
          <UploadArea
            isDragActive={isDragActive}
            onFileChange={handleFileChange}
            onFolderChange={handleFolderChange}
            isProcessing={isProcessing}
          />
        ) : (
          <>
            {isUploaded && advanced && activeSection === 'overview' && (
              <OverviewPage
                advanced={advanced}
                mode={isDark ? 'dark' : 'light'}
                onNavigateToConnections={onNavigateToConnections}
              />
            )}

            {isUploaded && advanced && activeSection === 'connections' && (
              <ConnectionsPage
                advanced={advanced}
                initialSection={connectionSection}
              />
            )}

            {isUploaded && advanced && activeSection === 'messages' && (
              <MessagesPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
            )}

            {isUploaded && advanced && activeSection === 'link-history' && (
              <LinkHistoryPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
            )}

            {isUploaded && advanced && activeSection === 'logged-information' && (
              <LoggedInformationPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
            )}

            {isUploaded && advanced && activeSection === 'ads' && (
              <AdsPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
            )}

            {isUploaded && advanced && activeSection === 'apps' && (
              <AppsPage advanced={advanced} />
            )}

            {isUploaded && advanced && activeSection === 'insights' && (
              <InsightsPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
            )}

            {isUploaded && advanced && activeSection === 'threads' && (
              <ThreadsPage advanced={advanced} mode={isDark ? 'dark' : 'light'} />
            )}

            {isUploaded && advanced && activeSection === 'preferences' && (
              <PreferencesPage advanced={advanced} />
            )}

            {isUploaded && advanced && activeSection === 'security' && (
              <SecurityPage advanced={advanced} />
            )}

            {isUploaded && advanced && activeSection === 'personal' && (
              <PersonalPage advanced={advanced} />
            )}
          </>
        )}
      </Box>

      <AnimatePresence>{isDragActive && <DragOverlay />}</AnimatePresence>
      </MiniDrawer>
      
      {/* Media Choice Dialog */}
      <MediaChoiceDialog
        open={showMediaDialog}
        onChoice={handleMediaChoice}
        fileName={pendingFile?.name}
      />
    </Box>
  );
};

AppContent.propTypes = {
  isDragActive: PropTypes.bool.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleFolderChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  isUploaded: PropTypes.bool.isRequired,
  notFollowingBack: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filteredUsers: PropTypes.array.isRequired,
  rootRef: PropTypes.object.isRequired,
  advanced: PropTypes.object,
  progressText: PropTypes.string,
  activeSection: PropTypes.string,
  setActiveSection: PropTypes.func,
  connectionSection: PropTypes.string,
  onNavigateToConnections: PropTypes.func,
  datasets: PropTypes.array,
  datasetsLoading: PropTypes.bool,
  refreshDatasets: PropTypes.func,
  onLoadDataset: PropTypes.func,
  onDeleteDataset: PropTypes.func,
  onRenameDataset: PropTypes.func,
  showMediaDialog: PropTypes.bool,
  pendingFile: PropTypes.object,
  handleMediaChoice: PropTypes.func,
  includeMediaGlobal: PropTypes.bool,
  currentDatasetId: PropTypes.string,
  isNavDisabled: PropTypes.bool,
};

export default App;

// Small UI helpers
// StatMini moved to components/common/StatMini.jsx

function RowMini({ primary, secondary }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="body2">{primary}</Typography>
      <Chip size="small" label={secondary} />
    </Box>
  );
}
RowMini.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
};

// InsightsChart moved to components/charts/InsightsChart.jsx

// Sidebar variants moved to components/sidebar/

//

//

// Section moved to components/common/Section.jsx

// BarChart moved to components/charts/BarChart.jsx

// ActiveAppsList moved to components/apps/ActiveAppsList.jsx