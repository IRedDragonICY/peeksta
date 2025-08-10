/**
 * Directory ingestion utilities
 */

import { normalizePath } from '../utils/index.js';

/**
 * Ingest a folder selection (input[type=file] with webkitdirectory)
 * @param {FileList} fileList - List of files from directory selection
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Map>} Virtual file system mapping path -> JSON content
 */
export async function ingestDirectoryFiles(fileList, onProgress) {
  const files = Array.from(fileList || []);
  const total = files.length || 1;
  const vfs = new Map();

  let processed = 0;
  
  for (const file of files) {
    const path = normalizePath(file.webkitRelativePath || file.name);
    
    if (!path.endsWith('.json')) {
      processed += 1;
      if (onProgress && processed % 50 === 0) {
        onProgress(processed / total, `Skipping: ${file.name}`);
      }
      continue;
    }
    
    try {
      const text = await file.text();
      vfs.set(path, text);
    } catch (e) {
      // Ignore read errors
      console.warn('Failed to read file', file.name, e);
    }
    
    processed += 1;
    if (onProgress) onProgress(processed / total, `Loaded: ${file.name}`);
  }
  
  if (onProgress) onProgress(1, 'Folder ingestion complete');
  return vfs;
}
