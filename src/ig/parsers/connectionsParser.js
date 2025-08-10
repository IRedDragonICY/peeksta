/**
 * Connections and relationships parser
 */

import { 
  getBySuffix, 
  parseJsonSafe, 
  extractStringListUsernames, 
  extractRelationshipsFollowing,
  extractRecentlyUnfollowed 
} from '../utils/index.js';
import { FILE_PATHS } from '../constants/resultTemplate.js';

/**
 * Parse followers and following data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseFollowersAndFollowing(vfs, result) {
  const followersText = getBySuffix(vfs, FILE_PATHS.FOLLOWERS);
  const followingText = getBySuffix(vfs, FILE_PATHS.FOLLOWING);
  
  const followersJson = followersText ? parseJsonSafe(followersText, []) : [];
  const followingJson = followingText ? parseJsonSafe(followingText, {}) : {};

  const followersList = extractStringListUsernames(followersJson);
  const followingList = extractRelationshipsFollowing(followingJson);
  
  result.followers = { count: followersList.length, list: followersList };
  result.following = { count: followingList.length, list: followingList };
  
  const followerSet = new Set(followersList);
  result.notFollowingBack = followingList.filter((u) => !followerSet.has(u));
  
  result.connectionLists.followers = followersList;
  result.connectionLists.following = followingList;
}

/**
 * Parse recently unfollowed profiles
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseRecentlyUnfollowed(vfs, result) {
  const recentUnfConnText = getBySuffix(vfs, FILE_PATHS.RECENTLY_UNFOLLOWED_CONN);
  const recentUnfThreadsText = getBySuffix(vfs, FILE_PATHS.RECENTLY_UNFOLLOWED_THREADS);
  
  const connUsernames = extractRecentlyUnfollowed(recentUnfConnText);
  const threadsUsernames = extractRecentlyUnfollowed(recentUnfThreadsText);
  
  result.recentlyUnfollowed = [...new Set([...connUsernames, ...threadsUsernames])];
  result.connectionLists.recentlyUnfollowed = result.recentlyUnfollowed;
}

/**
 * Parse contacts data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseContacts(vfs, result) {
  const contactsText = getBySuffix(vfs, FILE_PATHS.CONTACTS);
  
  if (!contactsText) return;
  
  const arr = parseJsonSafe(contactsText, []);
  result.contacts.synced = Array.isArray(arr) ? arr.length : 0;
  
  const contacts = [];
  const source = Array.isArray(arr) ? arr : [];
  
  for (const it of source) {
    const smd = it?.string_map_data || {};
    const name = smd?.Name?.value || it?.title || '';
    const phone = smd?.Phone?.value || smd?.['Phone Number']?.value || '';
    const email = smd?.Email?.value || '';
    
    if (name || phone || email) {
      contacts.push({ name, phone, email });
    }
  }
  
  result.connectionLists.syncedContacts = contacts;
}

/**
 * Parse connection extras (close friends, requests, etc.)
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseConnectionExtras(vfs, result) {
  // Close friends
  const closeFriendsText = getBySuffix(vfs, FILE_PATHS.CLOSE_FRIENDS);
  if (closeFriendsText) {
    const arr = parseJsonSafe(closeFriendsText, []);
    const list = Array.isArray(arr)
      ? arr
      : Array.isArray(arr?.relationships_close_friends)
        ? arr.relationships_close_friends
        : [];
    const usernames = extractStringListUsernames(list);
    result.connectionsExtra.closeFriends = usernames.length;
    result.connectionLists.closeFriends = usernames;
  }

  // Pending requests
  const pendingRequestsText = getBySuffix(vfs, 'connections/followers_and_following/pending_follow_requests.json');
  if (pendingRequestsText) {
    const obj = parseJsonSafe(pendingRequestsText, {});
    let list = [];
    
    if (Array.isArray(obj?.relationships_follow_requests_pending)) {
      list = obj.relationships_follow_requests_pending;
    } else if (Array.isArray(obj?.relationships_follow_requests)) {
      list = obj.relationships_follow_requests;
    } else if (Array.isArray(obj?.relationships_follow_requests_sent)) {
      list = obj.relationships_follow_requests_sent; // outgoing requests
    } else if (Array.isArray(obj)) {
      list = obj;
    }
    
    const usernames = extractStringListUsernames(list);
    result.connectionsExtra.pendingRequests = usernames.length;
    result.connectionLists.pendingRequests = usernames;
  }

  // Recent follow requests
  const recentFollowReqText = getBySuffix(vfs, 'connections/followers_and_following/recent_follow_requests.json');
  if (recentFollowReqText) {
    const obj = parseJsonSafe(recentFollowReqText, {});
    let list = [];
    
    if (Array.isArray(obj?.relationships_follow_requests_recent)) {
      list = obj.relationships_follow_requests_recent;
    } else if (Array.isArray(obj?.relationships_permanent_follow_requests)) {
      list = obj.relationships_permanent_follow_requests;
    } else if (Array.isArray(obj?.relationships_follow_requests)) {
      list = obj.relationships_follow_requests;
    } else if (Array.isArray(obj)) {
      list = obj;
    }
    
    const usernames = extractStringListUsernames(list);
    result.connectionsExtra.recentRequests = usernames.length;
    result.connectionLists.recentRequests = usernames;
  }

  // Removed suggestions
  const removedSuggestionsText = getBySuffix(vfs, 'connections/followers_and_following/removed_suggestions.json');
  if (removedSuggestionsText) {
    const obj = parseJsonSafe(removedSuggestionsText, {});
    let list = [];
    
    if (Array.isArray(obj?.relationships_dismissed_suggested_users)) {
      list = obj.relationships_dismissed_suggested_users;
    } else if (Array.isArray(obj)) {
      list = obj;
    }
    
    const usernames = extractStringListUsernames(list);
    result.connectionsExtra.removedSuggestions = usernames.length;
    result.connectionLists.removedSuggestions = usernames;
  }
}
