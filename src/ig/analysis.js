/**
 * Instagram Export Analysis - Main Orchestrator
 * High-level ingestion (ZIP or directory) -> virtual JSON FS -> aggregated analytics
 */

import { createStepFunction } from './utils/index.js';
import { createResultTemplate } from './constants/resultTemplate.js';
import { ingestZipFile, ingestDirectoryFiles } from './ingestion/index.js';
import {
  // Profile parsers
  parseProfile,
  parsePersonalInfoDetails,
  parseInfoAboutYou,
  
  // Connections parsers
  parseFollowersAndFollowing,
  parseRecentlyUnfollowed,
  parseContacts,
  parseConnectionExtras,
  
  // Activity parsers
  parseLikes,
  parseComments,
  parseCommentsExtra,
  parseLinkHistory,
  parseMediaStats,
  parseStoryInteractions,
  parseOtherActivities,
  
  // Ads parsers
  parseAdsViewed,
  parseInAppMessages,
  parsePostsViewed,
  parsePostsNotInterested,
  parseProfilesNotInterested,
  parseSuggestedProfiles,
  parseVideosWatched,
  parseAdsBusiness,
  
  // Security parser
  parseLoginActivity,
  
  // Messages parsers
  parseMessages,
  parseMessagesExtra,
  parseThreads,
  parseThreadsExtra,
  
  // Insights and misc parsers
  parseInsights,
  parsePreferences,
  parsePreferencesExtended,
  parseTopicsAndSearches,
  parseDevices,
  parseApps,
  parseLoggedInformation,
  extractMediaInfo,
} from './parsers/index.js';

/**
 * Aggregate analytics from Virtual File System
 * @param {Map} vfs - Virtual file system mapping path -> JSON content
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeVfs(vfs, onProgress) {
  const step = createStepFunction(onProgress);
  const result = createResultTemplate();

  // Parse profile information
  step('Parsing profile information');
  parseProfile(vfs, result);
  parsePersonalInfoDetails(vfs, result);
  parseInfoAboutYou(vfs, result);

  // Parse connections and relationships
  step('Parsing followers & following');
  parseFollowersAndFollowing(vfs, result);
  
  step('Parsing recently unfollowed');
  parseRecentlyUnfollowed(vfs, result);
  
  step('Parsing contacts');
  parseContacts(vfs, result);
  parseConnectionExtras(vfs, result);

  // Parse activities
  step('Parsing likes');
  parseLikes(vfs, result);
  
  step('Parsing comments');
  parseComments(vfs, result);
  parseCommentsExtra(vfs, result);
  
  step('Parsing link history');
  parseLinkHistory(vfs, result);
  
  step('Parsing media stats');
  parseMediaStats(vfs, result);
  parseStoryInteractions(vfs, result);
  parseOtherActivities(vfs, result);

  // Parse ads and advertising data
  step('Parsing ads');
  parseAdsViewed(vfs, result);
  parseInAppMessages(vfs, result);
  parsePostsViewed(vfs, result);
  parsePostsNotInterested(vfs, result);
  parseProfilesNotInterested(vfs, result);
  parseSuggestedProfiles(vfs, result);
  parseVideosWatched(vfs, result);
  
  step('Parsing ad businesses');
  parseAdsBusiness(vfs, result);

  // Parse security information
  step('Parsing security & login');
  parseLoginActivity(vfs, result);

  // Parse messages and communication
  step('Parsing messages');
  parseMessages(vfs, result);
  parseMessagesExtra(vfs, result);
  
  step('Parsing Threads');
  parseThreads(vfs, result);
  parseThreadsExtra(vfs, result);

  // Parse insights and preferences
  step('Parsing insights');
  parseInsights(vfs, result);
  
  step('Parsing preferences');
  parsePreferences(vfs, result);
  parsePreferencesExtended(vfs, result);
  
  step('Parsing topics, searches, devices');
  parseTopicsAndSearches(vfs, result);
  parseDevices(vfs, result);
  
  step('Parsing apps & websites');
  parseApps(vfs, result);

  // Parse comprehensive logged information
  step('Parsing logged information');
  parseLoggedInformation(vfs, result);
  extractMediaInfo(vfs, result);

  if (onProgress) onProgress(1, 'Analysis complete');
  return result;
}

// Re-export ingestion functions for backward compatibility
export { ingestZipFile, ingestDirectoryFiles };

export default {
  ingestZipFile,
  ingestDirectoryFiles,
  analyzeVfs,
};