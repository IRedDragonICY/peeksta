/**
 * Data extraction and manipulation utilities
 */

/**
 * Extract usernames from string_list_data structure
 * @param {Array} items - Array of items with string_list_data
 * @returns {string[]} Array of usernames
 */
export function extractStringListUsernames(items) {
  if (!Array.isArray(items)) return [];
  
  const usernames = [];
  for (const item of items) {
    const sld = item?.string_list_data?.[0];
    if (sld?.value) usernames.push(String(sld.value).toLowerCase());
  }
  return usernames;
}

/**
 * Extract following relationships from Instagram data
 * @param {Object} obj - Object containing relationships_following
 * @returns {string[]} Array of following usernames
 */
export function extractRelationshipsFollowing(obj) {
  const list = obj?.relationships_following;
  return extractStringListUsernames(Array.isArray(list) ? list : []);
}

/**
 * Extract domain from URL
 * @param {string} url - URL to extract domain from
 * @returns {string} Domain name
 */
export function toDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch (_) {
    // Fallback: naive extraction
    const match = String(url).match(/^[a-z]+:\/\/([^\/]+)/i);
    return match ? match[1].replace(/^www\./, '') : 'unknown';
  }
}

/**
 * Sort entries by count and return top N
 * @param {Map|Object|Array} mapOrObj - Data to sort
 * @param {number} limit - Number of top items to return
 * @returns {Array} Sorted array of {key, count} objects
 */
export function sortTop(mapOrObj, limit = 10) {
  const entries = Array.isArray(mapOrObj)
    ? mapOrObj
    : Object.entries(mapOrObj);
  
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

/**
 * Extract data from various unfollowed user structures
 * @param {string} text - JSON text
 * @returns {string[]} Array of usernames
 */
export function extractRecentlyUnfollowed(text) {
  if (!text) return [];
  
  const raw = JSON.parse(text);
  let arr;
  
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (Array.isArray(raw?.relationships_unfollowed_users)) {
    arr = raw.relationships_unfollowed_users;
  } else if (Array.isArray(raw?.text_post_app_text_post_app_unfollowed_users)) {
    arr = raw.text_post_app_text_post_app_unfollowed_users;
  } else if (Array.isArray(raw?.text_post_app_unfollowed_users)) {
    arr = raw.text_post_app_unfollowed_users;
  } else {
    arr = [];
  }
  
  const usernames = [];
  for (const item of arr) {
    const sl = item?.string_list_data?.[0];
    if (sl?.value) usernames.push(String(sl.value).toLowerCase());
  }
  
  return usernames;
}

/**
 * Create progress step function
 * @param {Function} onProgress - Progress callback
 * @returns {Function} Step function
 */
export function createStepFunction(onProgress) {
  return (stage) => onProgress && onProgress(undefined, stage);
}

/**
 * Extract array from object with multiple possible property names
 * @param {Object} obj - Object to extract from
 * @param {string[]} possibleKeys - Possible property names
 * @returns {Array} Extracted array or empty array
 */
export function extractArrayFromObject(obj, possibleKeys) {
  if (!obj || typeof obj !== 'object') return [];
  
  for (const key of possibleKeys) {
    const value = obj[key];
    if (Array.isArray(value)) return value;
  }
  
  return [];
}

/**
 * Safe integer parsing
 * @param {any} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed integer or default
 */
export function safeParseInt(value, defaultValue = 0) {
  const parsed = parseInt(String(value || '0'), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
