import { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import './App.css';

function App() {
    const [notFollowingBack, setNotFollowingBack] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const rootRef = useRef(null);

    const handleFile = async (file) => {
        if (file && file.name.endsWith('.zip')) {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            let followersList = [];
            let followingList = [];

            const followersFile = contents.file(/followers_1\.json$/i)[0];
            if (followersFile) {
                const followersContent = await followersFile.async('string');
                const followersData = JSON.parse(followersContent);
                followersList = followersData.map((item) =>
                    item.string_list_data[0].value.toLowerCase()
                );
            }

            const followingFile = contents.file(/following\.json$/i)[0];
            if (followingFile) {
                const followingContent = await followingFile.async('string');
                const followingData = JSON.parse(followingContent);
                followingList = followingData.relationships_following.map((item) =>
                    item.string_list_data[0].value.toLowerCase()
                );
            }

            const notFollowingBackList = followingList.filter(
                (username) => !followersList.includes(username)
            );

            setNotFollowingBack(notFollowingBackList);
            setIsUploaded(true);
        } else {
            alert('Please upload a valid ZIP file.');
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        handleFile(file);
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (
            event.dataTransfer.types &&
            event.dataTransfer.types.includes('Files')
        ) {
            setIsDragActive(true);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (
            event.dataTransfer.types &&
            event.dataTransfer.types.includes('Files')
        ) {
            setIsDragActive(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target === rootRef.current) {
            setIsDragActive(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            setNotFollowingBack([]);
            setSearchTerm('');
            setIsUploaded(false);
            handleFile(file);
            event.dataTransfer.clearData();
        }
    };

    useEffect(() => {
        const rootElement = rootRef.current;
        if (rootElement) {
            rootElement.addEventListener('dragenter', handleDragEnter);
            rootElement.addEventListener('dragover', handleDragOver);
            rootElement.addEventListener('dragleave', handleDragLeave);
            rootElement.addEventListener('drop', handleDrop);
        }

        return () => {
            if (rootElement) {
                rootElement.removeEventListener('dragenter', handleDragEnter);
                rootElement.removeEventListener('dragover', handleDragOver);
                rootElement.removeEventListener('dragleave', handleDragLeave);
                rootElement.removeEventListener('drop', handleDrop);
            }
        };
    }, []);

    return (
        <div id="root" ref={rootRef}>
            <h1>Peeksta</h1>
            {!isUploaded && (
                <div className={`upload-area ${isDragActive ? 'active' : ''}`}>
                    <input type="file" accept=".zip" onChange={handleFileUpload} />
                    <p>Drag and drop your ZIP file here or click to upload.</p>
                </div>
            )}
            {isUploaded && notFollowingBack.length === 0 && (
                <p className="no-users">All users are following you back!</p>
            )}
            {isUploaded && notFollowingBack.length > 0 && (
                <>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        className="search-bar"
                    />
                    <ul className="user-list">
                        {notFollowingBack
                            .filter((username) => username.includes(searchTerm))
                            .map((username) => (
                                <li key={username}>
                                    <a
                                        href={`https://www.instagram.com/${username}/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {username}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </>
            )}
            {/* Only show the drag overlay when isUploaded is true */}
            {isDragActive && isUploaded && (
                <div
                    className="drag-overlay"
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <p>Drop your ZIP file here</p>
                </div>
            )}
        </div>
    );
}

export default App;