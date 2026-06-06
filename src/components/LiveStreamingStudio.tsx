import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Search,
  MessageSquare,
  Hash,
  Send,
  Heart,
  Share2,
  Users,
  Radio,
  Plus,
  Play,
  UserPlus,
  UsersRound,
  Trash2,
  Smile,
  Image,
  Mic,
  FileText,
  Check,
  CheckCheck,
  Award,
  Circle,
  Clock,
  UserCheck,
  UserMinus,
  MessageCircle,
  X,
  Volume2,
} from "lucide-react";
import { LiveStream, SocialPost, UserStats } from "../types";
import { INITIAL_STREAMS, INITIAL_POSTS, Language, DICTIONARY } from "../mockData";
import { socialService, GLOBAL_ACHIEVEMENTS } from "../socialStore";
import {
  SocialUser,
  Conversation,
  Message,
  ConversationMember,
  FriendRequest,
} from "../socialState";

interface LiveStreamingStudioProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  lang: Language;
  sessionEmail: string;
  onOpenProfile: (userId: string) => void;
  directChatRequestUserId: string | null;
  onClearChatRequest: () => void;
}

export default function LiveStreamingStudio({
  stats,
  onUpdateStats,
  lang,
  sessionEmail,
  onOpenProfile,
  directChatRequestUserId,
  onClearChatRequest,
}: LiveStreamingStudioProps) {
  const currentUserId = socialService.getCurrentUserId(sessionEmail);
  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  // Active sub-tabs in streaming cockpit: streams, posts, private messages (chat), companions directory (friends)
  const [activeTab, setActiveTab2] = useState<"streams" | "posts" | "chat" | "friends">("streams");

  const [streams, setStreams] = useState<LiveStream[]>(INITIAL_STREAMS);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(INITIAL_STREAMS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Hashtag states
  const [currentFilterTag, setCurrentFilterTag] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [trendingTags, setTrendingTags] = useState<string[]>([
    "#Lalibela",
    "#EthiopianCoffee",
    "#Tourism",
    "#SparkPlatform",
    "#CaveHiking",
    "#Heritage",
  ]);

  const RECENT_SEARCHES_KEY = "recent_searches";

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    let searches =
      JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");

    searches = searches.filter(
      (item: string) => item.toLowerCase() !== term.toLowerCase()
    );

    searches.unshift(term);

    if (searches.length > 5) {
      searches = searches.slice(0, 5);
    }

    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(searches)
    );
    setRecentSearches(searches);
  };

  const getRecentSearches = () => {
    return JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"
    );
  };

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const triggerSearchAction = (term: string) => {
    setIsSearching(true);
    saveRecentSearch(term);
    setTimeout(() => {
      setSearchQuery(term);
      setIsSearching(false);
    }, 600);
  };

  const addHashtag = () => {
    const tag = tagInput.trim().replace("#", "");

    if (!tag) return;

    if (hashtags.length >= 3) {
      alert("Maximum 3 hashtags allowed");
      return;
    }

    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }

    setTagInput("");
  };

  const removeHashtag = (tag: string) => {
    setHashtags(
      hashtags.filter(item => item !== tag)
    );
  };

  // Comment inside streams
  const [streamCommentText, setStreamCommentText] = useState("");

  // Social Post Creator
  const [postContent, setPostContent] = useState("");
  const [postSelectedTags, setPostSelectedTags] = useState<string[]>([]);
  const [newPostTagText, setNewPostTagText] = useState("");

  // SOCIAL ENGAGEMENT DB COMPLIANT STATES
  const [allUsers, setAllUsers] = useState<SocialUser[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<ConversationMember[]>([]);

  // Friends & Requests lists
  const [friendsList, setFriendsList] = useState<SocialUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Direct Message Form states
  const [privateMessageText, setPrivateMessageText] = useState("");
  const [attachmentType, setAttachmentType] = useState<"text" | "image" | "voice" | "file">("text");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [showEmojiMenuMsgId, setShowEmojiMenuMsgId] = useState<string | null>(null);
  const [companionSearchQuery, setCompanionSearchQuery] = useState("");

  // Simulated Typing indicator state for Active Conversation
  const [isTyping, setIsTyping] = useState<string | null>(null);

  // New Chat Dialog Popup Overlay
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTargetName, setNewChatTargetName] = useState("");
  const [newChatIsGroup, setNewChatIsGroup] = useState(false);

  // Load database entities
  const loadDatabaseData = () => {
    const listUsers = socialService.getUsers(sessionEmail);
    setAllUsers(listUsers);

    const listConvs = socialService.getConversations();
    setConversations(listConvs);

    const listMembers = socialService.getConversationMembers();
    setMembers(listMembers);

    const listMsgs = socialService.getMessages();
    setMessages(listMsgs);

    const listReqs = socialService.getFriendRequests();
    setFriendRequests(listReqs);

    const companions = socialService.getFriendsList("current_user", sessionEmail);
    setFriendsList(companions);

    // Default to first conversation if active empty
    if (!activeConversationId && listConvs.length > 0) {
      // Find a conversation containing current user
      const myConv = listConvs.find((c) => {
        const mems = listMembers.filter((m) => m.conversation_id === c.id);
        return mems.some((m) => m.user_id === currentUserId);
      });
      if (myConv) {
        setActiveConversationId(myConv.id);
      } else {
        setActiveConversationId(listConvs[0].id);
      }
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, [sessionEmail, activeTab]);

  // HANDLE INCOMING REDIRECT MESSAGING REQUEST FROM THE PROFILE MODAL
  useEffect(() => {
    if (directChatRequestUserId) {
      // Create/open 1 to 1 conversation with this target user
      const { conversation } = socialService.startOrCreateConversation(sessionEmail, directChatRequestUserId, false);
      
      // Load updated relations
      setActiveConversationId(conversation.id);
      setActiveTab2("chat");
      loadDatabaseData();

      // Fire clear request handler
      onClearChatRequest();
    }
  }, [directChatRequestUserId, sessionEmail]);

  // Simulated live streamer comment injector
  useEffect(() => {
    const timer = setInterval(() => {
      setStreams((curStreams) =>
        curStreams.map((s) => {
          const delta = Math.floor(Math.random() * 21) - 10;
          const newCount = Math.max(10, s.viewerCount + delta);

          let updatedComments = [...s.comments];
          if (Math.random() > 0.7) {
            // Find random registered user name to comment
            const usersList = socialService.getUsers(sessionEmail);
            const randomUserObj = usersList[Math.floor(Math.random() * usersList.length)];
            const randomPhrases = [
              "Sensational travel stream! Fully legal CBE payment system.",
              "Loving the traditional coffee roasting setup! ☕☕",
              "Which travel guide is registered with Telebirr?",
              "Gheralta rock churches are absolutely majestic!",
              "Just added +5 Spark stars to the broadcaster.",
              "Greetings from Addis! Let's connect.",
            ];
            const pickPhrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];

            updatedComments.push({
              id: "c-live-" + Date.now(),
              userName: randomUserObj.name,
              text: pickPhrase,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            });

            if (updatedComments.length > 15) {
              updatedComments.shift();
            }
          }

          const streamObj = {
            ...s,
            viewerCount: newCount,
            comments: updatedComments,
          };

          if (selectedStream && selectedStream.id === s.id) {
            setSelectedStream(streamObj);
          }

          return streamObj;
        })
      );
    }, 5500);

    return () => clearInterval(timer);
  }, [selectedStream, sessionEmail]);

  // Stream Comment Action
  const handlePostStreamComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamCommentText.trim() || !selectedStream) return;

    const myComment = {
      id: "my-col-" + Date.now(),
      userName: "You",
      text: streamCommentText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newComments = [...selectedStream.comments, myComment];

    setStreams((current) =>
      current.map((s) => {
        if (s.id === selectedStream.id) {
          const ret = { ...s, comments: newComments };
          setSelectedStream(ret);
          return ret;
        }
        return s;
      })
    );

    // Reward XP + coins through global triggers
    socialService.awardXP(sessionEmail, 1, "Comment on stream", `Gave a tourism comment under @${selectedStream.streamerId}'s live lobby.`, (xpGained, source) => {
      onUpdateStats({
        ...stats,
        xp: stats.xp + xpGained,
        coins: stats.coins + 2,
      });
    });

    socialService.updateDailyTaskProgress(sessionEmail, "comment_3", 1);

    setStreamCommentText("");
  };

  // Add customized hashtags
  const handleCreateCustomHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = customTagInput.startsWith("#") ? customTagInput : "#" + customTagInput;
    if (tag.length <= 1) return;

    if (!trendingTags.includes(tag)) {
      setTrendingTags([...trendingTags, tag]);
    }
    setCustomTagInput("");
  };

  const handleToggleFilter = (tag: string) => {
    setCurrentFilterTag(currentFilterTag === tag ? null : tag);
  };

  // Create social text post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost: SocialPost = {
      id: "post-custom-" + Date.now(),
      authorName: "You",
      authorId: currentUserId,
      authorAvatar: allUsers.find((u) => u.id === currentUserId)?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      content: postContent,
      tags: postSelectedTags,
      likes: 1,
      isLikedByUser: true,
      shares: 0,
      comments: [],
      createdAt: "Just now",
    };

    setPosts([newPost, ...posts]);
    setPostContent("");
    setPostSelectedTags([]);

    // Reward XP with callback
    socialService.awardXP(sessionEmail, 10, "Post in cultural feed", "Authored a new travel bulletin in regional stream directory.", (xp, source) => {
      onUpdateStats({
        ...stats,
        xp: stats.xp + xp,
      });
    });
  };

  const handleAddTagToNewPost = () => {
    let raw = newPostTagText.trim();
    if (!raw) return;
    if (!raw.startsWith("#")) raw = "#" + raw;
    if (!postSelectedTags.includes(raw)) {
      setPostSelectedTags([...postSelectedTags, raw]);
      if (!trendingTags.includes(raw)) {
        setTrendingTags([...trendingTags, raw]);
      }
    }
    setNewPostTagText("");
  };

  const handleLikePost = (postId: string) => {
    socialService.updateDailyTaskProgress(sessionEmail, "like_5", 1);
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByUser;
          return {
            ...p,
            isLikedByUser: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleSharePost = (postId: string) => {
    socialService.updateDailyTaskProgress(sessionEmail, "share_1", 1);
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return { ...p, shares: p.shares + 1 };
        }
        return p;
      })
    );

    // Shared bonus reward XP
    socialService.awardXP(sessionEmail, 10, "Share stream", "Shared travel card across external community channels.", (xp, source) => {
      onUpdateStats({
        ...stats,
        xp: stats.xp + xp,
      });
    });
  };

  // SEND CHAT FORM MESSAGE (Supports text, image attachments, mimicking sound clips/voice messages, and files)
  const handleSendPrivateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateMessageText.trim() && !attachmentUrl) return;

    let contentToSend = privateMessageText.trim();
    let computedUrl = attachmentUrl;

    if (attachmentType === "image") {
      contentToSend = contentToSend || "Sent an image attachment";
      computedUrl = computedUrl || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=300";
    } else if (attachmentType === "voice") {
      contentToSend = contentToSend || "Voice note (0:12 clip recording)";
    } else if (attachmentType === "file") {
      contentToSend = contentToSend || "RegionalComplianceReport.pdf";
    }

    socialService.sendMessage(
      sessionEmail,
      activeConversationId,
      contentToSend,
      attachmentType,
      computedUrl || undefined,
      (gained, source) => {
        onUpdateStats({ ...stats, xp: stats.xp + gained });
      }
    );

    // Increment achievements tracker on message send
    socialService.incrementAchievementProgress(sessionEmail, "ach-3", 1, (xpGained, src) => {
      onUpdateStats({ ...stats, xp: stats.xp + xpGained });
    });

    setPrivateMessageText("");
    setAttachmentUrl("");
    setAttachmentType("text");
    loadDatabaseData();

    // Trigger target typing simulation to emulate natural chat
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    if (activeConv) {
      const activeMembers = members.filter((m) => m.conversation_id === activeConversationId);
      const targetMember = activeMembers.find((m) => m.user_id !== currentUserId);

      if (targetMember) {
        const targetUserObj = allUsers.find((u) => u.id === targetMember.user_id);
        if (targetUserObj) {
          setIsTyping(targetUserObj.name);

          setTimeout(() => {
            setIsTyping(null);
            // Re-fetch replies
            const simulatedReplies = [
              `Absolutely right! I will share my telebirr-cleared guidelines tomorrow.`,
              `Thanks! Let's synchronize Gheralta climbing plans.`,
              `Can you claim your daily +20 XP Spark task?`,
              `That looks perfect. I just added you as a companion.`,
              `Hello! Connecting from Awash Bank branch lobby.`,
            ];
            const pick = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

            socialService.sendMessage(
              targetUserObj.email || "buddy@spark.regional",
              activeConversationId,
              pick,
              "text"
            );
            loadDatabaseData();
          }, 3200);
        }
      }
    }
  };

  // logical delete of a message with update to text: "This message was deleted."
  const handleDeleteMessage = (msgId: string) => {
    const ok = socialService.deleteMessage(msgId);
    if (ok) {
      loadDatabaseData();
    }
  };

  // toggle message reaction emoji directly under target message
  const handleToggleReaction = (msgId: string, emoji: string) => {
    socialService.toggleMessageReaction(msgId, currentUserId, emoji);
    setShowEmojiMenuMsgId(null);
    loadDatabaseData();
  };

  // Start new chat popup form trigger
  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatTargetName.trim()) return;

    // Find if user already exists
    const match = allUsers.find((u) => u.name.toLowerCase().includes(newChatTargetName.toLowerCase()));

    if (!match) {
      alert("No tourist or guide with that name found in historical records!");
      return;
    }

    const { conversation } = socialService.startOrCreateConversation(
      sessionEmail,
      match.id,
      newChatIsGroup,
      newChatIsGroup ? `${match.name}'s Custom Group` : undefined
    );

    setActiveConversationId(conversation.id);
    setShowNewChatModal(false);
    setNewChatTargetName("");
    loadDatabaseData();
  };

  // Acceptance of Friend Request directly inside companions tab
  const handleAcceptRequest = (reqId: string) => {
    socialService.acceptFriendRequest(reqId, sessionEmail, (gained, source) => {
      onUpdateStats({ ...stats, xp: stats.xp + gained });
    });
    // Increment achievements invite tracking
    socialService.incrementAchievementProgress(sessionEmail, "ach-4", 1, (xpGained, src) => {
      onUpdateStats({ ...stats, xp: stats.xp + xpGained });
    });
    loadDatabaseData();
  };

  // Rejection of request
  const handleRejectRequest = (reqId: string) => {
    socialService.rejectFriendRequest(reqId);
    loadDatabaseData();
  };

  // Global query filters
  const filteredStreams = streams.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.streamerId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = currentFilterTag ? s.tags.includes(currentFilterTag) : true;
    return matchesSearch && matchesTag;
  });

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = currentFilterTag ? p.tags.includes(currentFilterTag) : true;
    return matchesSearch && matchesTag;
  });

  // Resolve chat metadata representation (avatar, name) for Sidebar list
  const getConversationMeta = (conv: Conversation) => {
    const activeMembers = members.filter((m) => m.conversation_id === conv.id);
    if (conv.isGroup) {
      return {
        name: conv.name || "CBE Stream Group",
        avatarUrl: conv.avatarUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=100",
        desc: "Group stream",
      };
    } else {
      // Find the opposite member
      const other = activeMembers.find((m) => m.user_id !== currentUserId);
      if (other) {
        const u = allUsers.find((user) => user.id === other.user_id);
        if (u) {
          return {
            name: `${u.name}`,
            avatarUrl: u.avatarUrl,
            desc: `Level ${u.level} Guide`,
            otherId: u.id,
          };
        }
      }
      return {
        name: "Tourist Companion",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        desc: "Offline channel",
      };
    }
  };

  // Filter messages for active conversation
  const activeConversationMessages = messages.filter((m) => m.conversation_id === activeConversationId);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Search Header and Cocktail tag dashboard */}
      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-2 relative w-full md:w-96 text-left">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  triggerSearchAction(searchInput);
                }
              }}
              placeholder="Search active streams or hashtags (Press Enter)..."
              className="w-full bg-zinc-900 border border-zinc-805 text-xs text-white rounded-xl pl-10 pr-10 py-2.5 focus:border-blue-500 outline-none placeholder-zinc-500 font-semibold"
            />
            {isSearching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <span className="flex h-3.5 w-3.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
                </span>
              </div>
            )}
          </div>

          {/* Recent searches row */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Recent:</span>
              {recentSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSearchInput(item);
                    triggerSearchAction(item);
                  }}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-750 text-[10px] text-zinc-400 hover:text-white rounded-md font-mono cursor-pointer transition-all"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem("recent_searches");
                  setRecentSearches([]);
                }}
                className="text-[9.5px] text-zinc-650 hover:text-rose-400 hover:underline font-bold font-mono ml-auto"
                title="Clear recent list"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Level, XP and streaming actions top overview */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1.5 md:pb-0">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleToggleFilter(tag)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                currentFilterTag === tag
                  ? "bg-blue-600 text-white border-transparent shadow"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              <Hash className="w-2.5 h-2.5 inline mr-0.5" />
              {tag.replace("#", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inner Section Navigation: Streams, Posts, Messaging, Friends */}
      <div className="flex items-center gap-2 mb-1 bg-zinc-950 p-1 rounded-2xl border border-zinc-900 self-start justify-items-start whitespace-nowrap overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab2("streams")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "streams" ? "bg-zinc-800 text-white border border-zinc-700 shadow" : "text-zinc-450 hover:text-white"
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-blue-450 text-blue-500" />
          <span>Lobbies ({filteredStreams.length})</span>
        </button>
        <button
          onClick={() => setActiveTab2("posts")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "posts" ? "bg-zinc-800 text-white border border-zinc-700 shadow" : "text-zinc-450 hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          <span>Cultural Cards ({filteredPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab2("chat")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "chat" ? "bg-zinc-800 text-white border border-zinc-700 shadow" : "text-zinc-450 hover:text-white"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Direct Messages</span>
        </button>
        <button
          onClick={() => setActiveTab2("friends")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "friends" ? "bg-zinc-800 text-white border border-zinc-700 shadow" : "text-zinc-450 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span>Companions Network</span>
        </button>
      </div>

      {/* CORE VIEW RENDERING SLOT */}
      <div className="grid grid-cols-1">
        {/* STREAMS TAB */}
        {activeTab === "streams" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {isSearching ? (
                /* PULSING TV SKELETON DISPLAY STATE */
                <div className="p-5 bg-zinc-950 border border-zinc-900 w-full rounded-3xl flex flex-col gap-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-zinc-800 rounded w-1/3" />
                      <div className="h-2.5 bg-zinc-850 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="w-full aspect-video bg-zinc-900/80 rounded-2xl flex items-center justify-center">
                    <Search className="w-8 h-8 text-zinc-750 animate-spin" />
                  </div>
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                  <div className="h-9 bg-zinc-800 rounded w-full" />
                </div>
              ) : selectedStream ? (
                <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl relative">
                  <div className={`relative aspect-video w-full bg-gradient-to-tr ${selectedStream.bgGradient} flex items-center justify-center p-6 text-center`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.85))] z-10" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_25%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-40 z-10 pointer-events-none" />

                    <div className="relative z-20 text-white p-4">
                      <div className="w-14 h-14 rounded-full bg-slate-950/60 border border-white/20 flex items-center justify-center mx-auto mb-3 cursor-pointer" onClick={() => onOpenProfile(selectedStream.streamerId)}>
                        <Video className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-md font-bold tracking-tight mb-1">{selectedStream.title}</h4>
                      <p className="text-xs text-slate-300">Live Session: @{selectedStream.streamerId}</p>
                    </div>

                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                      <img
                        src={selectedStream.streamerAvatar}
                        alt={selectedStream.streamerName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full border border-white/20 text-xs object-cover cursor-pointer"
                        onClick={() => onOpenProfile(selectedStream.streamerId)}
                      />
                      <div className="text-left text-xs text-white">
                        <div className="font-bold cursor-pointer hover:underline" onClick={() => onOpenProfile(selectedStream.streamerId)}>{selectedStream.streamerName}</div>
                        <div className="text-[10px] text-slate-300">ID: @{selectedStream.streamerId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Broadcaster Controller Overlay */}
                  {selectedStream.streamerId === currentUserId && (
                    <div id="broadcaster-studio-overlay" className="p-4 bg-zinc-950/80 border-t border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 mr-2"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-zinc-100 block uppercase tracking-wider flex items-center gap-1">🎙️ Broadcaster Studio Console</span>
                          <p className="text-[9.5px] text-zinc-500 font-medium">Log simulated streaming minutes to complete the dynamic daily quest.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            socialService.updateDailyTaskProgress(sessionEmail, "stream_10", 1);
                            alert("Simulated +1 minute of stream broadcasting! Watch your Daily Tasks progress update in the Honor Dashboard.");
                          }}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-[9px] font-bold text-indigo-400 rounded-lg hover:text-white transition-all cursor-pointer"
                        >
                          📹 +1 Minute
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            socialService.updateDailyTaskProgress(sessionEmail, "stream_10", 10);
                            alert("Simulated +10 minutes of active stream broadcasting! Watch your Daily Tasks progress update in the Honor Dashboard.");
                          }}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-[10px] font-bold text-white rounded-lg transition-all cursor-pointer"
                        >
                          🚀 Complete 10 Min Quest!
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Comments Panel */}
                  <div className="p-4 bg-slate-900 border-t border-slate-850">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">Live Stream Chat Comments</h5>
                    <div className="space-y-2 mb-4 max-h-[140px] overflow-y-auto pr-1">
                      {selectedStream.comments.map((comm) => (
                        <div key={comm.id} className="text-xs flex items-start gap-1.5 leading-normal text-left">
                          <span
                            onClick={() => {
                              // Retrieve user obj matching comm.userName
                              const matchObj = allUsers.find((au) => au.name.toLowerCase() === comm.userName.toLowerCase());
                              if (matchObj) onOpenProfile(matchObj.id);
                            }}
                            className="font-bold text-blue-400 font-mono shrink-0 cursor-pointer hover:underline"
                          >
                            @{comm.userName}:
                          </span>
                          <span className="text-slate-200">{comm.text}</span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handlePostStreamComment} className="flex gap-2">
                      <input
                        type="text"
                        value={streamCommentText}
                        onChange={(e) => setStreamCommentText(e.target.value)}
                        placeholder="Type legal feedback message..."
                        className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2.5 outline-none focus:border-amber-400 placeholder-slate-600"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shrink-0 cursor-pointer text-xs font-bold flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </button>
                    </form>

                    {/* Display Hashtags to Viewers */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-3 border-t border-slate-850">
                      <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Lobby Hashtags:</span>
                      {(() => {
                        const tagsList = (selectedStream as any).hashtags || selectedStream.tags || [];
                        if (tagsList.length === 0) {
                          return <span className="text-[10px] text-zinc-650 italic font-medium">No tags set</span>;
                        }
                        return tagsList.map((tag: string) => {
                          const clean = tag.replace("#", "");
                          return (
                            <button
                              key={clean}
                              onClick={() => {
                                setSearchInput(`#${clean}`);
                                triggerSearchAction(`#${clean}`);
                              }}
                              className="px-2 py-0.5 bg-slate-950 hover:bg-zinc-900 border border-slate-800 hover:border-slate-700 text-[10px] text-blue-450 text-blue-400 hover:text-white rounded-md font-mono transition-colors cursor-pointer"
                            >
                              #{clean}
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-950 border border-slate-850 rounded-2xl text-slate-400 text-sm">
                  Select a live tourist broadcast to watch.
                </div>
              )}
            </div>

            {/* Right category listing column */}
            <div className="lg:col-span-1 space-y-4">
              {/* "Construct Live Broadcast Lobby" creator box with the Hashtag System! */}
              <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-3xl text-left space-y-3">
                <div>
                  <h4 className="text-[10.5px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    <span>Construct Broadcast Lobby</span>
                  </h4>
                  <p className="text-[10px] text-zinc-550 mt-0.5 leading-relaxed font-semibold">Start your custom livestream feed with tagging support.</p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">Lobby Broadcast Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Ancient Rock Churches Tour..."
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      className="w-full bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  {/* Hashtags Section */}
                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Lobby Hashtags ({hashtags.length}/3)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. Travel, Ethiopia"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addHashtag();
                          }
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-805 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={addHashtag}
                        className="px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Add
                      </button>
                    </div>

                    {/* Show Tag Pills */}
                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-[10px] text-blue-450 font-mono font-bold rounded-md"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeHashtag(tag)}
                              className="text-rose-500 hover:text-rose-400 font-bold ml-0.5 text-[9px] cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!customTagInput.trim()) {
                        alert("Please specify a stream title first");
                        return;
                      }
                      const activeUserObj = allUsers.find(u => u.email === sessionEmail);
                      const myName = activeUserObj?.name || "Broadcaster Guide";
                      const myAvatar = activeUserObj?.avatarUrl || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=200";

                      const colors = [
                        "from-purple-600 via-indigo-500 to-blue-600",
                        "from-emerald-600 via-teal-500 to-green-600",
                        "from-amber-600 via-orange-500 to-yellow-600",
                        "from-rose-600 via-pink-500 to-red-600"
                      ];
                      const randomColor = colors[Math.floor(Math.random() * colors.length)];

                      const newStream: LiveStream = {
                        id: `stream-${Date.now()}`,
                        streamerName: myName,
                        streamerId: currentUserId,
                        streamerAvatar: myAvatar,
                        title: customTagInput.trim(),
                        tags: hashtags.map(tag => `#${tag}`),
                        viewerCount: 1,
                        isLive: true,
                        bgGradient: randomColor,
                        comments: [
                          { id: `c-${Date.now()}`, userName: "TourLobbyBot", text: "Welcome to your new livestream broadcast! Ask guests to chat.", timestamp: "12:00" }
                        ]
                      };
                      (newStream as any).hashtags = [...hashtags];

                      setStreams([newStream, ...streams]);
                      setSelectedStream(newStream);
                      setCustomTagInput("");
                      setHashtags([]);
                      alert("Livestream successfully constructed! Check the list below.");
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg py-2 text-xs font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    🚀 Launch New Broadcast
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-450 text-zinc-400 font-bold uppercase tracking-wider text-left pt-2">Broadcasters ({filteredStreams.length})</h4>
              
              {isSearching ? (
                // SKELETON BROADCASTERS
                [1, 2, 3].map((n) => (
                  <div key={n} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-2xl flex items-center gap-3 animate-pulse text-left">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-zinc-800 rounded w-3/4" />
                      <div className="h-2.5 bg-zinc-850 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : filteredStreams.length > 0 ? (
                filteredStreams.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStream(s)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                      selectedStream?.id === s.id
                        ? "bg-slate-905 bg-slate-900 border-blue-500/40 text-white"
                        : "bg-zinc-950 border-zinc-850 text-slate-400 hover:text-white"
                    }`}
                  >
                    <img
                      src={s.streamerAvatar}
                      alt={s.streamerName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-zinc-800 text-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold block truncate text-slate-200">{s.title}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block font-mono">@{s.streamerId}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-600 bg-zinc-950/20 border border-zinc-900 rounded-2xl p-4 font-semibold italic">
                  No broadcasters matched the filter query.
                </div>
              )}
            </div>
          </div>
        )}

        {/* POSTS BULLETIN TAB */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Create bulletin form */}
            <div className="lg:col-span-1">
              <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-3xl sticky top-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Publish Travel Bulletin</h4>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Enter travel tip, payment compliance details to tourists..."
                    rows={4}
                    className="w-full bg-zinc-900 border border-zinc-805 border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500"
                    required
                  />

                  {/* Dynamic Post tag row */}
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-2">New tags associated</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newPostTagText}
                        onChange={(e) => setNewPostTagText(e.target.value)}
                        placeholder="e.g. #Lalibela"
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTagToNewPost}
                        className="p-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                    {postSelectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {postSelectedTags.map((tag) => (
                          <span key={tag} className="text-[10px] bg-zinc-900 border border-zinc-800 text-amber-400 px-2 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer uppercase font-mono"
                  >
                    Post Bulletin (+10 XP)
                  </button>
                </form>
              </div>
            </div>

            {/* Posts Grid listings */}
            <div className="lg:col-span-2 space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border border-zinc-800 object-cover cursor-pointer text-xs"
                      onClick={() => onOpenProfile(post.authorId)}
                    />
                    <div>
                      <span
                        onClick={() => onOpenProfile(post.authorId)}
                        className="text-xs font-extrabold text-white block hover:underline cursor-pointer"
                      >
                        {post.authorName}
                      </span>
                      <span className="text-[9px] text-zinc-550 text-zinc-500 font-mono">@{post.authorId} • {post.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>

                  <div className="flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[9px] bg-zinc-950 border border-zinc-850 text-amber-500 px-2 py-0.5 rounded-md font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/50">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold cursor-pointer ${
                        post.isLikedByUser ? "text-rose-500" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{post.likes} Hearts</span>
                    </button>

                    <button
                      onClick={() => handleSharePost(post.id)}
                      className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider font-bold cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{post.shares} Shares</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGING COCKPIT TAB */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-4 min-h-[480px]">
            {/* Sidebar Column: Channels + Guides Directory */}
            <div className="lg:col-span-1 border-r border-zinc-850/50 pr-4 text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Channels</h4>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-blue-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Chat</span>
                  </button>
                </div>

                {/* Search Inbox */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {conversations.map((conv) => {
                    const meta = getConversationMeta(conv);
                    const isActive = conv.id === activeConversationId;
                    const lastMsg = messages
                      .filter((m) => m.conversation_id === conv.id)
                      .slice(-1)[0];

                    return (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`p-3 rounded-2xl cursor-pointer border text-left transition-all relative ${
                          isActive
                            ? "bg-zinc-900 border-blue-500/40 text-white"
                            : "bg-zinc-950/40 border-zinc-850 hover:bg-zinc-902 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={meta.avatarUrl}
                            alt={meta.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-zinc-800 text-xs shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold truncate text-slate-100">{meta.name}</span>
                              {conv.isGroup && (
                                <span className="text-[7px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-mono leading-none">
                                  GRP
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-500 block truncate mt-0.5">
                              {lastMsg ? lastMsg.content : "No messages yet"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Auditor regional label */}
              <div className="text-[9.5px] text-zinc-550 text-zinc-550 text-zinc-550 text-zinc-500 leading-normal border-t border-zinc-850/50 pt-3 mt-4">
                🔒 Tourist messages are audit protected to check compliance in legal travel zones.
              </div>
            </div>

            {/* Conversation Flow Column */}
            <div className="lg:col-span-2 flex flex-col justify-between min-h-[420px] text-left">
              {/* Header metadata */}
              {activeConversationId ? (
                (() => {
                  const activeConv = conversations.find((c) => c.id === activeConversationId);
                  if (!activeConv) return null;
                  const meta = getConversationMeta(activeConv);

                  return (
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={meta.avatarUrl}
                          alt={meta.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-zinc-800 text-xs cursor-pointer"
                          onClick={() => meta.otherId && onOpenProfile(meta.otherId)}
                        />
                        <div>
                          <span
                            onClick={() => meta.otherId && onOpenProfile(meta.otherId)}
                            className="text-xs font-extrabold text-white block cursor-pointer hover:underline"
                          >
                            {meta.name}
                          </span>
                          <span className="text-[9px] text-zinc-500 block">{meta.desc}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Conversation removal trigger */}
                        <button
                          onClick={() => {
                            if (confirm("Delete this conversation? All messaging parameters will reset.")) {
                              const remaining = conversations.filter((c) => c.id !== activeConversationId);
                              setConversations(remaining);
                              if (remaining.length > 0) setActiveConversationId(remaining[0].id);
                              loadDatabaseData();
                            }
                          }}
                          className="p-1 px-2 hover:bg-rose-950/20 text-rose-450 hover:text-rose-400 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-rose-900 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                          <span>Delete Conv</span>
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="border-b border-dashed border-zinc-800 pb-3 mb-3 text-xs text-zinc-500 font-semibold italic text-center">
                  No active channel selected
                </div>
              )}

              {/* Chat Messages flow log */}
              <div className="flex-1 overflow-y-auto space-y-3.5 mb-4 max-h-[300px] pr-1 scrollbar-none">
                {activeConversationMessages.map((m) => {
                  const isMe = m.sender_id === currentUserId;
                  const senderUser = allUsers.find((u) => u.id === m.sender_id);

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col relative group ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%]`}>
                        {!isMe && (
                          <img
                            src={senderUser?.avatarUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-6.5 h-6.5 rounded-full object-cover border border-zinc-800 shrink-0 text-[10px] mt-0.5"
                          />
                        )}
                        <div>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed transition-all relative ${
                              isMe
                                ? "bg-blue-600 text-white font-medium rounded-tr-none"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                            } ${m.is_deleted ? "italic text-zinc-500 opacity-60 bg-zinc-955" : ""}`}
                          >
                            <span className="text-[7.5px] font-mono block opacity-60 mb-0.5 font-extrabold uppercase tracking-tight">
                              {isMe ? "You" : senderUser?.name || "Member"}
                            </span>

                            {/* Render different message attachment configurations */}
                            {m.message_type === "image" && m.media_url && !m.is_deleted && (
                              <div className="mb-2 rounded-xl overflow-hidden border border-zinc-800">
                                <img src={m.media_url} alt="Attachment" className="max-w-full h-auto object-cover max-h-[140px]" />
                              </div>
                            )}

                            {m.message_type === "voice" && !m.is_deleted && (
                              <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg mb-1.5 border border-zinc-800">
                                <Mic className="w-3.5 h-3.5 text-amber-500 fill-current animate-pulse shrink-0" />
                                <div className="text-[10px] font-mono tracking-tight text-zinc-300">Voice Note Audio clip</div>
                              </div>
                            )}

                            {m.message_type === "file" && !m.is_deleted && (
                              <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg mb-1.5 border border-zinc-850">
                                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                <div className="font-mono text-[9px] underline text-blue-300 select-all font-bold">SparkDoc_102.pdf</div>
                              </div>
                            )}

                            <div>{m.content}</div>

                            {/* Emoji reaction rendering slot */}
                            {m.reactions && m.reactions.length > 0 && (
                              <div className="flex gap-1 mt-1.5">
                                {m.reactions.map((react, i) => (
                                  <span key={i} className="text-[10px] bg-black/45 border border-zinc-800 px-1 py-0.2 rounded-md">
                                    {react.emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Trigger interactive actions & reactions pane */}
                          {!m.is_deleted && (
                            <div className="flex items-center gap-2.5 mt-1 px-1 flex-wrap">
                              <span className="text-[7.5px] text-zinc-500 font-mono">
                                {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>

                              {/* Read Receipts indication */}
                              {isMe ? (
                                <span className="text-blue-400 font-mono tracking-tight text-[8px] flex items-center">
                                  Read <CheckCheck className="w-3" />
                                </span>
                              ) : (
                                <span className="text-zinc-550 text-zinc-500 font-mono text-[8px] flex items-center">
                                  Received <Check className="w-2.5 h-2.5" />
                                </span>
                              )}

                              {/* Reaction launcher */}
                              <button
                                onClick={() => setShowEmojiMenuMsgId(showEmojiMenuMsgId === m.id ? null : m.id)}
                                className="text-[9px] text-zinc-500 hover:text-white cursor-pointer select-none"
                              >
                                React 👍
                              </button>

                              {/* Message logical delete */}
                              {isMe && (
                                <button
                                  onClick={() => handleDeleteMessage(m.id)}
                                  className="text-[9px] text-zinc-550 text-rose-450 hover:text-rose-400 cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}

                              {/* Emoji selection popup */}
                              {showEmojiMenuMsgId === m.id && (
                                <div className="bg-zinc-950 border border-zinc-850 p-1.5 rounded-xl flex gap-1.5 shadow-2xl absolute z-30">
                                  {["👍", "❤️", "🔥", "☕", "🦁", "🇪🇹"].map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => handleToggleReaction(m.id, emoji)}
                                      className="hover:scale-125 transition-all text-xs cursor-pointer select-none"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Simulated Typing effect render */}
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 text-[10px] flex items-center justify-center font-bold text-zinc-300">
                      💬
                    </div>
                    <div className="bg-zinc-900 p-2.5 border border-zinc-850 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-400">{isTyping} is typing</span>
                      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" />
                      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce delay-100" />
                      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce delay-250" />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input panel */}
              <form onSubmit={handleSendPrivateMessage} className="space-y-2">
                {/* Attachment choices row */}
                <div className="flex gap-2 items-center px-1.5 py-1 bg-zinc-900/60 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold mr-2">Media:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("text");
                      setAttachmentUrl("");
                    }}
                    className={`p-1 px-2 text-[9px] rounded font-bold cursor-pointer transition-all ${
                      attachmentType === "text" ? "bg-zinc-800 text-blue-400" : "text-zinc-550 text-zinc-400"
                    }`}
                  >
                    Text Only
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("image");
                      setAttachmentUrl("https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=300");
                    }}
                    className={`p-1 px-2 text-[9px] rounded font-bold cursor-pointer transition-all flex items-center gap-0.5 ${
                      attachmentType === "image" ? "bg-zinc-800 text-blue-400" : "text-zinc-450 text-zinc-400"
                    }`}
                  >
                    <Image className="w-3" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("voice");
                      setAttachmentUrl("voice-stub-0:12");
                    }}
                    className={`p-1 px-2 text-[9px] rounded font-bold cursor-pointer transition-all flex items-center gap-0.5 ${
                      attachmentType === "voice" ? "bg-zinc-800 text-blue-400" : "text-zinc-400"
                    }`}
                  >
                    <Mic className="w-3" />
                    <span>Voice note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("file");
                      setAttachmentUrl("regional-receipt.pdf");
                    }}
                    className={`p-1 px-2 text-[9px] rounded font-bold cursor-pointer transition-all flex items-center gap-0.5 ${
                      attachmentType === "file" ? "bg-zinc-800 text-blue-400" : "text-zinc-400"
                    }`}
                  >
                    <FileText className="w-3" />
                    <span>Doc</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={privateMessageText}
                    onChange={(e) => setPrivateMessageText(e.target.value)}
                    placeholder="Type legal message complying with regional protocol..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none placeholder-zinc-650"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow cursor-pointer transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* COMPANIANS & FRIENDS SYSTEM DIRECTORY */}
        {activeTab === "friends" && (
          <div className="space-y-6 text-left animate-fade-in relative z-10">
            {/* Split row: Left holds current requests, Right searchable explorers directory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Requests Ledger & Current Travel companions list */}
              <div className="space-y-6">
                {/* Incoming / Outgoing Requests shelf */}
                <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-3xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Companion Invites Ledger</span>
                  </h4>
                  <p className="text-[10px] text-zinc-500 mb-4 leading-normal">
                    Establishing companions grants +10 XP trigger score to both accounts linked successfully.
                  </p>

                  {/* List incoming friend request notifications */}
                  <div className="space-y-2">
                    {friendRequests.filter((r) => r.receiver_id === currentUserId && r.status === "pending").length > 0 ? (
                      friendRequests
                        .filter((r) => r.receiver_id === currentUserId && r.status === "pending")
                        .map((req) => {
                          const requesterObj = allUsers.find((u) => u.id === req.sender_id);
                          return (
                            <div key={req.id} className="p-3 bg-zinc-900 border border-zinc-850 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={requesterObj?.avatarUrl}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-full object-cover text-xs border border-zinc-800"
                                />
                                <div>
                                  <span className="text-xs font-bold text-white block truncate">{requesterObj?.name}</span>
                                  <span className="text-[8.5px] text-zinc-500 font-mono uppercase tracking-tight">Level {requesterObj?.level} tourist</span>
                                </div>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleAcceptRequest(req.id)}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-550 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-rose-450 hover:text-rose-400 rounded-lg cursor-pointer font-bold"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-4 bg-zinc-900/40 border border-zinc-850 rounded-2xl text-[10px] text-zinc-550 text-zinc-500 font-semibold italic">
                        No pending companion requests received.
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Active Friends list */}
                <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-3xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>My Tour Companions ({friendsList.length})</span>
                  </h4>

                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {friendsList.length > 0 ? (
                      friendsList.map((buddy) => (
                        <div key={buddy.id} className="p-3.5 bg-zinc-900 border border-zinc-850 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={buddy.avatarUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-zinc-800 text-xs shrink-0 cursor-pointer"
                              onClick={() => onOpenProfile(buddy.id)}
                            />
                            <div>
                              <span
                                onClick={() => onOpenProfile(buddy.id)}
                                className="text-xs font-extrabold text-white block hover:underline cursor-pointer"
                              >
                                {buddy.name}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5 font-mono text-[8px]">
                                <span className="bg-zinc-950 text-zinc-400 px-1 py-0.2 rounded font-bold">LVL {buddy.level}</span>
                                <span className="text-zinc-500 font-semibold">Ready Companion</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                // Transition to private message setup
                                const { conversation } = socialService.startOrCreateConversation(sessionEmail, buddy.id, false);
                                setActiveConversationId(conversation.id);
                                setActiveTab2("chat");
                              }}
                              className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-blue-500/25 rounded-lg text-blue-400 hover:text-white cursor-pointer transition-all"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${buddy.name} from companions network?`)) {
                                  socialService.removeFriendship(buddy.id, sessionEmail);
                                  loadDatabaseData();
                                }
                              }}
                              className="p-1.5 bg-zinc-950 border border-zinc-840 rounded-lg hover:bg-rose-950/20 text-rose-450 hover:text-rose-400 cursor-pointer border-zinc-800"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-zinc-550 text-zinc-500 italic text-[10.5px]">
                        You haven't added any travel companions yet! Search explorers on the right panel to send companion requests.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Search Explorer and Send Friend Request */}
              <div className="p-5 bg-zinc-955 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-450 text-blue-400" />
                  <span>Discover Guides & Explorers Directory</span>
                </h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={companionSearchQuery}
                    onChange={(e) => setCompanionSearchQuery(e.target.value)}
                    placeholder="Filter profiles by keyword, zone, expertise..."
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-702 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-blue-500 placeholder-zinc-700 font-mono"
                  />
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {allUsers
                    .filter((u) => u.id !== currentUserId)
                    .filter((u) => u.name.toLowerCase().includes(companionSearchQuery.toLowerCase()))
                    .map((guy) => {
                      // Check relationship
                      const isFriend = friendsList.some((f) => f.id === guy.id);
                      const pendingSent = friendRequests.some((r) => r.sender_id === currentUserId && r.receiver_id === guy.id && r.status === "pending");

                      return (
                        <div key={guy.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2 pr-2 min-w-0">
                            <img
                              src={guy.avatarUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover text-xs border border-zinc-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <span
                                onClick={() => onOpenProfile(guy.id)}
                                className="text-xs font-bold text-white block truncate hover:underline cursor-pointer"
                              >
                                {guy.name}
                              </span>
                              <span className="text-[8.5px] text-zinc-500 font-mono truncate block mt-0.5">
                                LVL {guy.level} • {guy.friendsCount.toLocaleString()} Friends
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onOpenProfile(guy.id)}
                              className="px-2.5 py-1 hover:bg-zinc-850 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white rounded-lg cursor-pointer transition-all"
                            >
                              Inspect
                            </button>
                            {isFriend ? (
                              <span className="text-[10px] font-bold text-blue-450 text-blue-400 flex items-center px-1 font-mono gap-0.5">
                                Friends ✓
                              </span>
                            ) : pendingSent ? (
                              <span className="text-[9px] text-zinc-500 italic px-1 font-semibold">
                                Pending
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  const res = socialService.sendFriendRequest(sessionEmail, guy.id);
                                  if (res.success) {
                                    alert("Companion request sent!");
                                    loadDatabaseData();
                                  } else {
                                    alert(res.message);
                                  }
                                }}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-blue-400 font-bold hover:text-white rounded-lg cursor-pointer"
                              >
                                Invite +
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Chat modal dialog */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-left">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Start Private Channel</h4>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 hover:bg-zinc-800 rounded-lg cursor-pointer text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mb-4 leading-normal">
              Conduct secure conversations with registered guides. Select a target from search results.
            </p>

            <form onSubmit={handleCreateNewChat} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold tracking-wide mb-1">Target Name</label>
                <input
                  type="text"
                  value={newChatTargetName}
                  onChange={(e) => setNewChatTargetName(e.target.value)}
                  placeholder="e.g. Helen, Lalibela"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="make-group-chk"
                  checked={newChatIsGroup}
                  onChange={(e) => setNewChatIsGroup(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-blue-600"
                />
                <label htmlFor="make-group-chk" className="text-xs text-slate-300 select-none cursor-pointer">
                  Setup as regional Group stream
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-400 text-xs hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
