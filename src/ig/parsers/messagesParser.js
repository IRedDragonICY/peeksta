/**
 * Messages and communication data parser
 */

import { getBySuffix, parseJsonSafe, sortTop } from '../utils/index.js';
import { FILE_PATHS } from '../constants/resultTemplate.js';

/**
 * Parse messages and conversations
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseMessages(vfs, result) {
  const topPeopleCounts = {};
  let conversations = 0;
  let messagesTotal = 0;
  
  for (const [path, text] of vfs.entries()) {
    if (!path.includes('your_instagram_activity/messages/inbox/') || !path.endsWith('.json')) continue;
    
    const convo = parseJsonSafe(text, {});
    const participants = (Array.isArray(convo?.participants) ? convo.participants : [])
      .map((p) => p?.name).filter(Boolean);
    const primary = participants.find((n) => n && n !== result.profile?.name) || 
                   participants[0] || 'unknown';
    const msgs = Array.isArray(convo?.messages) ? convo.messages : [];
    const count = msgs.length;
    
    if (count === 0) continue;
    
    conversations += 1;
    messagesTotal += count;
    topPeopleCounts[primary] = (topPeopleCounts[primary] || 0) + count;
  }
  
  result.messages.conversationsCount = conversations;
  result.messages.messagesCount = messagesTotal;
  result.messages.topPeople = sortTop(topPeopleCounts, 15).map(({ key, count }) => ({ 
    name: key, 
    count 
  }));
}

/**
 * Parse messages extras
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseMessagesExtra(vfs, result) {
  // Reported conversations
  const reportedConversationsText = getBySuffix(vfs, 'your_instagram_activity/messages/reported_conversations.json');
  if (reportedConversationsText) {
    const arr = parseJsonSafe(reportedConversationsText, []);
    result.messagesExtra.reportedConversations = Array.isArray(arr) ? arr.length : 0;
  }

  // Secret conversations
  const secretConversationsText = getBySuffix(vfs, 'your_instagram_activity/messages/secret_conversations.json');
  if (secretConversationsText) {
    const arr = parseJsonSafe(secretConversationsText, []);
    result.messagesExtra.secretConversations = Array.isArray(arr) ? arr.length : 0;
  }

  // Chat info
  const chatInfoText = getBySuffix(vfs, 'your_instagram_activity/messages/your_chat_information.json');
  if (chatInfoText) {
    const arr = parseJsonSafe(chatInfoText, []);
    result.messagesExtra.chatInfo = Array.isArray(arr) ? arr.length : 0;
  }
}

/**
 * Parse Threads data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseThreads(vfs, result) {
  // Threads and replies
  const threadsAndRepliesText = getBySuffix(vfs, FILE_PATHS.THREADS_AND_REPLIES);
  if (threadsAndRepliesText) {
    const obj = parseJsonSafe(threadsAndRepliesText, {});
    const posts = Array.isArray(obj?.text_post_app_text_posts) ? obj.text_post_app_text_posts : [];
    const recent = [];
    let count = 0;
    
    for (const p of posts) {
      const media = Array.isArray(p.media) ? p.media : [];
      const created = media?.[0]?.creation_timestamp || p?.creation_timestamp || 0;
      let title = p?.title || media?.[0]?.title || '';
      
      if (!title && p?.media?.length) {
        title = p.media[0].title || '';
      }
      
      if (title || created) {
        recent.push({ title, timestamp: created });
      }
      
      count += 1;
    }
    
    result.threads.postsCount = count;
    result.threads.recentPosts = recent.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
  }

  // Liked threads
  const likedThreadsText = getBySuffix(vfs, 'your_instagram_activity/threads/liked_threads.json');
  if (likedThreadsText) {
    const arr = parseJsonSafe(likedThreadsText, []);
    result.threads.likedCount = Array.isArray(arr) ? arr.length : 0;
  }

  // Viewed threads
  const viewedThreadsText = getBySuffix(vfs, 'your_instagram_activity/threads/threads_viewed.json');
  if (viewedThreadsText) {
    const arr = parseJsonSafe(viewedThreadsText, []);
    result.threads.viewedCount = Array.isArray(arr) ? arr.length : 0;
  }
}

/**
 * Parse Threads extra data
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseThreadsExtra(vfs, result) {
  // Threads followers
  const threadsFollowersText = getBySuffix(vfs, 'your_instagram_activity/threads/followers.json');
  if (threadsFollowersText) {
    const arr = parseJsonSafe(threadsFollowersText, []);
    result.threadsExtra.followers = Array.isArray(arr) ? arr.length : 0;
  }

  // Threads following
  const threadsFollowingText = getBySuffix(vfs, 'your_instagram_activity/threads/following.json');
  if (threadsFollowingText) {
    const arr = parseJsonSafe(threadsFollowingText, []);
    result.threadsExtra.following = Array.isArray(arr) ? arr.length : 0;
  }

  // Threads drafts
  const threadsDraftsText = getBySuffix(vfs, 'your_instagram_activity/threads/your_drafts.json');
  if (threadsDraftsText) {
    const arr = parseJsonSafe(threadsDraftsText, []);
    result.threadsExtra.drafts = Array.isArray(arr) ? arr.length : 0;
  }
}
