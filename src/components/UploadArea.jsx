import React from 'react';
import { alpha } from '@mui/material/styles'; // Import alpha
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'; // For a more explicit upload button
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Example Icon

export function UploadArea({ isActive, onFileChange }) {
    const fileInputRef = React.useRef(null);

    const handlePaperClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Paper
            elevation={isActive ? 6 : 2}
            onClick={handlePaperClick} // Make the Paper clickable to trigger file input
            sx={{
                border: '2px dashed',
                borderColor: isActive ? 'primary.main' : 'grey.400',
                borderRadius: 2, // 10px in theme.spacing units
                p: 4, // 2rem in theme.spacing units
                mb: 2, // margin-bottom
                textAlign: 'center',
                backgroundColor: isActive 
                    ? (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(0, 127, 255, 0.1)' // Specific color for dark mode active
                        : alpha(theme.palette.primary.main, 0.1) // Use alpha for light mode active
                    : 'background.paper',
                transition: (theme) => theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
                cursor: 'pointer',
                '&:hover': {
                    borderColor: 'primary.dark',
                    boxShadow: (theme) => theme.shadows[4],
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200, // Ensure a decent clickable area
            }}
        >
            <input
                type="file"
                accept=".zip"
                onChange={onFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }} // Hidden input
            />
            <CloudUploadIcon sx={{ fontSize: 60, color: isActive ? 'primary.main' : 'grey.500', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                Drag and drop your ZIP file here
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                or click to select file
            </Typography>
            <Button
                variant="contained"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent Paper's onClick from firing again
                    handlePaperClick();
                }}
                startIcon={<CloudUploadIcon />}
            >
                Upload File
            </Button>
        </Paper>
    );
}
