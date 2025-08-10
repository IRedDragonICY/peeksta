/**
 * Comprehensive logged information parser
 * Handles link history, audience insights, content interactions, profile searches, and all logged data
 */

import { getBySuffix, parseJsonSafe, toDomain, sortTop, safeParseInt } from '../utils/index.js';

/**
 * Parse comprehensive logged information
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseLoggedInformation(vfs, result) {
  console.log('Starting parseLoggedInformation...');
  
  // Initialize logged information structure
  result.loggedInformation = {
    linkHistory: {
      data: [],
      count: 0,
      topDomains: [],
      recentLinks: []
    },
    audienceInsights: null,
    contentInteractions: null,
    profileSearches: {
      data: [],
      count: 0,
      topProfiles: []
    },
    postsInsights: {
      data: [],
      count: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalSaves: 0
    },
    reelsInsights: {
      data: [],
      count: 0,
      totalPlays: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalSaves: 0
    },
    profilesReached: null
  };

  // Parse link history
  parseLinkHistoryComprehensive(vfs, result);
  
  // Parse audience insights
  parseAudienceInsights(vfs, result);
  
  // Parse content interactions
  parseContentInteractions(vfs, result);
  
  // Parse profile searches
  parseProfileSearches(vfs, result);
  
  // Parse posts insights
  parsePostsInsights(vfs, result);
  
  // Parse reels insights
  parseReelsInsights(vfs, result);
  
  // Parse profiles reached
  parseProfilesReached(vfs, result);
  
  console.log('Finished parseLoggedInformation, result:', result.loggedInformation);
}

/**
 * Parse comprehensive link history data
 */
function parseLinkHistoryComprehensive(vfs, result) {
  const linkHistoryText = getBySuffix(vfs, 'logged_information/link_history/link_history.json');
  
  if (!linkHistoryText) {
    console.log('No link history file found');
    return;
  }
  
  const arr = parseJsonSafe(linkHistoryText, []);
  console.log('Parsed link history array:', arr.length, 'items');
  
  const domainCounts = {};
  const processedLinks = [];
  let total = 0;
  
  for (const item of arr) {
    const linkData = item?.label_values?.find((lv) => 
      lv?.label?.toLowerCase().includes('website link')
    );
    const titleData = item?.label_values?.find((lv) => 
      lv?.label?.toLowerCase().includes('title')
    );
    const startTimeData = item?.label_values?.find((lv) => 
      lv?.label?.toLowerCase().includes('start time')
    );
    const endTimeData = item?.label_values?.find((lv) => 
      lv?.label?.toLowerCase().includes('end time')
    );
    
    if (!linkData?.value) continue;
    
    const url = linkData.value;
    const title = titleData?.value || '';
    const startTime = startTimeData?.value || '';
    const endTime = endTimeData?.value || '';
    const domain = toDomain(url);
    
    processedLinks.push({
      url,
      title,
      startTime,
      endTime,
      domain,
      timestamp: item.timestamp,
      fbid: item.fbid
    });
    
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    total += 1;
  }
  
  console.log('Processed links:', total, 'total, domains:', Object.keys(domainCounts).length);
  
  result.loggedInformation.linkHistory = {
    data: processedLinks,
    count: total,
    topDomains: sortTop(domainCounts, 15),
    recentLinks: processedLinks.slice(0, 20)
  };
}

/**
 * Parse audience insights data
 */
function parseAudienceInsights(vfs, result) {
  const audienceText = getBySuffix(vfs, 'logged_information/past_instagram_insights/audience_insights.json');
  
  if (!audienceText) return;
  
  const obj = parseJsonSafe(audienceText, {});
  result.loggedInformation.audienceInsights = obj;
}

/**
 * Parse content interactions data
 */
function parseContentInteractions(vfs, result) {
  const interactionsText = getBySuffix(vfs, 'logged_information/past_instagram_insights/content_interactions.json');
  
  if (!interactionsText) return;
  
  const obj = parseJsonSafe(interactionsText, {});
  result.loggedInformation.contentInteractions = obj;
}

/**
 * Parse profile searches
 */
function parseProfileSearches(vfs, result) {
  const searchesText = getBySuffix(vfs, 'logged_information/recent_searches/profile_searches.json');
  
  if (!searchesText) return;
  
  const obj = parseJsonSafe(searchesText, {});
  const searches = Array.isArray(obj?.searches_user) ? obj.searches_user : [];
  const searchCounts = {};
  let total = 0;
  
  for (const search of searches) {
    const query = search?.string_map_data?.Search?.value || '';
    if (!query) continue;
    
    searchCounts[query] = (searchCounts[query] || 0) + 1;
    total += 1;
  }
  
  result.loggedInformation.profileSearches = {
    data: obj,
    count: total,
    topProfiles: sortTop(searchCounts, 15).map(({ key, count }) => ({ 
      name: key, 
      count 
    }))
  };
}

/**
 * Parse posts insights data
 */
function parsePostsInsights(vfs, result) {
  const postsText = getBySuffix(vfs, 'logged_information/past_instagram_insights/posts.json');
  
  if (!postsText) return;
  
  const obj = parseJsonSafe(postsText, {});
  const posts = Array.isArray(obj?.organic_insights_posts) ? obj.organic_insights_posts : [];
  
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalSaves = 0;
  
  const processedPosts = posts.map(post => {
    const smd = post?.string_map_data || {};
    const likes = safeParseInt(smd?.Likes?.value);
    const comments = safeParseInt(smd?.Comments?.value);
    const shares = safeParseInt(smd?.Shares?.value);
    const saves = safeParseInt(smd?.Saves?.value);
    const impressions = safeParseInt(smd?.Impressions?.value);
    const reach = safeParseInt(smd?.['Accounts reached']?.value);
    const profileVisits = safeParseInt(smd?.['Profile visits']?.value);
    const follows = safeParseInt(smd?.Follows?.value);
    
    totalLikes += likes;
    totalComments += comments;
    totalShares += shares;
    totalSaves += saves;
    
    return {
      ...post,
      metrics: {
        likes,
        comments,
        shares,
        saves,
        impressions,
        reach,
        profileVisits,
        follows
      }
    };
  });
  
  result.loggedInformation.postsInsights = {
    data: processedPosts,
    count: posts.length,
    totalLikes,
    totalComments,
    totalShares,
    totalSaves
  };
}

/**
 * Parse reels insights data
 */
function parseReelsInsights(vfs, result) {
  const reelsText = getBySuffix(vfs, 'logged_information/past_instagram_insights/reels.json');
  
  if (!reelsText) return;
  
  const obj = parseJsonSafe(reelsText, {});
  const reels = Array.isArray(obj?.organic_insights_reels) ? obj.organic_insights_reels : [];
  
  let totalPlays = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalSaves = 0;
  
  const processedReels = reels.map(reel => {
    const smd = reel?.string_map_data || {};
    const plays = safeParseInt(smd?.['Instagram Plays']?.value);
    const likes = safeParseInt(smd?.['Instagram Likes']?.value);
    const comments = safeParseInt(smd?.['Instagram Comments']?.value);
    const shares = safeParseInt(smd?.['Instagram Shares']?.value);
    const saves = safeParseInt(smd?.['Instagram Saves']?.value);
    const reach = safeParseInt(smd?.['Accounts reached']?.value);
    const duration = safeParseInt(smd?.Duration?.value);
    
    totalPlays += plays;
    totalLikes += likes;
    totalComments += comments;
    totalShares += shares;
    totalSaves += saves;
    
    return {
      ...reel,
      metrics: {
        plays,
        likes,
        comments,
        shares,
        saves,
        reach,
        duration
      }
    };
  });
  
  result.loggedInformation.reelsInsights = {
    data: processedReels,
    count: reels.length,
    totalPlays,
    totalLikes,
    totalComments,
    totalShares,
    totalSaves
  };
}

/**
 * Parse profiles reached data
 */
function parseProfilesReached(vfs, result) {
  const profilesText = getBySuffix(vfs, 'logged_information/past_instagram_insights/profiles_reached.json');
  
  if (!profilesText) return;
  
  const obj = parseJsonSafe(profilesText, {});
  result.loggedInformation.profilesReached = obj;
}

/**
 * Extract media information from logged data
 */
export function extractMediaInfo(vfs, result) {
  if (!result.loggedInformation) return;
  
  let mediaCount = 0;
  
  // Count media from posts
  if (result.loggedInformation.postsInsights?.data) {
    result.loggedInformation.postsInsights.data.forEach(post => {
      if (post?.media_map_data?.['Media Thumbnail']) {
        mediaCount++;
      }
    });
  }
  
  // Count media from reels
  if (result.loggedInformation.reelsInsights?.data) {
    result.loggedInformation.reelsInsights.data.forEach(reel => {
      if (reel?.media_map_data?.['Media Thumbnail']) {
        mediaCount++;
      }
    });
  }
  
  result.loggedInformation.mediaCount = mediaCount;
}

// Export individual parsers for backward compatibility
export {
  parseLinkHistoryComprehensive,
  parseAudienceInsights,
  parseContentInteractions,
  parseProfileSearches,
  parsePostsInsights,
  parseReelsInsights,
  parseProfilesReached
};
