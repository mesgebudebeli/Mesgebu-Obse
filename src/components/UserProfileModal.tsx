import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Users,
  Award,
  MessageSquare,
  UserPlus,
  UserCheck,
  Heart,
  Zap,
  Star,
  Check,
  Bookmark,
  Edit,
  Coins,
  Shield,
  Trophy,
  Activity,
  CheckSquare,
  CheckCircle2,
  Lock,
  Eye,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { socialService, GLOBAL_ACHIEVEMENTS } from "../socialStore";
import { SocialUser } from "../socialState";

interface UserProfileModalProps {
  userId: string;
  sessionEmail: string;
  onClose: () => void;
  onOpenMessage: (userId: string) => void;
  onXpGained: (xpAmount: number, source: string) => void;
  lang: string;
}

export default function UserProfileModal({
  userId,
  sessionEmail,
  onClose,
  onOpenMessage,
  onXpGained,
  lang,
}: UserProfileModalProps) {
  const currentUserId = socialService.getCurrentUserId(sessionEmail);
  const [user, setUser] = useState<SocialUser | null>(null);
  const [friendStatus, setFriendStatus] = useState<"none" | "pending_sent" | "pending_received" | "friends">("none");
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Profile Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editLevel, setEditLevel] = useState(12);

  // Daily Tasks state for interactive check-offs
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify Face ID credentials", done: true },
    { id: 2, text: "Watch regional travel lobby stream", done: false },
    { id: 3, text: "Claim daily streaming payout XP", done: false },
  ]);

  // Load and refresh user details & friend status
  const loadProfile = () => {
    let targetId = userId === "current_user" ? currentUserId : userId;
    const profile = socialService.getUserById(targetId, sessionEmail);
    if (!profile) return;

    setUser(profile);

    // Calc friend status matching friendship rules
    if (targetId === currentUserId) {
      setFriendStatus("none");
      return;
    }

    const friendships = socialService.getFriendships();
    const cleanU1 = currentUserId < targetId ? currentUserId : targetId;
    const cleanU2 = currentUserId < targetId ? targetId : currentUserId;
    const isFriend = friendships.some((f) => f.user1_id === cleanU1 && f.user2_id === cleanU2);

    if (isFriend) {
      setFriendStatus("friends");
    } else {
      const requests = socialService.getFriendRequests();
      const sent = requests.find((r) => r.sender_id === currentUserId && r.receiver_id === targetId && r.status === "pending");
      const received = requests.find((r) => r.sender_id === targetId && r.receiver_id === currentUserId && r.status === "pending");

      if (sent) {
        setFriendStatus("pending_sent");
      } else if (received) {
        setFriendStatus("pending_received");
        setPendingRequestId(received.id);
      } else {
        setFriendStatus("none");
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId, sessionEmail]);

  if (!user) return null;

  const isMe = user.id === currentUserId || userId === "current_user" || user.email === sessionEmail;

  // Actions
  const handleFollow = () => {
    const { followed, count } = socialService.toggleFollowUser(user.id, sessionEmail);
    setUser((prev) => prev ? { ...prev, isFollowed: followed, followersCount: count } : null);
    showToast(followed ? `Following @${user.name} now!` : `Unfollowed @${user.name}`);
  };

  const handleAddFriend = () => {
    const res = socialService.sendFriendRequest(sessionEmail, user.id);
    if (res.success) {
      setFriendStatus("pending_sent");
      showToast("Friend request sent!");
    } else {
      showToast(res.message);
    }
  };

  const handleAcceptFriend = () => {
    if (!pendingRequestId) return;
    const res = socialService.acceptFriendRequest(pendingRequestId, sessionEmail, onXpGained);
    if (res.success) {
      setFriendStatus("friends");
      loadProfile();
      showToast("Friend request accepted! +10 XP earned");
      socialService.incrementAchievementProgress(sessionEmail, "ach-4", 1, onXpGained);
    } else {
      showToast(res.message);
    }
  };

  const handleRejectFriend = () => {
    if (!pendingRequestId) return;
    const res = socialService.rejectFriendRequest(pendingRequestId);
    if (res.success) {
      setFriendStatus("none");
      showToast("Friend request declined.");
    }
  };

  const handleRemoveFriend = () => {
    if (confirm(`Are you sure you want to remove ${user.name} from your friend list?`)) {
      socialService.removeFriendship(user.id, sessionEmail);
      setFriendStatus("none");
      loadProfile();
      showToast("Friend removed.");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    let targetId = userId === "current_user" ? currentUserId : userId;
    const allUsers = socialService.getUsers(sessionEmail);
    const updated = allUsers.map((u) => {
      if (u.id === targetId || u.email === sessionEmail) {
        return {
          ...u,
          name: editName.trim(),
          avatarUrl: editAvatarUrl.trim() || u.avatarUrl,
          level: Number(editLevel) || u.level
        };
      }
      return u;
    });

    socialService.saveUsers(updated);
    setIsEditing(false);
    loadProfile();
    showToast("Profile updated successfully!");
  };

  const handleStartEditing = () => {
    setEditName(user.name);
    setEditAvatarUrl(user.avatarUrl);
    setEditLevel(user.level);
    setIsEditing(true);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.done;
        if (nextState) {
          onXpGained(15, "Completed daily quick task");
          showToast("Task marked done! +15 XP payout");
        }
        return { ...t, done: nextState };
      }
      return t;
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => c === msg ? null : c);
    }, 2500);
  };

  // Level star helper
  const renderStars = () => {
    const count = Math.min(5, Math.ceil(user.level / 8)) || 1;
    return (
      <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: count }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-current" />
        ))}
      </div>
    );
  };

  // Stats Calculations
  const friendsCount = user.friendsCount || 109;
  const followersCount = user.followersCount || 387;
  const followingCount = isMe ? 136 : 84;
  const visitorsCount = isMe ? 12 : 2;

  // Wallet Section Numbers
  const walletCoins = isMe ? 425 : 0;
  const walletPoints = user.current_xp || 140;
  const walletDiamonds = isMe ? 12 : 0;

  return (
    <div id="user-profile-modal-overlay" className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-zinc-950 border border-zinc-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl overflow-hidden text-left my-8"
      >
        {/* Decorative ambient spots */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="absolute top-4 left-1/2 bg-zinc-900 border border-blue-500/30 text-white font-mono text-[10px] font-bold px-4 py-2 rounded-xl shadow-xl flex items-center gap-1.5 z-50 whitespace-nowrap"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-current" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-900 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg font-mono font-bold uppercase tracking-wider">
              {isMe ? "Owner Profile" : "Explorer Profile"}
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase">Online</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer text-xs flex items-center gap-1"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Profile edit sub-form or normal block */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-850 mb-5 relative z-10 transition-all">
            <h4 className="text-xs font-bold text-blue-400 font-mono tracking-tight flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Account Metadata</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Display handle / Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-semibold"
                  placeholder="Insert username"
                  required
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Avatar image URL</label>
                <input
                  type="text"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Simulation Level</label>
                <input
                  type="number"
                  value={editLevel}
                  onChange={(e) => setEditLevel(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-2.5 rounded-xl outline-none focus:border-blue-500 font-semibold"
                  min="1"
                  max="50"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 text-xs rounded-xl border border-zinc-850 font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl font-bold hover:shadow-lg transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Header Redesign Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-3xl bg-zinc-900/40 border border-zinc-900 relative">
              <div className="relative shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border border-zinc-800 shadow-md shadow-black"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-zinc-950 w-4 h-4 rounded-full" title="Online now" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 gap-y-0.5 justify-center sm:justify-start">
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <h3 className="text-md sm:text-lg font-black text-white tracking-tight">{user.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/10 shrink-0" title="Verifying Guide Badge" />
                  </div>
                  <div className="flex gap-1.5 justify-center sm:justify-start mt-0.5 sm:mt-0">
                    <span className="text-[9px] bg-indigo-950/80 border border-indigo-900/60 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded-md font-mono shrink-0">
                      Lv. {user.level}
                    </span>
                    <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded-md font-mono flex items-center gap-0.5 shrink-0">
                      ⭐ Honor
                    </span>
                  </div>
                </div>
                <p className="text-xs font-mono text-zinc-500 mt-1">@{user.id}</p>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start text-[11px] text-zinc-400 font-medium">
                  <span className="text-zinc-500">Status:</span>
                  <span className="font-semibold text-emerald-400">Online Explorer</span>
                  <span className="text-zinc-800">•</span>
                  <span>{followersCount} Followers</span>
                </div>
              </div>

              {/* Edit Profile button */}
              {isMe && (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="mt-3 sm:mt-0 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-750 text-[10.5px] text-zinc-300 font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-400" />
                  <span>[Edit Profile]</span>
                </button>
              )}
            </div>

            {/* Statistics Cards Grid */}
            <div>
              <h4 className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2.5 font-mono">Performance Stats Index</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-3 text-center">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Friends</span>
                  <span className="text-sm font-black font-mono text-zinc-100 block mt-1">{friendsCount}</span>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-3 text-center">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Following</span>
                  <span className="text-sm font-black font-mono text-zinc-100 block mt-1">{followingCount}</span>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-3 text-center">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Followers</span>
                  <span className="text-sm font-black font-mono text-zinc-100 block mt-1">{followersCount}</span>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-3 text-center">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Visitors</span>
                  <span className="text-sm font-black font-mono text-zinc-100 block mt-1">{visitorsCount}</span>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="border border-zinc-900 bg-zinc-900/20 rounded-2xl p-4">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3 font-mono flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Secure Wallet Section</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono">Coins</span>
                  <span className="text-xs font-black text-amber-400 font-mono">{walletCoins}</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono">Points</span>
                  <span className="text-xs font-black text-blue-400 font-mono">{walletPoints}</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono">Diamonds</span>
                  <span className="text-xs font-black text-pink-400 font-mono">{walletDiamonds}</span>
                </div>
              </div>
            </div>

            {/* Honor & Activity Center */}
            <div className="border border-zinc-900 bg-zinc-900/15 rounded-2xl p-4 space-y-4">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5 pb-2 border-b border-zinc-900">
                <Trophy className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Honor & Activity Center</span>
              </h4>

              {/* Progress and Levels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Level Progression</span>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-zinc-400 font-bold">XP Level {user.level}</span>
                    <span className="font-mono text-indigo-400 font-bold">{user.current_xp} / 10,000 XP</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${Math.min((user.current_xp / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Honor Level Tier</span>
                  <div className="p-1 bg-zinc-950 border border-zinc-900 rounded-xl text-[10px] font-bold text-amber-400 mt-1 flex items-center gap-1 justify-center font-mono">
                    🥇 Tier 4 Regional Guide Master
                  </div>
                </div>
              </div>

              {/* Fan Club and Guardian state flags */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">Fan Club status</span>
                  <span className="text-[10px] font-bold text-zinc-300 mt-1 block flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-current" />
                    <span>Lalibela Backers (Level 3)</span>
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">Guardian Status</span>
                  <span className="text-[10px] font-bold text-zinc-300 mt-1 block flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-400 fill-current" />
                    <span>Active Guardian</span>
                  </span>
                </div>
              </div>

              {/* Medal Wall */}
              <div>
                <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-2">Medal Wall & Achievement Badges</span>
                <div className="flex flex-wrap gap-2">
                  {user.badges && user.badges.length > 0 ? (
                    user.badges.map((b, i) => (
                      <span key={i} className="text-[9.5px] bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-300 font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all">
                        <Award className="w-3 h-3 text-yellow-500" />
                        <span>{b}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-550 italic font-mono">No medals earned yet</span>
                  )}
                </div>
              </div>

              {/* Achievements listing */}
              <div>
                <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-2">Achievements List</span>
                <div className="space-y-1.5 max-h-24 overflow-y-auto scrollbar-none">
                  {GLOBAL_ACHIEVEMENTS.map((ach) => (
                    <div key={ach.id} className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3 h-3 text-blue-400 shrink-0" />
                        <div className="text-left">
                          <span className="font-bold text-zinc-200 block">{ach.name}</span>
                          <span className="text-[9px] text-zinc-500">{ach.description}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-indigo-400 font-mono shrink-0">+{ach.xp_reward} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Tasks Interactive checklist */}
              <div>
                <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-2">Daily Tasks (Interactive)</span>
                <div className="space-y-1.5">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className={`p-2 rounded-xl flex items-center gap-2.5 border cursor-pointer transition-all ${
                        t.done
                          ? "bg-zinc-900/40 border-zinc-850/60 text-zinc-500"
                          : "bg-zinc-950 border-zinc-900 hover:border-zinc-800 text-zinc-300 font-semibold"
                      }`}
                    >
                      <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${t.done ? "text-emerald-500" : "text-zinc-650"}`} />
                      <span className={`text-[11px] select-none ${t.done ? "line-through opacity-70" : ""}`}>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messaging Shortcuts row */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-900 space-y-3">
              <h4 className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Messaging Shortcuts</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenMessage(user.id);
                    onClose();
                  }}
                  className="p-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 text-blue-400 font-bold font-mono text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inbox Thread</span>
                  </span>
                  <span className="bg-blue-500 text-white font-black px-1.5 py-0.2 rounded text-[7.5px]">
                    Messages (12)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (friendStatus === "pending_received") {
                      handleAcceptFriend();
                    } else if (friendStatus === "none") {
                      handleAddFriend();
                    } else {
                      showToast("Already companions!");
                    }
                  }}
                  className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-300 font-bold font-mono text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    <UserPlus className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Requests List</span>
                  </span>
                  <span className="bg-zinc-800 text-zinc-400 font-extrabold px-1.5 py-0.2 rounded text-[7.5px]">
                    Requests (3)
                  </span>
                </button>
              </div>
            </div>

            {/* Profile actions shelf */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-900">
              {isMe ? (
                <div className="col-span-2 text-center text-[10px] text-zinc-600 font-mono uppercase tracking-widest py-1.5 bg-zinc-950 rounded-xl border border-zinc-900 p-2">
                  🛡️ Locked Sandbox - Secure device-bound Identity
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenMessage(user.id);
                      onClose();
                    }}
                    className="col-span-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message Guide</span>
                  </button>

                  <button
                    onClick={handleFollow}
                    className={`col-span-1 py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      user.isFollowed
                        ? "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-850"
                        : "bg-zinc-950 text-white border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${user.isFollowed ? "text-rose-500 fill-current" : "text-zinc-500"}`} />
                    <span>{user.isFollowed ? "Following ✓" : "Follow Guide"}</span>
                  </button>

                  <div className="col-span-2 mt-1">
                    {friendStatus === "none" && (
                      <button
                        onClick={handleAddFriend}
                        className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-dashed border-zinc-900 hover:border-zinc-800 text-xs text-zinc-400 hover:text-white rounded-xl font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-4 h-4 text-blue-400" />
                        <span>Add Travel Companion</span>
                      </button>
                    )}

                    {friendStatus === "pending_sent" && (
                      <div className="w-full py-2 bg-zinc-950/60 border border-zinc-900 text-xs text-zinc-500 rounded-xl font-semibold text-center flex items-center justify-center gap-1.5 opacity-80 cursor-not-allowed">
                        <UserCheck className="w-4 h-4 text-zinc-650" />
                        <span>Friend Request Pending</span>
                      </div>
                    )}

                    {friendStatus === "pending_received" && (
                      <div className="p-2 border border-zinc-900 bg-zinc-950 rounded-xl flex items-center justify-between gap-1.5">
                        <span className="text-[10px] text-zinc-500 font-bold ml-1 uppercase font-mono">Received Request:</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={handleAcceptFriend}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={handleRejectFriend}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400 rounded-lg font-bold cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}

                    {friendStatus === "friends" && (
                      <div className="flex items-center justify-between py-1 bg-blue-950/10 border border-blue-500/25 rounded-xl px-2.5 text-center mt-1">
                        <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold">
                          <Check className="w-4 h-4 text-blue-400 font-black" />
                          <span>Linked Companions ✓</span>
                        </div>
                        <button
                          onClick={handleRemoveFriend}
                          className="text-[9px] hover:underline text-rose-500 hover:text-rose-400 font-semibold uppercase tracking-wider cursor-pointer font-mono"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
