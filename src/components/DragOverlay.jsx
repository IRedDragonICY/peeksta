import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper'; // To style the inner message box

export function DragOverlay() {
    // The DragOverlay is typically shown/hidden based on a state in App.jsx (e.g., isDragActive)
    // For this component, we assume it's rendered when active.
    // The `open` prop of Modal would be controlled by that state.
    // Here, we'll just render it as if it's always open when this component is included.

    return (
        <Modal
            open={true} // This would typically be a prop like `isOpen`
            aria-labelledby="drag-overlay-title"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 3, // padding
                    borderRadius: 2, // border-radius
                    border: '2px dashed',
                    borderColor: 'primary.contrastText', // or a specific color like 'common.white'
                    backgroundColor: (theme) => 
                        theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.7)',
                    textAlign: 'center',
                }}
            >
                <Typography
                    id="drag-overlay-title"
                    variant="h5"
                    component="p"
                    sx={{ 
                        color: 'primary.contrastText', // or 'common.white'
                    }}
                >
                    Drop your ZIP file here
                </Typography>
            </Paper>
        </Modal>
    );
}
