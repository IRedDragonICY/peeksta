import { useState, useCallback, useEffect } from 'react';

export function useDragAndDrop(rootRef, onFileDrop) {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragEnter = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.types && event.dataTransfer.types.includes('Files')) {
            setIsDragActive(true);
        }
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.types && event.dataTransfer.types.includes('Files')) {
            setIsDragActive(true);
        }
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target === rootRef.current) {
            setIsDragActive(false);
        }
    }, [rootRef]);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            onFileDrop(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    }, [onFileDrop]);

    useEffect(() => {
        const element = rootRef.current;
        if (!element) return;

        element.addEventListener('dragenter', handleDragEnter);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('dragleave', handleDragLeave);
        element.addEventListener('drop', handleDrop);

        return () => {
            element.removeEventListener('dragenter', handleDragEnter);
            element.removeEventListener('dragover', handleDragOver);
            element.removeEventListener('dragleave', handleDragLeave);
            element.removeEventListener('drop', handleDrop);
        };
    }, [rootRef, handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

    return { isDragActive };
}
