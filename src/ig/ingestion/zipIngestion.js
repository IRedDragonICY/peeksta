/**
 * ZIP file ingestion utilities
 */

import JSZip from 'jszip';
import { normalizePath } from '../utils/index.js';

/**
 * Build a virtual filesystem (VFS) from ZIP file
 * Only JSON files are stored to keep memory small
 * @param {File} zipFile - ZIP file to process
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Map>} Virtual file system mapping path -> JSON content
 */
export async function ingestZipFile(zipFile, onProgress) {
  const zip = await JSZip.loadAsync(zipFile);
  const entries = Object.values(zip.files);
  const total = entries.length || 1;
  const vfs = new Map();

  let processed = 0;
  
  for (const entry of entries) {
    // Skip directories and non-JSON files
    if (entry.dir) {
      processed += 1;
      if (onProgress) onProgress(processed / total, `Scanning: ${entry.name}`);
      continue;
    }
    
    const lower = normalizePath(entry.name);
    if (!lower.endsWith('.json')) {
      processed += 1;
      if (onProgress && processed % 25 === 0) {
        onProgress(processed / total, `Skipping: ${entry.name}`);
      }
      continue;
    }
    
    try {
      const content = await entry.async('string');
      vfs.set(lower, content);
    } catch (e) {
      // Ignore read errors but continue
      console.warn('Failed to read zip entry', entry.name, e);
    }
    
    processed += 1;
    if (onProgress) onProgress(processed / total, `Loaded: ${entry.name}`);
  }
  
  if (onProgress) onProgress(1, 'ZIP ingestion complete');
  return vfs;
}
