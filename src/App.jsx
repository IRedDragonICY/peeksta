import  { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { UserList } from './components/UserList';
import { DragOverlay } from './components/DragOverlay';
import { useDragAndDrop } from './hooks/useDragAndDrop';

function App() {
    const [notFollowingBack, setNotFollowingBack] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const rootRef = useRef(null);

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
        <>
            <GlobalStyles />
            <div ref={rootRef} style={{ position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <Header />
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
        </>
    );
}

export default App;
