/**
 * Insights, preferences, and miscellaneous data parser
 */

import { getBySuffix, parseJsonSafe, sortTop, safeParseInt } from '../utils/index.js';
import { FILE_PATHS } from '../constants/resultTemplate.js';

/**
 * Parse insights data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseInsights(vfs, result) {
  const insightsPostsText = getBySuffix(vfs, FILE_PATHS.INSIGHTS_POSTS);
  
  if (!insightsPostsText) return;
  
  const obj = parseJsonSafe(insightsPostsText, {});
  const postItems = Array.isArray(obj?.organic_insights_posts) ? obj.organic_insights_posts : [];
  
  let likes = 0; 
  let comments = 0; 
  let saves = 0;
  const perPost = [];
  
  for (const p of postItems) {
    const smd = p?.string_map_data || {};
    const createdTs = smd?.['Creation Timestamp']?.timestamp || 
                     p?.media_map_data?.['Media Thumbnail']?.creation_timestamp || 0;
    
    const l = safeParseInt(smd?.Likes?.value);
    const c = safeParseInt(smd?.Comments?.value);
    const s = safeParseInt(smd?.Saves?.value);
    
    perPost.push({ timestamp: createdTs, likes: l, comments: c, saves: s });
    likes += l; 
    comments += c; 
    saves += s;
  }
  
  perPost.sort((a, b) => a.timestamp - b.timestamp);
  
  result.insights.postsCount = postItems.length;
  result.insights.totals = { likes, comments, saves };
  result.insights.avg = {
    likes: postItems.length ? Math.round(likes / postItems.length) : 0,
    comments: postItems.length ? Math.round(comments / postItems.length) : 0,
    saves: postItems.length ? Math.round(saves / postItems.length) : 0,
  };
  result.insights.posts = perPost;
}

/**
 * Parse preferences data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parsePreferences(vfs, result) {
  const notifPrefsText = getBySuffix(vfs, FILE_PATHS.NOTIFICATION_PREFERENCES);
  
  if (notifPrefsText) {
    const obj = parseJsonSafe(notifPrefsText, {});
    result.preferences = Array.isArray(obj?.settings_notification_preferences) 
      ? obj.settings_notification_preferences.map((it) => ({
          channel: it?.string_map_data?.Channel?.value || '',
          type: it?.string_map_data?.Type?.value || '',
          value: it?.string_map_data?.Value?.value || '',
        })) 
      : [];
  } else {
    result.preferences = [];
  }
}

/**
 * Parse extended preferences
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parsePreferencesExtended(vfs, result) {
  // Comments allowed from
  const commentsAllowedText = getBySuffix(vfs, 'preferences/settings/comments_allowed_from.json');
  if (commentsAllowedText) {
    const obj = parseJsonSafe(commentsAllowedText, {});
    result.preferencesExtended.commentsAllowedFrom = obj?.string_map_data?.Value?.value || '';
  }

  // Consents
  const consentsText = getBySuffix(vfs, 'preferences/settings/consents.json');
  if (consentsText) {
    const arr = parseJsonSafe(consentsText, []);
    result.preferencesExtended.consents = Array.isArray(arr) ? arr.length : 0;
  }

  // Filtered keywords
  const filteredKeywordsText = getBySuffix(vfs, 'preferences/settings/filtered_keywords_for_comments_and_messages.json');
  if (filteredKeywordsText) {
    const arr = parseJsonSafe(filteredKeywordsText, []);
    result.preferencesExtended.filteredKeywords = Array.isArray(arr) ? arr.length : 0;
  }

  // Cross-app messaging
  const crossAppMsgText = getBySuffix(vfs, 'preferences/settings/use_cross-app_messaging.json');
  if (crossAppMsgText) {
    const obj = parseJsonSafe(crossAppMsgText, {});
    result.preferencesExtended.crossAppMessaging = obj?.string_map_data?.Value?.value || '';
  }
}

/**
 * Parse topics and searches
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseTopicsAndSearches(vfs, result) {
  // Topics
  const topicsText = getBySuffix(vfs, 'preferences/your_topics/recommended_topics.json');
  if (topicsText) {
    const arr = parseJsonSafe(topicsText, []);
    result.topics = (Array.isArray(arr) ? arr : [])
      .map((it) => it?.string_list_data?.[0]?.value || it?.title || '')
      .filter(Boolean);
  }

  // Searches
  const searchesText = getBySuffix(vfs, 'logged_information/recent_searches/profile_searches.json');
  if (searchesText) {
    const arr = parseJsonSafe(searchesText, []);
    const counts = {};
    let total = 0;
    
    for (const it of (Array.isArray(arr) ? arr : [])) {
      const val = it?.string_list_data?.[0]?.value || 
                  it?.string_map_data?.['Search']?.value || 
                  it?.title;
      if (!val) continue;
      
      counts[val] = (counts[val] || 0) + 1;
      total += 1;
    }
    
    result.searches.count = total;
    result.searches.topProfiles = sortTop(counts, 15).map(({ key, count }) => ({ 
      name: key, 
      count 
    }));
  }
}

/**
 * Parse devices and camera information
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseDevices(vfs, result) {
  // Devices
  const devicesText = getBySuffix(vfs, 'personal_information/device_information/devices.json');
  if (devicesText) {
    const obj = parseJsonSafe(devicesText, {});
    const items = Array.isArray(obj?.devices) ? obj.devices : (Array.isArray(obj) ? obj : []);
    
    result.devices = items.map((it) => ({
      name: it?.string_map_data?.Device?.value || it?.title || '',
      lastActive: it?.string_map_data?.Time?.timestamp || 0,
      os: it?.string_map_data?.OS?.value || '',
    })).filter((d) => d.name);
  }

  // Camera information
  const cameraInfoText = getBySuffix(vfs, 'personal_information/device_information/camera_information.json');
  if (cameraInfoText) {
    const arr = parseJsonSafe(cameraInfoText, []);
    result.cameras = Array.isArray(arr) ? arr.length : 0;
  }
}

/**
 * Parse apps and websites data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseApps(vfs, result) {
  // Active apps
  const activeAppsText = getBySuffix(vfs, 'apps_and_websites_off_of_instagram/apps_and_websites/active_apps.json');
  if (activeAppsText) {
    const obj = parseJsonSafe(activeAppsText, {});
    const items = Array.isArray(obj?.apps_and_websites_active_apps) ? obj.apps_and_websites_active_apps : [];
    
    result.apps.active = items.map((it) => ({
      title: it?.title || '',
      addedAt: it?.string_map_data?.['Added on']?.timestamp || 0,
      lastActiveAt: it?.string_map_data?.['Last active on']?.timestamp || 0,
      appUserId: it?.string_map_data?.['App user ID']?.value || '',
    }));
  }

  // Expired PPS apps - Parse full data
  const expiredPpsText = getBySuffix(vfs, 'apps_and_websites_off_of_instagram/apps_and_websites/expired_pps.json');
  if (expiredPpsText) {
    const obj = parseJsonSafe(expiredPpsText, {});
    const items = Array.isArray(obj?.apps_and_websites_expired_apps) ? obj.apps_and_websites_expired_apps : [];
    
    result.apps.expired = items.map((it) => ({
      title: it?.title || '',
      expiredAt: it?.string_map_data?.['Expired on']?.timestamp || 0,
      lastActiveAt: it?.string_map_data?.['Last active on']?.timestamp || 0,
      appUserId: it?.string_map_data?.['App user ID']?.value || '',
    }));
    result.apps.expiredCount = items.length;
  }

  // Off Meta activity - Parse full data
  const offMetaText = getBySuffix(vfs, 'apps_and_websites_off_of_instagram/apps_and_websites/your_activity_off_meta_technologies.json');
  if (offMetaText) {
    const obj = parseJsonSafe(offMetaText, {});
    const activities = Array.isArray(obj?.apps_and_websites_off_meta_activity) ? obj.apps_and_websites_off_meta_activity : [];
    
    result.apps.offMetaActivity = activities;
    
    // Calculate totals for backward compatibility
    let totalEvents = 0;
    activities.forEach(app => {
      if (Array.isArray(app.events)) {
        totalEvents += app.events.length;
      }
    });
    result.apps.offMetaTotals.events = totalEvents;
  }

  // Off Meta settings
  const offMetaSettingsText = getBySuffix(vfs, 'apps_and_websites_off_of_instagram/apps_and_websites/your_activity_off_meta_technologies_settings.json');
  if (offMetaSettingsText) {
    const obj = parseJsonSafe(offMetaSettingsText, {});
    result.apps.offMetaSettings = obj || {};
  }
}
