/**
 * Ads and advertising data parser
 */

import { 
  getBySuffix, 
  parseJsonSafe, 
  sortTop,
  countWrappedArray 
} from '../utils/index.js';
import { FILE_PATHS } from '../constants/resultTemplate.js';

/**
 * Parse ads viewed data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseAdsViewed(vfs, result) {
  const adsViewedText = getBySuffix(vfs, FILE_PATHS.ADS_VIEWED);
  
  if (!adsViewedText) return;
  
  const obj = parseJsonSafe(adsViewedText, {});
  const items = Array.isArray(obj?.impressions_history_ads_seen) ? obj.impressions_history_ads_seen : [];
  
  const authorCounts = {};
  for (const it of items) {
    const author = it?.string_map_data?.Author?.value || 'unknown';
    authorCounts[author] = (authorCounts[author] || 0) + 1;
    
    const ts = it?.string_map_data?.Time?.timestamp || 0;
    result.adsDetails.adsViewed.push({ 
      title: author, 
      timestamp: ts, 
      href: '', 
      kind: 'ad' 
    });
  }
  
  result.ads.impressionsCount = items.length;
  result.ads.topAuthors = sortTop(authorCounts, 15);
}

/**
 * Parse in-app messages
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseInAppMessages(vfs, result) {
  const inAppMsgText = getBySuffix(vfs, FILE_PATHS.IN_APP_MESSAGES);
  
  if (!inAppMsgText) return;
  
  const obj = parseJsonSafe(inAppMsgText, {});
  const items = Array.isArray(obj?.impressions_history_app_message)
    ? obj.impressions_history_app_message
    : Array.isArray(obj) ? obj : [];
    
  result.adsTopics.inAppMessages = items.length;
  
  for (const it of items) {
    const smd = it?.string_map_data || {};
    const name = smd?.['In-app message name']?.value || it?.title || 'In-app message';
    const click = smd?.['Click type']?.value || '';
    const cnt = parseInt(smd?.Count?.value || '0', 10) || 0;
    
    result.adsDetails.inAppMessages.push({ 
      title: name, 
      subtitle: click, 
      count: cnt, 
      timestamp: 0, 
      href: '', 
      kind: 'inapp' 
    });
  }
}

/**
 * Parse posts viewed data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parsePostsViewed(vfs, result) {
  const postsViewedText = getBySuffix(vfs, FILE_PATHS.POSTS_VIEWED);
  
  result.adsTopics.postsViewed = countWrappedArray(
    postsViewedText, 
    ['impressions_history_posts_seen', 'posts_seen', 'items']
  );
  
  if (!postsViewedText) return;
  
  const parsed = parseJsonSafe(postsViewedText, {});
  const list = Array.isArray(parsed?.impressions_history_posts_seen) 
    ? parsed.impressions_history_posts_seen 
    : (Array.isArray(parsed) ? parsed : []);
    
  for (const it of list) {
    const smd = it?.string_map_data || {};
    const author = smd?.Author?.value || smd?.Username?.value || smd?.Owner?.value || 'unknown';
    const ts = smd?.Time?.timestamp || 0;
    
    result.adsDetails.postsViewed.push({ 
      title: author, 
      timestamp: ts, 
      href: '', 
      kind: 'post' 
    });
  }
}

/**
 * Parse posts not interested data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parsePostsNotInterested(vfs, result) {
  const postsNIText = getBySuffix(vfs, FILE_PATHS.POSTS_NOT_INTERESTED);
  
  result.adsTopics.postsNotInterested = countWrappedArray(postsNIText, [
    "impressions_history_posts_not_interested",
    "impressions_history_posts_you're_not_interested_in",
    'posts_not_interested',
  ]);
  
  if (!postsNIText) return;
  
  const parsed = parseJsonSafe(postsNIText, {});
  const list = Array.isArray(parsed?.impressions_history_posts_not_interested) 
    ? parsed.impressions_history_posts_not_interested 
    : (Array.isArray(parsed) ? parsed : []);
    
  for (const it of list) {
    const sld = Array.isArray(it?.string_list_data) ? it.string_list_data : [];
    const href = sld?.find((e) => e?.href)?.href || '';
    const ts = sld?.find((e) => typeof e?.timestamp === 'number')?.timestamp || 0;
    
    result.adsDetails.postsNotInterested.push({ 
      title: href || 'Post marked not interested', 
      href, 
      timestamp: ts, 
      kind: 'post' 
    });
  }
}

/**
 * Parse profiles not interested data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseProfilesNotInterested(vfs, result) {
  const profilesNIText = getBySuffix(vfs, FILE_PATHS.PROFILES_NOT_INTERESTED);
  
  result.adsTopics.profilesNotInterested = countWrappedArray(profilesNIText, [
    "impressions_history_profiles_not_interested",
    "impressions_history_profiles_you're_not_interested_in",
    'profiles_not_interested',
    'impressions_history_recs_hidden_authors',
  ]);
  
  if (!profilesNIText) return;
  
  const parsed = parseJsonSafe(profilesNIText, {});
  let list = [];
  
  if (Array.isArray(parsed?.impressions_history_profiles_not_interested)) {
    list = parsed.impressions_history_profiles_not_interested;
  } else if (Array.isArray(parsed?.impressions_history_recs_hidden_authors)) {
    list = parsed.impressions_history_recs_hidden_authors;
  } else if (Array.isArray(parsed)) {
    list = parsed;
  }
  
  for (const it of list) {
    if (Array.isArray(it?.string_list_data)) {
      const sld = it.string_list_data;
      const href = sld?.find((e) => e?.href)?.href || '';
      const val = sld?.find((e) => e?.value)?.value || '';
      const ts = sld?.find((e) => typeof e?.timestamp === 'number')?.timestamp || 0;
      const title = val || (href || 'Profile marked not interested');
      
      result.adsDetails.profilesNotInterested.push({ 
        title, 
        href, 
        timestamp: ts, 
        kind: 'profile' 
      });
    } else {
      const smd = it?.string_map_data || {};
      const username = smd?.Username?.value || it?.title || '';
      const ts = smd?.Time?.timestamp || 0;
      
      result.adsDetails.profilesNotInterested.push({ 
        title: username || 'Profile', 
        href: smd?.Username?.href || '', 
        timestamp: ts, 
        kind: 'profile' 
      });
    }
  }
}

/**
 * Parse suggested profiles viewed data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseSuggestedProfiles(vfs, result) {
  const suggestedProfilesText = getBySuffix(vfs, FILE_PATHS.SUGGESTED_PROFILES);
  
  result.adsTopics.suggestedProfilesViewed = countWrappedArray(suggestedProfilesText, [
    'impressions_history_suggested_profiles_viewed',
    'suggested_profiles_viewed',
  ]);
  
  if (!suggestedProfilesText) return;
  
  const parsed = parseJsonSafe(suggestedProfilesText, {});
  let list = [];
  
  if (Array.isArray(parsed?.impressions_history_suggested_profiles_viewed)) {
    list = parsed.impressions_history_suggested_profiles_viewed;
  } else if (Array.isArray(parsed?.impressions_history_chaining_seen)) {
    list = parsed.impressions_history_chaining_seen;
  } else if (Array.isArray(parsed)) {
    list = parsed;
  }
  
  for (const it of list) {
    const smd = it?.string_map_data || {};
    const sld = Array.isArray(it?.string_list_data) ? it.string_list_data : [];
    const username = smd?.Username?.value || smd?.Author?.value || 
                    (sld?.find((e) => e?.value)?.value) || 'profile';
    const ts = smd?.Time?.timestamp || 
               sld?.find((e) => typeof e?.timestamp === 'number')?.timestamp || 0;
    
    result.adsDetails.suggestedProfilesViewed.push({ 
      title: username, 
      href: '', 
      timestamp: ts, 
      kind: 'profile' 
    });
  }
}

/**
 * Parse videos watched data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseVideosWatched(vfs, result) {
  const videosWatchedText = getBySuffix(vfs, FILE_PATHS.VIDEOS_WATCHED);
  
  result.adsTopics.videosWatched = countWrappedArray(videosWatchedText, [
    'impressions_history_videos_watched',
    'videos_watched',
  ]);
  
  if (!videosWatchedText) return;
  
  const parsed = parseJsonSafe(videosWatchedText, {});
  let list = [];
  
  if (Array.isArray(parsed?.impressions_history_videos_watched)) {
    list = parsed.impressions_history_videos_watched;
  } else if (Array.isArray(parsed)) {
    list = parsed;
  }
  
  for (const it of list) {
    const smd = it?.string_map_data || {};
    const author = smd?.Author?.value || smd?.Username?.value || 'unknown';
    const ts = smd?.Time?.timestamp || 0;
    const href = smd?.Link?.href || '';
    
    result.adsDetails.videosWatched.push({ 
      title: author, 
      href, 
      timestamp: ts, 
      kind: 'video' 
    });
  }
}

/**
 * Parse ads businesses data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseAdsBusiness(vfs, result) {
  // Advertisers
  const advertisersText = getBySuffix(vfs, 'ads_information/instagram_ads_and_businesses/advertisers_using_your_activity_or_information.json');
  if (advertisersText) {
    const obj = parseJsonSafe(advertisersText, {});
    const items = Array.isArray(obj?.ig_custom_audiences_all_types) 
      ? obj.ig_custom_audiences_all_types 
      : (Array.isArray(obj) ? obj : []);
      
    result.adsBusiness.advertisers = items
      .map((it) => {
        // Support multiple shapes
        if (typeof it?.advertiser_name === 'string') return it.advertiser_name;
        if (typeof it?.name === 'string') return it.name;
        return it?.string_map_data?.['Advertiser name']?.value || it?.title || '';
      })
      .filter(Boolean);
  }

  // Other categories
  const otherCatsText = getBySuffix(vfs, "ads_information/instagram_ads_and_businesses/other_categories_used_to_reach_you.json");
  if (otherCatsText) {
    const obj = parseJsonSafe(otherCatsText, {});
    const items = Array.isArray(obj?.inferred_topics) 
      ? obj.inferred_topics 
      : (Array.isArray(obj) ? obj : []);
      
    result.adsBusiness.otherCategories = items
      .map((it) => it?.topic || it?.name || it?.string_map_data?.Topic?.value || it?.title || '')
      .filter(Boolean);
  }

  // Ad preferences
  const adPrefText = getBySuffix(vfs, 'ads_information/instagram_ads_and_businesses/ad_preferences.json');
  if (adPrefText) {
    const obj = parseJsonSafe(adPrefText, {});
    const items = Array.isArray(obj?.ad_interests) 
      ? obj.ad_interests 
      : (Array.isArray(obj) ? obj : []);
      
    result.adsBusiness.adPreferences = items
      .map((it) => it?.ad_interest || it?.interest || it?.string_map_data?.['Ad interest']?.value || it?.title || '')
      .filter(Boolean);
  }

  // About Meta ads
  const aboutMetaText = getBySuffix(vfs, 'ads_information/instagram_ads_and_businesses/ads_about_meta.json');
  if (aboutMetaText) {
    const obj = parseJsonSafe(aboutMetaText, {});
    const items = Array.isArray(obj?.ads_about_meta) 
      ? obj.ads_about_meta 
      : (Array.isArray(obj) ? obj : []);
      
    result.adsBusiness.aboutMeta = items
      .map((it) => it?.topic || it?.name || it?.string_map_data?.Topic?.value || it?.title || '')
      .filter(Boolean);
  }
}
