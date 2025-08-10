/**
 * Result template and constants for Instagram analysis
 */

/**
 * Create initial result template
 * @returns {Object} Initial analysis result structure
 */
export function createResultTemplate() {
  return {
    profile: null,
    followers: { count: 0, list: [] },
    following: { count: 0, list: [] },
    notFollowingBack: [],
    recentlyUnfollowed: [],
    likes: { postsCount: 0, commentLikesCount: 0, recent: [] },
    comments: { count: 0, recent: [] },
    messages: { conversationsCount: 0, messagesCount: 0, topPeople: [] },
    linkHistory: { count: 0, topDomains: [] },
    ads: { impressionsCount: 0, topAuthors: [] },
    adsTopics: { 
      postsViewed: 0, 
      postsNotInterested: 0, 
      profilesNotInterested: 0, 
      suggestedProfilesViewed: 0, 
      videosWatched: 0, 
      inAppMessages: 0 
    },
    adsDetails: { 
      adsViewed: [], 
      postsViewed: [], 
      postsNotInterested: [], 
      profilesNotInterested: [], 
      suggestedProfilesViewed: [], 
      videosWatched: [], 
      inAppMessages: [] 
    },
    adsBusiness: { advertisers: [], otherCategories: [], adPreferences: [], aboutMeta: [] },
    apps: { active: [], expired: [], offMetaActivity: [], offMetaTotals: { events: 0 }, expiredCount: 0, offMetaSettings: {} },
    security: { logins: [] },
    threads: { postsCount: 0, likedCount: 0, viewedCount: 0, recentPosts: [] },
    insights: { 
      postsCount: 0, 
      totals: { likes: 0, comments: 0, saves: 0 }, 
      avg: { likes: 0, comments: 0, saves: 0 }, 
      posts: [] 
    },
    topics: [],
    searches: { count: 0, topProfiles: [] },
    devices: [],
    cameras: 0,
    mediaStats: { posts: 0, reels: 0, stories: 0, archived: 0, profilePhotos: 0, deleted: 0 },
    storyInteractions: { likes: 0, polls: 0, questions: 0, quizzes: 0, emojis: 0, countdowns: 0 },
    saved: { posts: 0 },
    shopping: { recentlyViewed: 0 },
    events: { reminders: 0 },
    monetization: { gifts: 0, eligibility: null },
    contacts: { synced: 0 },
    connectionsExtra: { closeFriends: 0, pendingRequests: 0, recentRequests: 0, removedSuggestions: 0 },
    connectionLists: { 
      followers: [], 
      following: [], 
      closeFriends: [], 
      pendingRequests: [], 
      recentRequests: [], 
      removedSuggestions: [], 
      recentlyUnfollowed: [], 
      syncedContacts: [] 
    },
    infoAboutYou: { locationsOfInterest: 0, possiblePhoneNumbers: 0, profileBasedIn: '' },
    personalInfoDetails: { friendMap: 0, noteInteractions: 0, professional: {}, profileChanges: 0, profile: {} },
    preferencesExtended: { commentsAllowedFrom: '', consents: 0, filteredKeywords: 0, crossAppMessaging: '' },
    commentsExtra: { reelsComments: 0, hype: 0 },
    messagesExtra: { reportedConversations: 0, secretConversations: 0, chatInfo: 0 },
    otherActivity: { downloadRequests: 0 },
    subscriptions: { showExclusiveStoryPromo: false, mutedStoryTeasers: 0 },
    threadsExtra: { followers: 0, following: 0, drafts: 0 },
    loggedInformation: {
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
      profilesReached: null,
      mediaCount: 0
    },
  };
}

/**
 * File path constants for Instagram export structure
 */
export const FILE_PATHS = {
  PROFILE: 'personal_information/personal_information/personal_information.json',
  FOLLOWERS: 'connections/followers_and_following/followers_1.json',
  FOLLOWING: 'connections/followers_and_following/following.json',
  RECENTLY_UNFOLLOWED_CONN: 'connections/followers_and_following/recently_unfollowed_profiles.json',
  RECENTLY_UNFOLLOWED_THREADS: 'your_instagram_activity/threads/recently_unfollowed_profiles.json',
  LIKED_POSTS: 'your_instagram_activity/likes/liked_posts.json',
  LIKED_COMMENTS: 'your_instagram_activity/likes/liked_comments.json',
  COMMENTS: 'your_instagram_activity/comments/post_comments_1.json',
  LINK_HISTORY: 'logged_information/link_history/link_history.json',
  ADS_VIEWED: 'ads_information/ads_and_topics/ads_viewed.json',
  IN_APP_MESSAGES: 'ads_information/ads_and_topics/in-app_message.json',
  POSTS_VIEWED: 'ads_information/ads_and_topics/posts_viewed.json',
  POSTS_NOT_INTERESTED: "ads_information/ads_and_topics/posts_you're_not_interested_in.json",
  PROFILES_NOT_INTERESTED: "ads_information/ads_and_topics/profiles_you're_not_interested_in.json",
  SUGGESTED_PROFILES: 'ads_information/ads_and_topics/suggested_profiles_viewed.json',
  VIDEOS_WATCHED: 'ads_information/ads_and_topics/videos_watched.json',
  LOGIN_ACTIVITY: 'security_and_login_information/login_and_profile_creation/login_activity.json',
  THREADS_AND_REPLIES: 'your_instagram_activity/threads/threads_and_replies.json',
  INSIGHTS_POSTS: 'logged_information/past_instagram_insights/posts.json',
  NOTIFICATION_PREFERENCES: 'preferences/settings/notification_preferences.json',
  CONTACTS: 'connections/contacts/synced_contacts.json',
  CLOSE_FRIENDS: 'connections/followers_and_following/close_friends.json',
};
