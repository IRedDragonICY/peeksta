/**
 * File and path utilities for Instagram export analysis
 */

/**
 * Normalize path to forward slashes and lower-case for suffix matching
 * @param {string} path - The path to normalize
 * @returns {string} Normalized path
 */
export function normalizePath(path) {
  return path.replace(/\\/g, '/').toLowerCase();
}

/**
 * Find first file by path suffix (case-insensitive)
 * @param {Map} vfs - Virtual file system
 * @param {string} suffix - Path suffix to search for
 * @returns {string|null} File content or null if not found
 */
export function getBySuffix(vfs, suffix) {
  const target = normalizePath(suffix);
  for (const [key, value] of vfs.entries()) {
    const normalizedKey = normalizePath(String(key));
    if (normalizedKey.endsWith(target)) return value;
  }
  return null;
}

/**
 * Safely parse JSON with fallback
 * @param {string} text - JSON text to parse
 * @param {any} fallback - Fallback value if parsing fails
 * @returns {any} Parsed JSON or fallback
 */
export function parseJsonSafe(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return fallback;
  }
}

/**
 * Count array items from a JSON file, handling various data structures
 * @param {Map} vfs - Virtual file system
 * @param {string} suffix - File path suffix
 * @param {string[]} possibleKeys - Possible array keys to check
 * @returns {number} Count of items
 */
export function countArrayFile(vfs, suffix, possibleKeys = []) {
  const text = getBySuffix(vfs, suffix);
  if (!text) return 0;
  
  const parsed = parseJsonSafe(text, []);
  if (Array.isArray(parsed)) return parsed.length;
  
  if (parsed && typeof parsed === 'object') {
    // Try specific keys first
    for (const key of possibleKeys) {
      const arr = parsed[key];
      if (Array.isArray(arr)) return arr.length;
    }
    
    // Fallback: find first array property
    const firstArray = Object.values(parsed).find(v => Array.isArray(v));
    if (Array.isArray(firstArray)) return firstArray.length;
  }
  
  return 0;
}

/**
 * Count arrays with wrapped property support
 * @param {string} text - JSON text
 * @param {string[]} keys - Possible property keys
 * @returns {number} Count
 */
export function countWrappedArray(text, keys = []) {
  if (!text) return 0;
  const parsed = parseJsonSafe(text, []);
  
  if (Array.isArray(parsed)) return parsed.length;
  
  if (parsed && typeof parsed === 'object') {
    for (const k of keys) {
      const arr = parsed?.[k];
      if (Array.isArray(arr)) return arr.length;
    }
    // Fallback: try to find first array property
    const firstArray = Object.values(parsed).find((v) => Array.isArray(v));
    if (Array.isArray(firstArray)) return firstArray.length;
  }
  
  return 0;
}
