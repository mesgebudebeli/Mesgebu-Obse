// Spark Application Type Definitions

export interface UserSession {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

// Face ID compliance structure
export interface FaceIdAuthStatus {
  lastVerified: string; // ISO String
  isRequiredNow: boolean;
  isRegistered: boolean;
}

// Help & Support Messaging structure
export interface SupportMessage {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}

// Payout methods and configurations
export type PaymentMethodType = "CBE" | "Telebirr" | "Awash" | "Abyssinia" | "PayPal" | "Mastercard";

export interface PayoutMethod {
  id: string;
  type: PaymentMethodType;
  accountName: string;
  accountNumber: string;
  region: string; // "Ethiopia" or "International"
  isPrimary: boolean;
}

// Honor & Activity Center definitions
export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  gems: number;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  progress: number; // e.g. 1 out of 3
  target: number;
  completed: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  costCoins: number;
  type: "badge" | "item" | "gift";
  imageUrl: string;
}

// Privacy Settings
export interface PrivacySettings {
  visitorListPublic: boolean;
  messagingStatusPublic: boolean;
  profileInformationPublic: boolean;
}

export interface Visitor {
  id: string;
  name: string;
  appId: string;
  avatarUrl: string;
  visitTime: string;
}

// Instagram/TikTok style Live Post & Stream Types
export interface LiveStream {
  id: string;
  streamerName: string;
  streamerId: string;
  streamerAvatar: string;
  title: string;
  tags: string[];
  viewerCount: number;
  isLive: boolean;
  streamUrl?: string;
  bgGradient: string;
  comments: StreamComment[];
}

export interface StreamComment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  likes: number;
  isLikedByUser: boolean;
  shares: number;
  comments: PostComment[];
  createdAt: string;
}

export interface PostComment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

// Backpack items
export interface BackpackItem {
  id: string;
  name: string;
  description: string;
  qty: number;
  type: "gift" | "badge" | "powerup";
  iconName: string;
  badgeLevel?: number;
}

// Leaderboard entries
export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  appId: string;
  avatarUrl: string;
  score: number; // total coins/contributions
  level: number;
}
