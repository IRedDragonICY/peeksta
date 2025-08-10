/**
 * Activity data parser (likes, comments, links, etc.)
 */

import { 
  getBySuffix, 
  parseJsonSafe, 
  toDomain, 
  sortTop,
  countArrayFile 
} from '../utils/index.js';
import { FILE_PATHS } from '../constants/resultTemplate.js';

/**
 * Parse likes data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseLikes(vfs, result) {
  // Liked posts
  const likedPostsText = getBySuffix(vfs, FILE_PATHS.LIKED_POSTS);
  if (likedPostsText) {
    const obj = parseJsonSafe(likedPostsText, {});
    const items = Array.isArray(obj?.likes_media_likes) ? obj.likes_media_likes : [];
    
    result.likes.postsCount = items.length;
    result.likes.recent = items.slice(0, 20).map((it) => ({
      author: it?.title || '',
      href: it?.string_list_data?.[0]?.href || '',
      timestamp: it?.string_list_data?.[0]?.timestamp || 0,
    }));
  }

  // Liked comments
  const likedCommentsText = getBySuffix(vfs, FILE_PATHS.LIKED_COMMENTS);
  if (likedCommentsText) {
    const obj = parseJsonSafe(likedCommentsText, {});
    const items = Array.isArray(obj?.likes_comment_likes) ? obj.likes_comment_likes : [];
    result.likes.commentLikesCount = items.length;
  }
}

/**
 * Parse comments data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseComments(vfs, result) {
  const commentsText = getBySuffix(vfs, FILE_PATHS.COMMENTS);
  
  if (!commentsText) return;
  
  const arr = parseJsonSafe(commentsText, []);
  result.comments.count = Array.isArray(arr) ? arr.length : 0;
  result.comments.recent = (Array.isArray(arr) ? arr : []).slice(0, 20).map((it) => ({
    comment: it?.string_map_data?.Comment?.value || '',
    owner: it?.string_map_data?.['Media Owner']?.value || '',
    timestamp: it?.string_map_data?.Time?.timestamp || 0,
  }));
}

/**
 * Parse comments extras
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseCommentsExtra(vfs, result) {
  // Reels comments
  const reelsCommentsText = getBySuffix(vfs, 'your_instagram_activity/comments/reels_comments.json');
  if (reelsCommentsText) {
    const arr = parseJsonSafe(reelsCommentsText, []);
    result.commentsExtra.reelsComments = Array.isArray(arr) ? arr.length : 0;
  }

  // Hype
  const hypeText = getBySuffix(vfs, 'your_instagram_activity/comments/hype.json');
  if (hypeText) {
    const arr = parseJsonSafe(hypeText, []);
    result.commentsExtra.hype = Array.isArray(arr) ? arr.length : 0;
  }
}

/**
 * Parse link history
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseLinkHistory(vfs, result) {
  const linkHistoryText = getBySuffix(vfs, FILE_PATHS.LINK_HISTORY);
  
  if (!linkHistoryText) return;
  
  const arr = parseJsonSafe(linkHistoryText, []);
  const domainCounts = {};
  let total = 0;
  
  for (const item of arr) {
    const url = item?.label_values?.find((lv) => 
      lv?.label?.toLowerCase().includes('website link')
    )?.value;
    
    if (!url) continue;
    
    const dom = toDomain(url);
    domainCounts[dom] = (domainCounts[dom] || 0) + 1;
    total += 1;
  }
  
  result.linkHistory.count = total;
  result.linkHistory.topDomains = sortTop(domainCounts, 15);
}

/**
 * Parse media statistics
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseMediaStats(vfs, result) {
  result.mediaStats.posts = countArrayFile(vfs, 'your_instagram_activity/media/posts_1.json');
  result.mediaStats.reels = countArrayFile(vfs, 'your_instagram_activity/media/reels.json');
  result.mediaStats.stories = countArrayFile(vfs, 'your_instagram_activity/media/stories.json');
  result.mediaStats.archived = countArrayFile(vfs, 'your_instagram_activity/media/archived_posts.json');
  result.mediaStats.profilePhotos = countArrayFile(vfs, 'your_instagram_activity/media/profile_photos.json');
  result.mediaStats.deleted = countArrayFile(vfs, 'your_instagram_activity/media/recently_deleted_content.json');
}

/**
 * Parse story interactions
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseStoryInteractions(vfs, result) {
  result.storyInteractions.likes = countArrayFile(vfs, 'your_instagram_activity/story_interactions/story_likes.json');
  result.storyInteractions.polls = countArrayFile(vfs, 'your_instagram_activity/story_interactions/polls.json');
  result.storyInteractions.questions = countArrayFile(vfs, 'your_instagram_activity/story_interactions/questions.json');
  result.storyInteractions.quizzes = countArrayFile(vfs, 'your_instagram_activity/story_interactions/quizzes.json');
  result.storyInteractions.emojis = countArrayFile(vfs, 'your_instagram_activity/story_interactions/emoji_sliders.json');
  result.storyInteractions.countdowns = countArrayFile(vfs, 'your_instagram_activity/story_interactions/countdowns.json');
}

/**
 * Parse saved, shopping, events, and monetization data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseOtherActivities(vfs, result) {
  // Saved posts
  result.saved.posts = countArrayFile(vfs, 'your_instagram_activity/saved/saved_posts.json');
  
  // Shopping
  result.shopping.recentlyViewed = countArrayFile(vfs, 'your_instagram_activity/shopping/recently_viewed_items.json');
  
  // Events
  result.events.reminders = countArrayFile(vfs, 'your_instagram_activity/events/event_reminders.json');

  // Monetization - gifts
  const giftsText = getBySuffix(vfs, 'your_instagram_activity/monetization/gifts.json');
  if (giftsText) {
    const arr = parseJsonSafe(giftsText, []);
    result.monetization.gifts = Array.isArray(arr) ? arr.length : 0;
  }

  // Monetization - eligibility
  const eligibilityText = getBySuffix(vfs, 'your_instagram_activity/monetization/eligibility.json');
  if (eligibilityText) {
    const obj = parseJsonSafe(eligibilityText, {});
    result.monetization.eligibility = obj?.eligibility || obj?.title || null;
  }

  // Other activity - download requests
  const downloadReqText = getBySuffix(vfs, 'your_instagram_activity/other_activity/your_information_download_requests.json');
  if (downloadReqText) {
    const arr = parseJsonSafe(downloadReqText, []);
    result.otherActivity.downloadRequests = Array.isArray(arr) ? arr.length : 0;
  }

  // Subscriptions
  const showExclusiveText = getBySuffix(vfs, 'your_instagram_activity/subscriptions/show_exclusive_story_promo_setting.json');
  if (showExclusiveText) {
    const obj = parseJsonSafe(showExclusiveText, {});
    result.subscriptions.showExclusiveStoryPromo = Boolean(
      obj?.string_map_data?.Value?.value === 'True' || 
      obj?.string_map_data?.Value?.value === 'true'
    );
  }

  const mutedTeasersText = getBySuffix(vfs, 'your_instagram_activity/subscriptions/your_muted_story_teaser_creators.json');
  if (mutedTeasersText) {
    const arr = parseJsonSafe(mutedTeasersText, []);
    result.subscriptions.mutedStoryTeasers = Array.isArray(arr) ? arr.length : 0;
  }
}
