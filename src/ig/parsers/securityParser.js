/**
 * Security and login information parser
 */

import { getBySuffix, parseJsonSafe } from '../utils/index.js';
import { FILE_PATHS } from '../constants/resultTemplate.js';

/**
 * Parse login activity
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseLoginActivity(vfs, result) {
  const loginActivityText = getBySuffix(vfs, FILE_PATHS.LOGIN_ACTIVITY);
  
  if (!loginActivityText) return;
  
  const obj = parseJsonSafe(loginActivityText, {});
  const items = Array.isArray(obj?.account_history_login_history) 
    ? obj.account_history_login_history 
    : [];
    
  result.security.logins = items.slice(0, 25).map((it) => ({
    time: it?.string_map_data?.Time?.timestamp || 0,
    ip: it?.string_map_data?.['IP Address']?.value || '',
    ua: it?.string_map_data?.['User Agent']?.value || '',
    port: it?.string_map_data?.Port?.value || '',
    lang: it?.string_map_data?.['Language Code']?.value || '',
    cookie: it?.string_map_data?.['Cookie Name']?.value || '',
    title: it?.title || '',
  }));
}
