import { useState, useRef, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles'; // Added for scrollbar
// import { lightTheme, darkTheme } from './theme'; // No longer directly used
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { UserList } from './components/UserList';
import { DragOverlay } from './components/DragOverlay';
import { useDragAndDrop } from './hooks/useDragAndDrop';

function App() {
    const [themeMode, setThemeMode] = useState('light');
    const [userPrimaryColor, setUserPrimaryColor] = useState('#1976d2'); // Default MUI blue
    const [notFollowingBack, setNotFollowingBack] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const rootRef = useRef(null);

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const handlePrimaryColorChange = (event) => {
        setUserPrimaryColor(event.target.value);
    };

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: themeMode,
                primary: {
                    main: userPrimaryColor,
                },
                // You might want to define secondary, background colors here too if they were in theme.js
                // For now, keeping it simple with just primary color change
                ...(themeMode === 'light'
                    ? {
                          // Specific light mode overrides if needed, e.g., background
                          background: { default: '#ffffff', paper: '#f5f5f5' },
                      }
                    : {
                          // Specific dark mode overrides if needed
                          background: { default: '#121212', paper: '#1e1e1e' },
                      }),
            },
        });
    }, [themeMode, userPrimaryColor]);

    const processFile = useCallback(async (file) => {
        if (!file || !file.name.endsWith('.zip')) {
            alert('Please upload a valid ZIP file.');
            return;
        }

        try {
            const zip = await JSZip.loadAsync(file);

            const followersFile = zip.file(/followers_1\.json$/i)[0];
            const followersList = followersFile
                ? JSON.parse(await followersFile.async('string')).map((item) =>
                    item.string_list_data[0].value.toLowerCase()
                )
                : [];

            const followingFile = zip.file(/following\.json$/i)[0];
            const followingList = followingFile
                ? JSON.parse(await followingFile.async('string')).relationships_following.map((item) =>
                    item.string_list_data[0].value.toLowerCase()
                )
                : [];

            const notFollowingBackList = followingList.filter(
                (username) => !followersList.includes(username)
            );

            setNotFollowingBack(notFollowingBackList);
            setIsUploaded(true);
        } catch (error) {
            console.error('Error processing file:', error);
            alert('An error occurred while processing the file. Please ensure your ZIP file is valid.');
        }
    }, []);

    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            // Reset state on new file
            setNotFollowingBack([]);
            setSearchTerm('');
            setIsUploaded(false);
            processFile(file);
        }
    }, [processFile]);

    const onFileDrop = useCallback((file) => {
        setNotFollowingBack([]);
        setSearchTerm('');
        setIsUploaded(false);
        processFile(file);
    }, [processFile]);

    const { isDragActive } = useDragAndDrop(rootRef, onFileDrop);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={(theme) => ({
                    'html': { // Ensure scrollbar styling applies to the html element for full page scroll
                        scrollBehavior: 'smooth', // Optional: smooth scrolling
                    },
                    '::-webkit-scrollbar': {
                        width: '10px',
                        height: '10px',
                    },
                    '::-webkit-scrollbar-track': {
                        background: theme.palette.background.default, // Or theme.palette.background.paper
                    },
                    '::-webkit-scrollbar-thumb': {
                        background: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400],
                        borderRadius: '8px',
                        border: `2px solid ${theme.palette.background.default}`, // Creates a nice padding effect
                        '&:hover': {
                            background: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[600],
                        },
                    },
                })}
            />
            <div ref={rootRef} style={{ position: 'relative', minHeight: '100vh' }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <Header
                        themeMode={themeMode}
                        toggleTheme={toggleTheme}
                        userPrimaryColor={userPrimaryColor}
                        handlePrimaryColorChange={handlePrimaryColorChange}
                    />
                </div>

                {!isUploaded && (
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <UploadArea isActive={isDragActive} onFileChange={handleFileChange} />
                    </div>
                )}

                {isUploaded && (
                    <UserList
                        users={notFollowingBack}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                )}
                {isDragActive && <DragOverlay />}
            </div>
        </ThemeProvider>
    );
}

export default App;
