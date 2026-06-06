import {
  SocialUser,
  FriendRequest,
  Friendship,
  Conversation,
  ConversationMember,
  Message,
  MessageRead,
  XPTransaction,
  AchievementPost,
  UserAchievementProgress,
  getRequiredXpForLevel,
  XP_PAYOUTS,
} from "./socialState";

// Key definitions for LocalStorage persistence
const KEYS = {
  USERS: "spark_social_users",
  FRIEND_REQUESTS: "spark_social_requests",
  FRIENDSHIPS: "spark_social_friendships",
  CONVERSATIONS: "spark_social_conversations",
  MEMBERS: "spark_social_members",
  MESSAGES: "spark_social_messages",
  MESSAGE_READS: "spark_social_message_reads",
  TRACK_XP: "spark_social_xp_transactions",
  ACHIEVEMENTS: "spark_social_achievements",
};

// STATIC ACHIEVEMENTS DATA
export const GLOBAL_ACHIEVEMENTS: AchievementPost[] = [
  { id: "ach-1", name: "Stream 100 hours", description: "Stream your travel journeys continuously on the platform", icon_url: "🎥", xp_reward: 500, target: 100 },
  { id: "ach-2", name: "Get 1,000 followers", description: "Gain tourist followers in the dynamic stream directory", icon_url: "📈", xp_reward: 300, target: 1000 },
  { id: "ach-3", name: "Send 500 messages", description: "Incorporate chat and inquiries across regional guides", icon_url: "💬", xp_reward: 200, target: 500 },
  { id: "ach-4", name: "Invite 50 friends", description: "Scale up your network of cultural creators and tour companions", icon_url: "🤝", xp_reward: 400, target: 50 },
];

// Seed initial system users
const INITIAL_SYSTEM_USERS: SocialUser[] = [
  {
    id: "guide_lalibela",
    name: "Lalibela Tour Guide",
    avatarUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=200",
    level: 15,
    current_xp: 320,
    total_xp: 15400,
    friendsCount: 12431,
    followersCount: 89000,
    isFollowed: true,
    badges: ["Diamond Streamer", "Top Creator 2026", "Lalibela Cross Certificate"],
  },
  {
    id: "coffee_heritage",
    name: "Coffee Ceremony Master",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    level: 12,
    current_xp: 120,
    total_xp: 9800,
    friendsCount: 1234,
    followersCount: 25342,
    isFollowed: false,
    badges: ["Top Commentator Badge", "100 Day Streak Badge"],
  },
  {
    id: "axum_explorer",
    name: "Axum Obelisk Watch",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    level: 8,
    current_xp: 180,
    total_xp: 4500,
    friendsCount: 450,
    followersCount: 1500,
    isFollowed: false,
    badges: ["Heritage Defender"],
  },
  {
    id: "sof_omar_caves",
    name: "Sof Omar Hiker",
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200",
    level: 6,
    current_xp: 220,
    total_xp: 3100,
    friendsCount: 820,
    followersCount: 4500,
    isFollowed: false,
    badges: ["Caves Pioneer"],
  },
  {
    id: "helen_tesfaye",
    name: "Helen Tesfaye",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    level: 10,
    current_xp: 290,
    total_xp: 7500,
    friendsCount: 110,
    followersCount: 320,
    isFollowed: true,
    badges: ["Bronze Adventurer"],
  },
  {
    id: "yared_abera",
    name: "Yared Abera",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    level: 5,
    current_xp: 110,
    total_xp: 2500,
    friendsCount: 45,
    followersCount: 90,
    isFollowed: false,
    badges: ["Coffee Lover"],
  },
  {
    id: "sarah_wang",
    name: "Sarah Wang",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    level: 4,
    current_xp: 80,
    total_xp: 1400,
    friendsCount: 30,
    followersCount: 70,
    isFollowed: false,
    badges: ["Global Explorer"],
  },
  {
    id: "mohammad_ali",
    name: "Mohammad Ali",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    level: 18,
    current_xp: 600,
    total_xp: 23100,
    friendsCount: 5600,
    followersCount: 32800,
    isFollowed: false,
    badges: ["Gold Contributor", "Top Creator 2026"],
  },
  {
    id: "sintayehu",
    name: "Sintayehu Kebede",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100",
    level: 24,
    current_xp: 450,
    total_xp: 43200,
    friendsCount: 8900,
    followersCount: 77000,
    isFollowed: true,
    badges: ["Diamond Streamer", "Cultural Ambassador"],
  },
  {
    id: "netsanet",
    name: "Netsanet Shiferaw",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
    level: 19,
    current_xp: 340,
    total_xp: 26000,
    friendsCount: 2100,
    followersCount: 14000,
    isFollowed: false,
    badges: ["Top Creator 2026", "Silver Badge"],
  },
  {
    id: "alex_j",
    name: "Alex Johnson",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
    level: 17,
    current_xp: 200,
    total_xp: 20500,
    friendsCount: 3400,
    followersCount: 18000,
    isFollowed: false,
    badges: ["Coffee Enthusiast", "Silver Guide"],
  },
  {
    id: "guang_z",
    name: "Guang Zhang",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100",
    level: 12,
    current_xp: 500,
    total_xp: 11000,
    friendsCount: 600,
    followersCount: 1200,
    isFollowed: false,
    badges: ["Simien Climber"],
  },
];

// SEED INITIAL CHAT HISTORY BETWEEN MOCK USERS
const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: "conv-1", isGroup: false, created_at: "2026-06-01T12:00:00Z", updated_at: "2026-06-06T16:42:00Z" },
  { id: "conv-2", isGroup: true, name: "CBE & Telebirr Streamers Group", avatarUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=100", created_at: "2026-06-02T10:00:00Z", updated_at: "2026-06-06T15:30:00Z" },
];

const INITIAL_MEMBERS: ConversationMember[] = [
  { id: "mem-1", conversation_id: "conv-1", user_id: "helen_tesfaye", joined_at: "2026-06-01T12:00:00Z" },
  { id: "mem-2", conversation_id: "conv-1", user_id: "current_user", joined_at: "2026-06-01T12:05:00Z" },
  { id: "mem-3", conversation_id: "conv-2", user_id: "yared_abera", joined_at: "2026-06-02T10:00:00Z" },
  { id: "mem-4", conversation_id: "conv-2", user_id: "helen_tesfaye", joined_at: "2026-06-02T10:01:00Z" },
  { id: "mem-5", conversation_id: "conv-2", user_id: "current_user", joined_at: "2026-06-02T10:05:00Z" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "helen_tesfaye",
    message_type: "text",
    content: "Are you planning on streaming the Lalibela tour tomorrow?",
    is_deleted: false,
    created_at: "2026-06-06T16:40:00Z",
  },
  {
    id: "msg-2",
    conversation_id: "conv-1",
    sender_id: "current_user",
    message_type: "text",
    content: "Yes! Connecting from the primary rock churches at noon.",
    is_deleted: false,
    created_at: "2026-06-06T16:42:00Z",
  },
  {
    id: "msg-3",
    conversation_id: "conv-2",
    sender_id: "yared_abera",
    message_type: "text",
    content: "Hey! Let's check our weekly stream bonus task.",
    is_deleted: false,
    created_at: "2026-06-06T15:00:00Z",
  },
  {
    id: "msg-4",
    conversation_id: "conv-2",
    sender_id: "helen_tesfaye",
    message_type: "text",
    content: "I already claimed mine using Awash Bank!",
    is_deleted: false,
    created_at: "2026-06-06T15:30:00Z",
  },
];

// INITIAL FRIENDSHIPS (Already friends list)
const INITIAL_FRIENDSHIPS: Friendship[] = [
  { id: "friend-1", user1_id: "current_user", user2_id: "helen_tesfaye", created_at: "2026-06-03T10:00:00Z" },
  { id: "friend-2", user1_id: "current_user", user2_id: "guide_lalibela", created_at: "2026-06-03T11:00:00Z" },
];

// INITIAL XP TRANSACTION HISTORY TO PRE-POPULATE THE ACTIVITY CENTER
const INITIAL_XP_TRANSACTIONS = (userId: string): XPTransaction[] => [
  { id: "xp-1", user_id: userId, xp_amount: 100, source: "Streamed 1 hour", description: "Streamed travel vlog promoting Ethiopian landscape to international tourists.", created_at: "2026-06-06T12:00:00Z" },
  { id: "xp-2", user_id: userId, xp_amount: 20, source: "Daily Mission Completed", description: "Finished 'Join Cultural Stream' 2 minutes watch milestone.", created_at: "2026-06-06T13:40:00Z" },
  { id: "xp-3", user_id: userId, xp_amount: 10, source: "Shared stream", description: "Shared traditional coffee brewing ceremony link with external networks.", created_at: "2026-06-06T14:10:00Z" },
];

export const socialService = {
  // LOAD ALL USERS
  getUsers: (sessionEmail?: string): SocialUser[] => {
    const raw = localStorage.getItem(KEYS.USERS);
    let users = raw ? JSON.parse(raw) : [...INITIAL_SYSTEM_USERS];

    // Ensure current user is in user directory
    if (sessionEmail) {
      const currentUserId = socialService.getCurrentUserId(sessionEmail);
      const exists = users.some((u: any) => u.id === currentUserId);
      if (!exists) {
        // Create the customized Mesgebu level 32 or guest account requested
        const isMesgebu = sessionEmail.toLowerCase().includes("mesgebu");
        const defaultUser: SocialUser = {
          id: currentUserId,
          name: isMesgebu ? "Mesgebu" : sessionEmail.split("@")[0],
          email: sessionEmail,
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
          level: isMesgebu ? 32 : 3,
          current_xp: isMesgebu ? 4100 : 140,
          total_xp: isMesgebu ? 180000 : 140,
          friendsCount: isMesgebu ? 12431 : 2,
          followersCount: isMesgebu ? 89000 : 15,
          isFollowed: false,
          badges: isMesgebu ? ["Diamond Streamer", "Top Creator 2026", "100 Day Streak Badge"] : ["Rookie Creator"],
        };
        users.push(defaultUser);
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      }
    }
    return users;
  },

  // GET SINGLE USER BY ID WITH DYNAMIC MAPPED COUNTS
  getUserById: (id: string, sessionEmail?: string): SocialUser | null => {
    let uId = id === "current_user" && sessionEmail ? socialService.getCurrentUserId(sessionEmail) : id;
    const users = socialService.getUsers(sessionEmail);
    const found = users.find((u) => u.id === uId) || null;
    if (found && uId !== id && id === "current_user") {
      return { ...found, id: "current_user" }; // map back
    }
    return found;
  },

  // PERSIST USERS ARRAY
  saveUsers: (users: SocialUser[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // UTILITY FOR LOGGED USER ID mapping
  getCurrentUserId: (email: string): string => {
    return "mock-uid-" + email.replace(/[@.]/g, "-");
  },

  // GET RELEVANT FRIENDS FOR USER ID
  getFriendsList: (userId: string, sessionEmail?: string): SocialUser[] => {
    let resolvedUserId = userId === "current_user" && sessionEmail ? socialService.getCurrentUserId(sessionEmail) : userId;
    const friendships = socialService.getFriendships();
    const userIds = friendships
      .filter((f) => f.user1_id === resolvedUserId || f.user2_id === resolvedUserId)
      .map((f) => (f.user1_id === resolvedUserId ? f.user2_id : f.user1_id));

    const allUsers = socialService.getUsers(sessionEmail);
    return allUsers.filter((u) => userIds.includes(u.id));
  },

  // LOAD REVENUE/FRIENDSHIP ENTRIES
  getFriendships: (): Friendship[] => {
    const raw = localStorage.getItem(KEYS.FRIENDSHIPS);
    return raw ? JSON.parse(raw) : [...INITIAL_FRIENDSHIPS];
  },

  saveFriendships: (fs: Friendship[]) => {
    localStorage.setItem(KEYS.FRIENDSHIPS, JSON.stringify(FS_ORDER(fs)));
  },

  // FETCH ALL FRIEND REQUESTS
  getFriendRequests: (): FriendRequest[] => {
    const raw = localStorage.getItem(KEYS.FRIEND_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  },

  saveFriendRequests: (reqs: FriendRequest[]) => {
    localStorage.setItem(KEYS.FRIEND_REQUESTS, JSON.stringify(reqs));
  },

  // DISPATCH A PENDING FRIEND REQUEST
  sendFriendRequest: (senderEmail: string, receiverId: string): { success: boolean; message: string } => {
    const senderId = socialService.getCurrentUserId(senderEmail);
    if (senderId === receiverId) return { success: false, message: "You cannot add yourself as a friend!" };

    const requests = socialService.getFriendRequests();

    // Check if duplicate requests / friendship exist
    const friendships = socialService.getFriendships();
    const cleanU1 = senderId < receiverId ? senderId : receiverId;
    const cleanU2 = senderId < receiverId ? receiverId : senderId;
    const areFriends = friendships.some((f) => f.user1_id === cleanU1 && f.user2_id === cleanU2);
    if (areFriends) return { success: false, message: "You are already friends!" };

    const existingPending = requests.some(
      (r) =>
        r.status === "pending" &&
        ((r.sender_id === senderId && r.receiver_id === receiverId) ||
          (r.sender_id === receiverId && r.receiver_id === senderId))
    );
    if (existingPending) return { success: false, message: "A friend request is already pending between you." };

    const newReq: FriendRequest = {
      id: "req-" + Date.now(),
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    requests.push(newReq);
    socialService.saveFriendRequests(requests);
    return { success: true, message: "Friend request sent successfully!" };
  },

  // ACCEPT A RECEIVED FRIEND REQUEST
  acceptFriendRequest: (
    requestId: string,
    sessionEmail: string,
    onXpGained: (xpAmount: number, source: string) => void
  ): { success: boolean; message: string } => {
    const requests = socialService.getFriendRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return { success: false, message: "Friend request not found!" };

    const req = requests[reqIndex];
    requests[reqIndex] = {
      ...req,
      status: "accepted",
      responded_at: new Date().toISOString(),
    };
    socialService.saveFriendRequests(requests);

    // Creates friendship record with alphabetically smaller UUID in user1_id to avoid duplicates
    const finalU1 = req.sender_id < req.receiver_id ? req.sender_id : req.receiver_id;
    const finalU2 = req.sender_id < req.receiver_id ? req.receiver_id : req.sender_id;

    const friendships = socialService.getFriendships();
    const alreadyExists = friendships.some((f) => f.user1_id === finalU1 && f.user2_id === finalU2);

    if (!alreadyExists) {
      friendships.push({
        id: "friendship-" + Date.now(),
        user1_id: finalU1,
        user2_id: finalU2,
        created_at: new Date().toISOString(),
      });
      socialService.saveFriendships(friendships);

      // Mutate friends counts on corresponding SocialUsers
      const allUsers = socialService.getUsers(sessionEmail);
      let updatedUsers = allUsers.map((u) => {
        if (u.id === finalU1 || u.id === finalU2) {
          return { ...u, friendsCount: u.friendsCount + 1 };
        }
        return u;
      });
      socialService.saveUsers(updatedUsers);

      // Award +10 XP to both users as requested: "Award: +10 XP both users"
      // Record transaction for current user dynamically
      socialService.awardXP(sessionEmail, XP_PAYOUTS.FRIEND_ACCEPTED, "Friend accepted", "Successfully accepted request and linked social graphs.", onXpGained);
    }

    return { success: true, message: "Friend request accepted! +10 XP Awarded." };
  },

  // REJECT A RECEIVED REQUEST
  rejectFriendRequest: (requestId: string): { success: boolean; message: string } => {
    const requests = socialService.getFriendRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return { success: false, message: "Friend request not found!" };

    requests[reqIndex] = {
      ...requests[reqIndex],
      status: "rejected",
      responded_at: new Date().toISOString(),
    };
    socialService.saveFriendRequests(requests);
    return { success: true, message: "Friend request declined." };
  },

  // REMOVE FRIEND
  removeFriendship: (friendId: string, sessionEmail: string): { success: boolean } => {
    const currentUserId = socialService.getCurrentUserId(sessionEmail);
    const friendships = socialService.getFriendships();
    const cleanU1 = currentUserId < friendId ? currentUserId : friendId;
    const cleanU2 = currentUserId < friendId ? friendId : currentUserId;

    const filtered = friendships.filter((f) => !(f.user1_id === cleanU1 && f.user2_id === cleanU2));
    socialService.saveFriendships(filtered);

    // Decrement friends counts
    const allUsers = socialService.getUsers(sessionEmail);
    let updatedUsers = allUsers.map((u) => {
      if (u.id === currentUserId || u.id === friendId) {
        return { ...u, friendsCount: Math.max(0, u.friendsCount - 1) };
      }
      return u;
    });
    socialService.saveUsers(updatedUsers);

    return { success: true };
  },

  // TOGGLE FOLLOW (In-Memory updates followersCount)
  toggleFollowUser: (targetId: string, sessionEmail: string): { followed: boolean; count: number } => {
    const allUsers = socialService.getUsers(sessionEmail);
    let followed = false;
    let count = 0;

    let updatedUsers = allUsers.map((u) => {
      if (u.id === targetId) {
        const nextStatus = !u.isFollowed;
        const nextCount = u.followersCount + (nextStatus ? 1 : -1);
        followed = nextStatus;
        count = nextCount;
        return { ...u, isFollowed: nextStatus, followersCount: Math.max(0, nextCount) };
      }
      return u;
    });

    socialService.saveUsers(updatedUsers);
    return { followed, count };
  },

  // FETCH ALL CHATS/CONVERSATIONS FOR USER
  getConversations: (): Conversation[] => {
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    return raw ? JSON.parse(raw) : [...INITIAL_CONVERSATIONS];
  },

  getConversationMembers: (): ConversationMember[] => {
    const raw = localStorage.getItem(KEYS.MEMBERS);
    return raw ? JSON.parse(raw) : [...INITIAL_MEMBERS];
  },

  getMessages: (): Message[] => {
    const raw = localStorage.getItem(KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : [...INITIAL_MESSAGES];
  },

  saveConversationsData: (conversations: Conversation[], members: ConversationMember[], messages: Message[]) => {
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  },

  // SEND PRIVATE OR GROUP MESSAGE
  sendMessage: (
    senderEmail: string,
    conversationId: string,
    content: string,
    messageType: "text" | "image" | "voice" | "file" = "text",
    mediaUrl?: string,
    onXpGained?: (xpAmount: number, source: string) => void
  ): Message => {
    const senderId = socialService.getCurrentUserId(senderEmail);
    const messages = socialService.getMessages();

    const newMsg: Message = {
      id: "msg-" + Date.now(),
      conversation_id: conversationId,
      sender_id: senderId,
      message_type: messageType,
      content,
      media_url: mediaUrl,
      is_deleted: false,
      created_at: new Date().toISOString(),
      reactions: [],
    };

    messages.push(newMsg);

    // Save conversations updated timestamp
    const conversations = socialService.getConversations();
    const updatedConvs = conversations.map((c) => {
      if (c.id === conversationId) {
        return { ...c, updated_at: new Date().toISOString() };
      }
      return c;
    });

    socialService.saveConversationsData(updatedConvs, socialService.getConversationMembers(), messages);

    // Award +1 XP on sending message
    if (onXpGained) {
      socialService.awardXP(senderEmail, XP_PAYOUTS.SEND_MESSAGE, "Send message", `Sent private message inside channel ${conversationId}.`, onXpGained);
    }

    return newMsg;
  },

  // REACT UNREACT EMOJI TO A MESSAGE
  toggleMessageReaction: (messageId: string, userId: string, emoji: string) => {
    const messages = socialService.getMessages();
    const msgIndex = messages.findIndex((m) => m.id === messageId);
    if (msgIndex !== -1) {
      const msg = messages[msgIndex];
      let reactions = msg.reactions || [];
      const hasReacted = reactions.some((r) => r.user_id === userId && r.emoji === emoji);

      if (hasReacted) {
        reactions = reactions.filter((r) => !(r.user_id === userId && r.emoji === emoji));
      } else {
        reactions.push({ user_id: userId, emoji });
      }

      messages[msgIndex] = { ...msg, reactions };
      socialService.saveConversationsData(socialService.getConversations(), socialService.getConversationMembers(), messages);
    }
  },

  // LOGICAL MESSAGE DELETE WITH IS_DELETED = TRUE
  deleteMessage: (messageId: string): boolean => {
    const messages = socialService.getMessages();
    const index = messages.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      messages[index] = {
        ...messages[index],
        is_deleted: true,
        content: "This message was deleted.",
      };
      socialService.saveConversationsData(socialService.getConversations(), socialService.getConversationMembers(), messages);
      return true;
    }
    return false;
  },

  // FETCH ALL MESSAGE READS
  getMessageReads: (): MessageRead[] => {
    const raw = localStorage.getItem(KEYS.MESSAGE_READS);
    return raw ? JSON.parse(raw) : [];
  },

  // SAVE ALL MESSAGE READS
  saveMessageReads: (reads: MessageRead[]) => {
    localStorage.setItem(KEYS.MESSAGE_READS, JSON.stringify(reads));
  },

  // MARK ALL MESSAGES AS READ BY A USER IN A CONVERSATION
  markMessagesAsRead: (conversationId: string, userId: string) => {
    const reads = socialService.getMessageReads();
    const messages = socialService.getMessages().filter((m) => m.conversation_id === conversationId);
    let changed = false;

    messages.forEach((m) => {
      if (m.sender_id !== userId) {
        const alreadyRead = reads.some((r) => r.message_id === m.id && r.user_id === userId);
        if (!alreadyRead) {
          reads.push({
            id: `read-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            message_id: m.id,
            user_id: userId,
            read_at: new Date().toISOString(),
          });
          changed = true;
        }
      }
    });

    if (changed) {
      socialService.saveMessageReads(reads);
    }
  },

  // MARK A SINGLE MESSAGE AS READ BY A USER
  markSingleMessageAsRead: (messageId: string, userId: string) => {
    const reads = socialService.getMessageReads();
    const alreadyRead = reads.some((r) => r.message_id === messageId && r.user_id === userId);
    if (!alreadyRead) {
      reads.push({
        id: `read-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        message_id: messageId,
        user_id: userId,
        read_at: new Date().toISOString(),
      });
      socialService.saveMessageReads(reads);
    }
  },

  // START A NEW 1-to-1 CONVERSATION OR CREATE GROUP
  startOrCreateConversation: (
    sessionEmail: string,
    targetUserId: string,
    isGroup: boolean,
    groupName?: string,
    groupAvatar?: string
  ): { conversation: Conversation; isNew: boolean } => {
    const currentUserId = socialService.getCurrentUserId(sessionEmail);
    const conversations = socialService.getConversations();
    const members = socialService.getConversationMembers();

    // If it's a 1-to-1 conversation, check if there's already an existing 1-to-1 conversation with this recipient
    if (!isGroup) {
      const existingConv = conversations.find((c) => {
        if (c.isGroup) return false;
        const convMembers = members.filter((m) => m.conversation_id === c.id);
        const hasMe = convMembers.some((m) => m.user_id === currentUserId);
        const hasTarget = convMembers.some((m) => m.user_id === targetUserId);
        return hasMe && hasTarget && convMembers.length === 2;
      });

      if (existingConv) {
        return { conversation: existingConv, isNew: false };
      }
    }

    // Otherwise create a new conversation
    const newConvId = "conv-" + Date.now();
    const newConv: Conversation = {
      id: newConvId,
      isGroup,
      name: isGroup ? groupName || "Unnamed Group Stream Room" : undefined,
      avatarUrl: isGroup
        ? groupAvatar || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=100"
        : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const myMember: ConversationMember = {
      id: "mem-" + Date.now() + "-1",
      conversation_id: newConvId,
      user_id: currentUserId,
      joined_at: new Date().toISOString(),
    };

    const targetMember: ConversationMember = {
      id: "mem-" + Date.now() + "-2",
      conversation_id: newConvId,
      user_id: targetUserId,
      joined_at: new Date().toISOString(),
    };

    conversations.push(newConv);
    members.push(myMember, targetMember);

    socialService.saveConversationsData(conversations, members, socialService.getMessages());
    return { conversation: newConv, isNew: true };
  },

  // XP REVENUE REGISTER IN HISTORY WITH FORMULA EVALUATION
  awardXP: (
    email: string,
    xpAmount: number,
    source: string,
    description: string,
    onXpGained: (xpAmount: number, source: string) => void
  ) => {
    const currentUserId = socialService.getCurrentUserId(email);
    const users = socialService.getUsers(email);
    const userIndex = users.findIndex((u) => u.id === currentUserId);

    if (userIndex !== -1) {
      const u = users[userIndex];
      let newXp = u.current_xp + xpAmount;
      let nextLvlXp = getRequiredXpForLevel(u.level);
      let currLvl = u.level;
      let isLevelUp = false;

      while (newXp >= nextLvlXp) {
        newXp -= nextLvlXp;
        currLvl += 1;
        nextLvlXp = getRequiredXpForLevel(currLvl);
        isLevelUp = true;
      }

      users[userIndex] = {
        ...u,
        level: currLvl,
        current_xp: newXp,
        total_xp: u.total_xp + xpAmount,
      };

      socialService.saveUsers(users);

      // Record transaction
      const txs = socialService.getXPTransactions(email);
      txs.push({
        id: "xp-tx-" + Date.now() + Math.random().toString().substr(2, 4),
        user_id: currentUserId,
        xp_amount: xpAmount,
        source,
        description,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(KEYS.TRACK_XP, JSON.stringify(txs));

      // Propagate level up in callback
      if (isLevelUp) {
        onXpGained(xpAmount, `LEVELUP:Level ${currLvl}`);
      } else {
        onXpGained(xpAmount, source);
      }
    }
  },

  // GET RECENT XP TRANSACTIONS
  getXPTransactions: (email: string): XPTransaction[] => {
    const currentUserId = socialService.getCurrentUserId(email);
    const raw = localStorage.getItem(KEYS.TRACK_XP);
    const txs: XPTransaction[] = raw ? JSON.parse(raw) : [];

    // Filter for current user. If empty, seed initial 3 items matching user instructions
    const userTxs = txs.filter((t) => t.user_id === currentUserId);
    if (userTxs.length === 0) {
      const seeds = INITIAL_XP_TRANSACTIONS(currentUserId);
      const allTx = [...txs, ...seeds];
      localStorage.setItem(KEYS.TRACK_XP, JSON.stringify(allTx));
      return seeds;
    }
    return userTxs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // GET AND RESOLVE ACHIEVEMENTS PROGRESS FOR USER
  getAchievementsProgress: (email: string): UserAchievementProgress[] => {
    const currentUserId = socialService.getCurrentUserId(email);
    const raw = localStorage.getItem(KEYS.ACHIEVEMENTS);
    let progressList: UserAchievementProgress[] = raw ? JSON.parse(raw) : [];

    const userProgress = progressList.filter((p) => p.user_id === currentUserId);
    if (userProgress.length === 0) {
      // Seed default achievements progress matching user tables
      const seeds: UserAchievementProgress[] = GLOBAL_ACHIEVEMENTS.map((a) => {
        // Initialize with default nice values rather than 0
        let pVal = 0;
        if (a.id === "ach-1") pVal = 48; // e.g. 48/100 hours streamed
        if (a.id === "ach-2") pVal = 890; // e.g. 890/1000 followers
        if (a.id === "ach-3") pVal = 142; // e.g. 142/500 messages
        if (a.id === "ach-4") pVal = 12; // e.g. 12/50 friends

        return {
          id: `ach-prog-${a.id}-${Date.now()}`,
          user_id: currentUserId,
          achievement_id: a.id,
          progress: pVal,
          completed: false,
        };
      });

      const updatedList = [...progressList, ...seeds];
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(updatedList));
      return seeds;
    }
    return userProgress;
  },

  // DYNAMICALLY INCREMENT SPECIFIC ACHIEVEMENT PROGRESS (e.g. on DM send, friend addition, stream stream, etc)
  incrementAchievementProgress: (
    email: string,
    achievementId: string,
    incrementVal: number,
    onXpGained: (xpAmount: number, source: string) => void
  ) => {
    const currentUserId = socialService.getCurrentUserId(email);
    const raw = localStorage.getItem(KEYS.ACHIEVEMENTS);
    let progressList: UserAchievementProgress[] = raw ? JSON.parse(raw) : [];

    const index = progressList.findIndex((p) => p.user_id === currentUserId && p.achievement_id === achievementId);
    if (index !== -1) {
      let item = progressList[index];
      if (item.completed) return;

      const achievement = GLOBAL_ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!achievement) return;

      const nextProgress = Math.min(item.progress + incrementVal, achievement.target);
      const isCompletedNow = nextProgress === achievement.target;

      progressList[index] = {
        ...item,
        progress: nextProgress,
        completed: isCompletedNow,
        completed_at: isCompletedNow ? new Date().toISOString() : undefined,
      };

      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(progressList));

      if (isCompletedNow) {
        // Automatically reward XP trigger as specified in achievements table
        socialService.awardXP(
          email,
          achievement.xp_reward,
          "Achievement Unlocked",
          `Completed and unlocked achievement milestone: ${achievement.name}`,
          onXpGained
        );
      }
    }
  },

  // DAILY QUESTS & TASKS SYSTEM SPECIAL SECTION
  getDailyTasks: (email: string): any[] => {
    const key = `spark_tasks_state_v1_${email.replace(/[@.]/g, "-")}`;
    const raw = localStorage.getItem(key);
    const defaultTasks = [
      { id: "stream_10", title: "Stream for 10 minutes", xp: 50, target: 10, progress: 2, claimed: false },
      { id: "like_5", title: "Like 5 posts", xp: 20, target: 5, progress: 1, claimed: false },
      { id: "comment_3", title: "Comment 3 times", xp: 30, target: 3, progress: 1, claimed: false },
      { id: "share_1", title: "Share a stream", xp: 15, target: 1, progress: 0, claimed: false }
    ];
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultTasks));
      return defaultTasks;
    }
    return JSON.parse(raw);
  },

  updateDailyTaskProgress: (email: string, taskId: string, value: number) => {
    const key = `spark_tasks_state_v1_${email.replace(/[@.]/g, "-")}`;
    const tasks = socialService.getDailyTasks(email);
    const updated = tasks.map(t => {
      if (t.id === taskId && !t.claimed) {
        return { ...t, progress: Math.min(t.target, t.progress + value) };
      }
      return t;
    });
    localStorage.setItem(key, JSON.stringify(updated));
  },

  claimDailyTaskReward: (email: string, taskId: string, onLevelUp: (nextLvl: number) => void, onXpGainedCallback: (amount: number) => void): boolean => {
    const key = `spark_tasks_state_v1_${email.replace(/[@.]/g, "-")}`;
    const tasks = socialService.getDailyTasks(email);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;
    const task = tasks[taskIndex];
    if (task.progress < task.target || task.claimed) return false;

    // Mark task as claimed
    tasks[taskIndex].claimed = true;
    localStorage.setItem(key, JSON.stringify(tasks));

    // Award XP
    socialService.awardXP(email, task.xp, "Daily Task Reward Claimed", `Completed daily objective: ${task.title}. Got ${task.xp} XP.`, (xpAmt, src) => {
      onXpGainedCallback(task.xp);
      if (src.startsWith("LEVELUP:")) {
        const nextTargetLevel = parseInt(src.split("LEVELUP:Level ")[1]);
        onLevelUp(nextTargetLevel);
      }
    });
    return true;
  },

  // SECURITY & BIOMETRICS ENGINE
  getVerificationStatus: (email: string) => {
    const key = `spark_security_status_v1_${email.replace(/[@.]/g, "-")}`;
    const raw = localStorage.getItem(key);
    const defaultStatus = {
      phoneVerified: true,
      deviceVerified: false,
      faceVerified: false,
      securityScore: 33
    };
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultStatus));
      return defaultStatus;
    }
    return JSON.parse(raw);
  },

  updateVerificationStatus: (email: string, fields: Partial<{ phoneVerified: boolean, deviceVerified: boolean, faceVerified: boolean }>) => {
    const key = `spark_security_status_v1_${email.replace(/[@.]/g, "-")}`;
    const current = socialService.getVerificationStatus(email);
    const next = { ...current, ...fields };
    
    let score = 0;
    if (next.phoneVerified) score += 33;
    if (next.deviceVerified) score += 33;
    if (next.faceVerified) score += 34;
    next.securityScore = score;
    
    localStorage.setItem(key, JSON.stringify(next));
    return next;
  },

  getVerifiedDevices: (email: string): any[] => {
    const key = `spark_user_devices_v1_${email.replace(/[@.]/g, "-")}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const seed = [
        { id: "dev-seed-1", device_name: "MacIntel CPU Core i9", browser: "Mozilla/5.0/Chrome", verified: true, created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString() }
      ];
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  },

  registerUserDevice: (email: string, deviceName: string, browser: string): any => {
    const key = `spark_user_devices_v1_${email.replace(/[@.]/g, "-")}`;
    const devices = socialService.getVerifiedDevices(email);
    const newDevice = {
      id: "dev-" + Date.now(),
      device_name: deviceName || "Unknown Platform",
      browser: browser || "Unknown Agent",
      verified: true,
      created_at: new Date().toISOString()
    };
    devices.push(newDevice);
    localStorage.setItem(key, JSON.stringify(devices));
    return newDevice;
  }
};

// HELPER FOR ORDERING RELATION ID TO AVOID CORRUPTED ENTRIES
function FS_ORDER(fs: Friendship[]): Friendship[] {
  return fs.map((f) => {
    if (f.user1_id > f.user2_id) {
      return { ...f, user1_id: f.user2_id, user2_id: f.user1_id };
    }
    return f;
  });
}
