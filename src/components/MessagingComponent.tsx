import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Trash2,
  Check,
  CheckCheck,
  Plus,
  FileText,
  Image,
  Mic,
  MoreVertical,
  X,
  Users,
  Award,
  Heart,
  UserCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  Smile,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { socialService, GLOBAL_ACHIEVEMENTS } from "../socialStore";
import {
  SocialUser,
  Conversation,
  Message,
  MessageRead,
  ConversationMember,
  FriendRequest,
} from "../socialState";
import { Language, DICTIONARY } from "../mockData";
import { UserStats } from "../types";

interface MessagingComponentProps {
  lang: Language;
  sessionEmail: string;
  onOpenProfile: (userId: string) => void;
  directChatRequestUserId: string | null;
  onClearChatRequest: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export default function MessagingComponent({
  lang,
  sessionEmail,
  onOpenProfile,
  directChatRequestUserId,
  onClearChatRequest,
  stats,
  onUpdateStats,
}: MessagingComponentProps) {
  const currentUserId = socialService.getCurrentUserId(sessionEmail);
  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  // DB States
  const [allUsers, setAllUsers] = useState<SocialUser[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<ConversationMember[]>([]);
  const [messageReads, setMessageReads] = useState<MessageRead[]>([]);
  
  // Filtering & input states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [privateMessageText, setPrivateMessageText] = useState("");
  const [attachmentType, setAttachmentType] = useState<"text" | "image" | "voice" | "file">("text");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [showEmojiMenuMsgId, setShowEmojiMenuMsgId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("recent_searches_msg");
    if (raw) {
      try {
        setRecentSearches(JSON.parse(raw));
      } catch (err) {}
    }
  }, []);

  const saveMsgSearch = (term: string) => {
    if (!term.trim()) return;
    let searches: string[] = [];
    const raw = localStorage.getItem("recent_searches_msg");
    if (raw) {
      try {
        searches = JSON.parse(raw);
      } catch (e) {}
    }
    searches = searches.filter(x => x.toLowerCase() !== term.trim().toLowerCase());
    searches.unshift(term.trim());
    if (searches.length > 5) {
      searches = searches.slice(0, 5);
    }
    localStorage.setItem("recent_searches_msg", JSON.stringify(searches));
    setRecentSearches(searches);
  };

  const triggerSearchAction = (term: string) => {
    setIsSearching(true);
    saveMsgSearch(term);
    setTimeout(() => {
      setSearchQuery(term);
      setIsSearching(false);
    }, 600);
  };
  
  // Custom modals/interfaces
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTargetName, setNewChatTargetName] = useState("");
  const [newChatIsGroup, setNewChatIsGroup] = useState(false);
  const [isTyping, setIsTyping] = useState<string | null>(null);

  // Bottom scroll ref
  const chatBottomRef = useRef<HTMLDivElement>(null);

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

    const listReads = socialService.getMessageReads();
    setMessageReads(listReads);

    // Default to first conversation containing current user if active incomplete
    if (!activeConversationId && listConvs.length > 0) {
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
  }, [sessionEmail]);

  // Keep chat window scrolled to the end and auto-read seen incoming messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (activeConversationId && currentUserId) {
      socialService.markMessagesAsRead(activeConversationId, currentUserId);
      const listReads = socialService.getMessageReads();
      setMessageReads(listReads);
    }
  }, [messages, activeConversationId, currentUserId]);

  // HANDLE INCOMING REDIRECT MESSAGING REQUEST FROM OTHER PORTALS
  useEffect(() => {
    if (directChatRequestUserId) {
      const { conversation } = socialService.startOrCreateConversation(sessionEmail, directChatRequestUserId, false);
      setActiveConversationId(conversation.id);
      loadDatabaseData();
      onClearChatRequest();
    }
  }, [directChatRequestUserId, sessionEmail]);

  // Actions
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

    const newMsg = socialService.sendMessage(
      sessionEmail,
      activeConversationId,
      contentToSend,
      attachmentType,
      computedUrl || undefined,
      (gained, source) => {
        onUpdateStats({ ...stats, xp: stats.xp + gained });
      }
    );

    // Trigger achievement tracker progress on message send
    socialService.incrementAchievementProgress(sessionEmail, "ach-3", 1, (xpGained, src) => {
      onUpdateStats({ ...stats, xp: stats.xp + xpGained });
    });

    setPrivateMessageText("");
    setAttachmentUrl("");
    setAttachmentType("text");
    loadDatabaseData();

    // Emulate typing target and reply simulation
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    if (activeConv) {
      const activeMembers = members.filter((m) => m.conversation_id === activeConversationId);
      const targetMember = activeMembers.find((m) => m.user_id !== currentUserId);

      if (targetMember) {
        // Simulate reading our message after 1.2 seconds
        setTimeout(() => {
          socialService.markSingleMessageAsRead(newMsg.id, targetMember.user_id);
          const listReads = socialService.getMessageReads();
          setMessageReads(listReads);
        }, 1200);

        const targetUserObj = allUsers.find((u) => u.id === targetMember.user_id);
        if (targetUserObj) {
          setIsTyping(targetUserObj.name);

          setTimeout(() => {
            setIsTyping(null);
            const simulatedReplies = [
              `Absolutely right! I will share my telebirr-cleared guidelines tomorrow.`,
              `Thanks! Let's synchronize Gheralta climbing plans.`,
              `Can you claim your daily +20 XP Spark task?`,
              `That looks perfect. I just added you as a companion.`,
              `Hello! Connecting from Awash Bank branch lobby.`,
              `I'll be starting my Ethiopian streaming cockpit in an hour, join me!`,
            ];
            const pick = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

            socialService.sendMessage(
              targetUserObj.email || "buddy@spark.regional",
              activeConversationId,
              pick,
              "text"
            );
            loadDatabaseData();
          }, 2400);
        }
      }
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    const ok = socialService.deleteMessage(msgId);
    if (ok) {
      loadDatabaseData();
    }
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    socialService.toggleMessageReaction(msgId, currentUserId, emoji);
    setShowEmojiMenuMsgId(null);
    loadDatabaseData();
  };

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatTargetName.trim()) return;

    // Search matches inside local user base
    const match = allUsers.find(
      (u) =>
        u.name.toLowerCase().includes(newChatTargetName.toLowerCase()) ||
        u.id.toLowerCase().includes(newChatTargetName.toLowerCase())
    );

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

  // Metainfo resolver helper for channels
  const getConversationMeta = (conv: Conversation) => {
    const activeMembers = members.filter((m) => m.conversation_id === conv.id);
    if (conv.isGroup) {
      return {
        id: conv.id,
        name: conv.name || "CBE Stream Group",
        avatarUrl: conv.avatarUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=100",
        desc: "Group conversation",
        isGroup: true,
      };
    } else {
      const other = activeMembers.find((m) => m.user_id !== currentUserId);
      if (other) {
        const u = allUsers.find((user) => user.id === other.user_id);
        if (u) {
          return {
            id: u.id,
            name: u.name,
            avatarUrl: u.avatarUrl,
            desc: `Level ${u.level} Guide`,
            isGroup: false,
          };
        }
      }
      return {
        id: "offline_companion",
        name: "Tourist Companion",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        desc: "Offline channel",
        isGroup: false,
      };
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const meta = getConversationMeta(c);
    const textSearch = meta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       meta.desc.toLowerCase().includes(searchQuery.toLowerCase());
    // Ensure current user is actually a member of this chat
    const mList = members.filter((m) => m.conversation_id === c.id);
    const hasMe = mList.some((m) => m.user_id === currentUserId);
    return textSearch && hasMe;
  });

  const activeConversationMessages = messages.filter((m) => m.conversation_id === activeConversationId);
  const selectedConv = conversations.find((c) => c.id === activeConversationId);
  const activeConvMeta = selectedConv ? getConversationMeta(selectedConv) : null;

  return (
    <div id="messaging-hub-widget" className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 min-h-[580px] shadow-2xl relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar: Conversation Threads Area */}
      <div className="lg:col-span-1 border-r border-zinc-900 pr-0 lg:pr-6 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>Inbox Channels</span>
              </h2>
              <span className="text-[10px] text-zinc-500 block font-mono">Real-time secure chat</span>
            </div>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-blue-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
          </div>

          {/* Search box and recent searches section */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    triggerSearchAction(searchInput);
                  }
                }}
                placeholder="Filter chats & guides (Press Enter)..."
                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl pl-9 pr-10 py-2 outline-none focus:border-blue-500 placeholder-zinc-650 font-medium"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="flex h-3.5 w-3.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
                  </span>
                </div>
              )}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[8.5px] font-bold text-zinc-650 font-mono">Recent:</span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchInput(term);
                      triggerSearchAction(term);
                    }}
                    className="px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-850 text-[9.5px] text-zinc-400 hover:text-white rounded-md font-mono"
                  >
                    {term}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("recent_searches_msg");
                    setRecentSearches([]);
                  }}
                  className="text-[8.5px] text-zinc-600 hover:text-zinc-400 underline font-mono ml-auto"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* List of active channels */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-none">
            {isSearching ? (
              // Loading Skeletons
              [1, 2, 3].map((n) => (
                <div key={n} className="p-3 bg-zinc-900/30 border border-zinc-90 w-full rounded-2xl flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-zinc-805 rounded-full bg-zinc-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                    <div className="h-2 bg-zinc-850 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const meta = getConversationMeta(conv);
                const isActive = conv.id === activeConversationId;
                const convMsgs = messages.filter((m) => m.conversation_id === conv.id);
                const lastMsg = convMsgs[convMsgs.length - 1];

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3 rounded-2xl cursor-pointer border text-left transition-all relative group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-900/20 to-zinc-900 border-blue-500/40 text-white"
                        : "bg-zinc-900/30 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={meta.avatarUrl}
                          alt={meta.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-zinc-800 text-xs shrink-0"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate text-zinc-200 group-hover:text-white transition-colors">
                            {meta.name}
                          </span>
                          {meta.isGroup && (
                            <span className="text-[7px] font-mono font-bold bg-blue-500/15 border border-blue-500/20 text-blue-400 px-1 rounded">
                              GROUP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 block truncate mt-0.5 font-medium">
                          {lastMsg ? (
                            lastMsg.is_deleted ? (
                              <span className="italic opacity-60">Deleted message</span>
                            ) : (
                              lastMsg.content
                            )
                          ) : (
                            "No messages yet"
                          )}
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-900 p-4">
                <AlertCircle className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-500 font-semibold italic">No matched channels found</p>
                <p className="text-[10px] text-zinc-600 mt-1">Start a new 1-to-1 conversation using the compose button.</p>
              </div>
            )}
          </div>
        </div>

        {/* Informative block */}
        <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-2xl text-[10px] text-zinc-500 leading-relaxed font-medium">
          <p className="text-blue-400 font-semibold uppercase tracking-wider text-[8.5px] mb-0.5">🔒 REGIONAL SECURITY STANDARD</p>
          Messages here are device-bound & audit verified to promote helpful tourist assistance within legal zones of Lalibela, Gheralta, Axum.
        </div>
      </div>

      {/* Main Conversation details slot */}
      <div className="lg:col-span-2 flex flex-col justify-between min-h-[500px] h-full space-y-4">
        {activeConvMeta ? (
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Thread Header info bar */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative cursor-pointer" onClick={() => !activeConvMeta.isGroup && onOpenProfile(activeConvMeta.id)}>
                  <img
                    src={activeConvMeta.avatarUrl}
                    alt={activeConvMeta.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-zinc-800 text-xs"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h3
                    onClick={() => !activeConvMeta.isGroup && onOpenProfile(activeConvMeta.id)}
                    className="text-xs font-black text-white hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{activeConvMeta.name}</span>
                    {!activeConvMeta.isGroup && (
                      <span className="text-[8px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded font-bold">
                        ACTIVE COMPANION
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-zinc-500 block font-mono mt-0.5">{activeConvMeta.desc}</span>
                </div>
              </div>

              {/* Conversation control header action */}
              <button
                onClick={() => {
                  if (confirm("Permanently archive this conversation history? All state variables will clear.")) {
                    const remaining = conversations.filter((c) => c.id !== activeConversationId);
                    setConversations(remaining);
                    if (remaining.length > 0) setActiveConversationId(remaining[0].id);
                    loadDatabaseData();
                  }
                }}
                className="p-2 bg-rose-950/10 hover:bg-rose-950/20 text-rose-500 hover:text-rose-400 border border-zinc-900 hover:border-rose-900/30 rounded-xl transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Channel</span>
              </button>
            </div>

            {/* Conversation list area */}
            <div className="flex-1 overflow-y-auto space-y-4 my-4 max-h-[360px] pr-1 scrollbar-none text-left">
              {activeConversationMessages.length > 0 ? (
                activeConversationMessages.map((m) => {
                  const isMe = m.sender_id === currentUserId;
                  const senderUser = allUsers.find((u) => u.id === m.sender_id);

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col relative group ${isMe ? "items-end text-right" : "items-start text-left"}`}
                    >
                      <div className="flex items-start gap-2.5 max-w-[85%]">
                        {!isMe && (
                          <img
                            src={senderUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0 text-[10px] mt-0.5 cursor-pointer"
                            onClick={() => senderUser && onOpenProfile(senderUser.id)}
                          />
                        )}
                        <div>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed transition-all relative ${
                              isMe
                                ? "bg-blue-600 text-white font-medium rounded-tr-none shadow-md shadow-blue-600/10"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                            } ${m.is_deleted ? "italic text-zinc-500 opacity-60 bg-zinc-920" : ""}`}
                          >
                            <span className="text-[7.5px] font-mono block opacity-60 mb-1 font-extrabold uppercase tracking-tight">
                              {isMe ? "You" : senderUser?.name || "Member"}
                            </span>

                            {/* Render different message attachment scenarios */}
                            {m.message_type === "image" && m.media_url && !m.is_deleted && (
                              <div className="mb-2 rounded-xl overflow-hidden border border-zinc-800">
                                <img src={m.media_url} alt="Attachment" className="max-w-full h-auto object-cover max-h-[160px] cursor-pointer" />
                              </div>
                            )}

                            {m.message_type === "voice" && !m.is_deleted && (
                              <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl mb-1.5 border border-zinc-800">
                                <Mic className="w-4 h-4 text-amber-500 fill-current animate-pulse shrink-0" />
                                <div className="text-[10px] font-mono tracking-tight text-zinc-300">Voice Note Clip (0:12) Played</div>
                              </div>
                            )}

                            {m.message_type === "file" && !m.is_deleted && (
                              <div className="flex items-center gap-2.5 bg-zinc-950 p-2 px-3 rounded-xl mb-1.5 border border-zinc-850">
                                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                <div className="font-mono text-[9px] underline text-blue-300 font-bold tracking-tight">TouristGuideBooklet.pdf</div>
                              </div>
                            )}

                            <div>{m.content}</div>

                            {/* Reaction badges */}
                            {m.reactions && m.reactions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {m.reactions.map((react, i) => (
                                  <span key={i} className="text-[9px] bg-black/50 border border-zinc-800 px-1.5 py-0.5 rounded-md">
                                    {react.emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Options and indicators footer below the cloud */}
                          {!m.is_deleted && (
                            <div className="flex items-center gap-2 py-1 px-1 flex-wrap justify-start">
                              <span className="text-[7.5px] text-zinc-500 font-mono font-bold">
                                {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>

                              {/* Message receipts status indication */}
                              {isMe ? (
                                messageReads.some((r) => r.message_id === m.id && r.user_id !== currentUserId) ? (
                                  <span className="text-blue-400 font-mono text-[7.5px] font-bold flex items-center gap-0.5" title="Read by recipient">
                                    Read <CheckCheck className="w-3" />
                                  </span>
                                ) : (
                                  <span className="text-zinc-500 font-mono text-[7.5px] font-medium flex items-center gap-0.5" title="Delivered to recipient">
                                    Sent <Check className="w-3" />
                                  </span>
                                )
                              ) : (
                                <span className="text-zinc-400 font-mono text-[7.5px] font-medium flex items-center gap-0.5">
                                  Seen <CheckCheck className="w-3 text-emerald-500" />
                                </span>
                              )}

                              {/* Message reaction menu drawer toggle */}
                              <button
                                onClick={() => setShowEmojiMenuMsgId(showEmojiMenuMsgId === m.id ? null : m.id)}
                                className="text-[8px] font-bold text-zinc-500 hover:text-white cursor-pointer select-none"
                              >
                                React 👍
                              </button>

                              {/* Message removal triggers */}
                              {isMe && (
                                <button
                                  onClick={() => handleDeleteMessage(m.id)}
                                  className="text-[8px] font-bold text-rose-500 hover:text-rose-400 cursor-pointer"
                                >
                                  Recall
                                </button>
                              )}

                              {/* Emoji picker menu */}
                              {showEmojiMenuMsgId === m.id && (
                                <div className="bg-zinc-950 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-2xl absolute z-30 animate-bounce">
                                  {["👍", "❤️", "🔥", "☕", "🦁", "🇪🇹", "👏"].map((emoji) => (
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
                })
              ) : (
                <div className="py-20 text-center rounded-2xl border border-dashed border-zinc-900">
                  <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs text-zinc-400 italic">No chat correspondence here yet</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Write your compliance inquires below (+1 XP payload award).</p>
                </div>
              )}

              {/* Typing feedback view */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                    💬
                  </div>
                  <div className="bg-zinc-900 p-2.5 px-3 border border-zinc-850 rounded-2xl rounded-tl-none flex items-center gap-2 shadow">
                    <span className="text-[9px] font-bold text-zinc-400 font-mono">{isTyping} is formulation reply</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" />
                      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce delay-100" />
                      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce delay-200" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* SEND MESSAGE FORM WITH THE CUSTOM ATTACHMENTS SELECTOR */}
            <form onSubmit={handleSendPrivateMessage} className="space-y-2 border-t border-zinc-900 pt-3">
              {/* Attachment configuration strip */}
              {attachmentType !== "text" && (
                <div className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    {attachmentType === "image" && <Image className="w-4 h-4 text-blue-400 shrink-0" />}
                    {attachmentType === "voice" && <Mic className="w-4 h-4 text-amber-500 shrink-0" />}
                    {attachmentType === "file" && <FileText className="w-4 h-4 text-purple-400 shrink-0" />}
                    <span className="text-zinc-300 font-mono font-medium">
                      {attachmentType === "image" ? "Mona_Laisa_Rock_Church.jpg" : attachmentType === "voice" ? "Microphone record clip simulation" : "ZonePermitClearance.pdf"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("text");
                      setAttachmentUrl("");
                    }}
                    className="p-1 hover:bg-zinc-800 text-zinc-450 hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Micro attachment panel toggles */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("image");
                      setAttachmentUrl("https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=600");
                    }}
                    title="Send Simulated Image file"
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      attachmentType === "image" ? "bg-blue-600 text-white border-transparent" : "bg-zinc-900/50 hover:bg-zinc-850 text-zinc-400 hover:text-white border-zinc-800"
                    }`}
                  >
                    <Image className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("voice");
                      setAttachmentUrl("voice-clip-url");
                    }}
                    title="Synthesizer Voice Note simulation"
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      attachmentType === "voice" ? "bg-amber-500 text-slate-950 border-transparent" : "bg-zinc-900/50 hover:bg-zinc-850 text-zinc-400 hover:text-white border-zinc-800"
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("file");
                      setAttachmentUrl("regulatory-doc-url");
                    }}
                    title="Attach Compliance PDF Permit file"
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      attachmentType === "file" ? "bg-purple-600 text-white border-transparent" : "bg-zinc-900/50 hover:bg-zinc-850 text-zinc-400 hover:text-white border-zinc-800"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                {/* Input block */}
                <div className="flex-1 relative flex gap-2">
                  <input
                    type="text"
                    value={privateMessageText}
                    onChange={(e) => setPrivateMessageText(e.target.value)}
                    placeholder="Enter message content..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-blue-500 text-xs text-white rounded-xl px-4 py-3 outline-none placeholder-zinc-600 font-semibold"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-505 border border-dashed border-zinc-900 rounded-3xl bg-zinc-900/10 py-16">
            <MessageSquare className="w-12 h-12 text-zinc-700 mb-3 animate-pulse" />
            <h3 className="text-sm font-bold text-white mb-1">Select Inbox Thread</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              Click any of the matched inbox channels on the left, or compose a new thread to communicate with active tour guides or regional explorers.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: COMPOSE NEW CHAT DIALOG OVERLAY */}
      {showNewChatModal && (
        <div id="new-chat-compose-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative text-left"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-500" />
                <span>Initialize Custom Chat</span>
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 px-2 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewChat} className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-2">Search Guide / Tourist by ID or Name</label>
                <input
                  type="text"
                  value={newChatTargetName}
                  onChange={(e) => setNewChatTargetName(e.target.value)}
                  placeholder="e.g. Helen, Lalibela, sintayehu"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-3 text-xs text-white placeholder-zinc-700 outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2.5 bg-zinc-950/40 p-3 border border-zinc-850 rounded-2xl">
                <input
                  type="checkbox"
                  id="group-check-compose"
                  checked={newChatIsGroup}
                  onChange={(e) => setNewChatIsGroup(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-800 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="group-check-compose" className="text-xs text-zinc-400 font-bold cursor-pointer select-none">
                  Set up compliant Group Stream channel
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer uppercase font-mono"
                >
                  Create Chat Channel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
