import { UserStats } from "./types";

export interface SocialUser {
  id: string; // e.g. 'guide_lalibela' or 'mock-uid-mesgebudebeli0-gmail-com'
  name: string;
  email?: string;
  avatarUrl: string;
  level: number;
  current_xp: number;
  total_xp: number;
  friendsCount: number;
  followersCount: number;
  isFollowed: boolean;
  badges: string[];
  offline?: boolean;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  created_at: string;
  responded_at?: string;
}

export interface Friendship {
  id: string;
  user1_id: string; // User with alphabetically smaller ID
  user2_id: string; // User with alphabetically larger ID
  created_at: string;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string; // for group chats
  avatarUrl?: string; // for group chats
  created_at: string;
  updated_at: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: "text" | "image" | "voice" | "file";
  content: string;
  media_url?: string;
  is_deleted: boolean;
  created_at: string;
  reactions?: Array<{ user_id: string; emoji: string }>;
}

export interface MessageRead {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  xp_amount: number;
  source: string; // e.g. 'Complete daily task', 'Send message', 'Login'
  description: string;
  created_at: string;
}

export interface AchievementPost {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  xp_reward: number;
  target: number;
}

export interface UserAchievementProgress {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
}

// XP activities constants and XP trigger payouts
export const XP_PAYOUTS = {
  DAILY_LOGIN: 5,
  COMPLETE_DAILY_TASK: 6000,
  STREAM_10_MIN: 1500,
  STREAM_1_HOUR: 7000,
  RECEIVE_LIKE: 500,
  RECEIVE_GIFT: 500,
  COMMENT_ON_STREAM: 100,
  SHARE_STREAM: 100,
  SEND_MESSAGE: 100,
  FRIEND_ACCEPTED: 100,
};

// Exponential leveling required XP formula: 100 * level ^ 1.5
export function getRequiredXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}
