import React, { useState, useEffect } from "react";
import {
  Mic,
  Video,
  Flame,
  Award,
  Shield,
  Coins,
  Gem,
  Sparkles,
  Users,
  UserPlus,
  Play,
  Heart,
  Share2,
  Lock,
  Radio,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Plus,
  Compass,
  Check,
  UserCheck,
  X,
  Volume2,
  Trash2,
  Tv,
  Smartphone,
  ShieldAlert,
  MapPin,
  ArrowRight,
  Gift,
  MessageSquare
} from "lucide-react";
import { UserStats } from "../types";
import { socialService } from "../socialStore";

interface MelaEcosystemProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  lang: string;
  sessionEmail: string;
}

export default function MelaEcosystemExt({ stats, onUpdateStats, lang, sessionEmail }: MelaEcosystemProps) {
  // Current tab within Mela Ecosystem expansion: voice_rooms, short_videos, agency_system, security_guard, vip_member, referrals
  const [ecoTab, setEcoTab] = useState<"voice_rooms" | "short_videos" | "agency_system" | "security_guard" | "vip_member" | "referrals">("referrals");

  // 1. Voice Rooms States
  const [roomType, setRoomType] = useState<"Public" | "Private" | "Password">("Public");
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedEffect, setSelectedEffect] = useState<string>("Studio Studio Reverb 🟢");
  const [isLuckyDrawRunning, setIsLuckyDrawRunning] = useState(false);
  const [luckyDrawWinner, setLuckyDrawWinner] = useState<string | null>(null);
  const [activeMics, setActiveMics] = useState<Record<number, string>>({
    0: "Host (You)",
    1: "Abebe (VIP Golden)",
    2: "Nadia (Creator Star)",
    3: "Mic Seat vacant",
    4: "Saba (Junior Host)",
    5: "Mic Seat vacant",
    6: "Mic Seat vacant",
    7: "Mic Seat vacant",
  });
  const [voiceMessages, setVoiceMessages] = useState<string[]>([
    "System 🔒 Welcome to Mela Audio Lounge #EastAfrica!",
    "Abebe joined seat #1.",
    "Nadia sent a Lavender Gift to Host."
  ]);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(0);

  // 2. Short Video States
  const [shortVideosList, setShortVideosList] = useState([
    {
      id: 1,
      title: "Discover Lalibela Hidden Passageways ⛪",
      creator: "@EthioMezgebu",
      avatar: "KH",
      music: "Tilahun Gessesse - Classic Amharic folk (Lofi remix)",
      likes: 1243,
      comments: 65,
      shares: 310,
      isLiked: false,
    },
    {
      id: 2,
      title: "Teff Harvesting in the fertile fields of Gojjam 🌾",
      creator: "@DestaAgritech",
      avatar: "DG",
      music: "Traditional Masinqo - Instrumental Melodies",
      likes: 832,
      comments: 42,
      shares: 112,
      isLiked: false,
    },
    {
      id: 3,
      title: "Swahili Coast Swell & Dhow Boat Racing ⛵",
      creator: "@SalimOceanic",
      avatar: "SO",
      music: "Diamond Platnumz - Swahili Kizomba 2026",
      likes: 1945,
      comments: 110,
      shares: 450,
      isLiked: false,
    },
  ]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftMusic, setDraftMusic] = useState("Afaan Oromo Modern Pop Mix");
  const [localDrafts, setLocalDrafts] = useState<{ title: string; music: string; timestamp: string }[]>([
    { title: "Bale Mountains Hiking Video draft.mov", music: "Oromo Cultural Flute", timestamp: "Just now" }
  ]);

  // 3. Agency & Referral States
  const [agencyLevel, setAgencyLevel] = useState(2); // Level 2 agency
  const [recruits, setRecruits] = useState([
    { id: 1, name: "Helen Solomon", level: "Creator", status: "Pending approval", diamonds: 2450 },
    { id: 2, name: "Yonas Melaku", level: "Basic", status: "Awaiting phone verification", diamonds: 0 },
    { id: 3, name: "Kidist Girma", level: "Verified Host", status: "Active Contracted", diamonds: 15400 },
  ]);
  const [newRecruitName, setNewRecruitName] = useState("");
  const [referralCode, setReferralCode] = useState("MELA-AFRI-7729");
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [referralHistory, setReferralHistory] = useState([
    { name: "Almaz Kebede", level: "Bronze Referrer", date: "2026-06-05", status: "Verified - 5,000 Coins Paid" },
    { name: "Suleiman Yusuf", level: "Bronze Referrer", date: "2026-06-04", status: "Awaiting verification" },
  ]);
  const [isReferralRegistering, setIsReferralRegistering] = useState(false);
  const [invitedFriendPhone, setInvitedFriendPhone] = useState("");

  // ==================== PREMIUM REFERRALS REAL-TIME TRACKER STATE ====================
  const [referrals, setReferrals] = useState([
    { id: 1, name: "Biniam Tekle", phone: "+251 905 123456", date: "2026-06-06", linkOpened: true, registered: true, verified: true, bonusPaid: true, payoutAmount: 5000 },
    { id: 2, name: "Saron Berhe", phone: "+251 911 987654", date: "2026-06-06", linkOpened: true, registered: true, verified: false, bonusPaid: false, payoutAmount: 5000 },
    { id: 3, name: "Desta Alula", phone: "+254 701 445566", date: "2026-06-05", linkOpened: true, registered: false, verified: false, bonusPaid: false, payoutAmount: 5000 },
    { id: 4, name: "Khadija Omar", phone: "+251 922 411223", date: "2026-06-04", linkOpened: false, registered: false, verified: false, bonusPaid: false, payoutAmount: 5000 },
  ]);
  const [referralCodeInput, setReferralCodeInput] = useState("MELA-AFRI-7729");
  const [shareChannel, setShareChannel] = useState<"Telegram" | "WhatsApp" | "SMS" | "Direct Link">("Telegram");
  const [simName, setSimName] = useState("");
  const [simPhone, setSimPhone] = useState("");
  const [milestoneClaimed, setMilestoneClaimed] = useState(false);
  const [referralLogs, setReferralLogs] = useState<string[]>([
    "System ⚙️ Referral engine bootstrapped with secure device-bound link verification.",
    "Biniam Tekle has successfully completed Identity check. +5,000 Coins transferred to premium wallet."
  ]);

  // Advance tracking stage for a selected friend
  const handleAdvanceStage = (id: number, stageAction: "link" | "register" | "verify") => {
    setReferrals((prev) =>
      prev.map((ref) => {
        if (ref.id !== id) return ref;
        
        let linkOpened = ref.linkOpened;
        let registered = ref.registered;
        let verified = ref.verified;
        let bonusPaid = ref.bonusPaid;

        if (stageAction === "link") {
          linkOpened = true;
          setReferralLogs((p) => [
            `📡 Sim Link Click: ${ref.name} (${ref.phone}) clicked unique invitation link. Tracking session initiated.`,
            ...p,
          ]);
        } else if (stageAction === "register") {
          linkOpened = true;
          registered = true;
          setReferralLogs((p) => [
            `📲 Sim Registration: ${ref.name} registered account and completed phone OTP verification successfully.`,
            ...p,
          ]);
        } else if (stageAction === "verify") {
          linkOpened = true;
          registered = true;
          verified = true;
          
          if (!bonusPaid) {
            bonusPaid = true;
            // Reward: Add 5,000 Coins instantly
            onUpdateStats({
              ...stats,
              coins: stats.coins + 5000,
            });
            // Grant some XP too!
            setStatsXp(40);
            
            setReferralLogs((p) => [
              `🎉 Payout Transferred: Verified! +5,000 Coins credited to your virtual wallet for inviting ${ref.name}!`,
              `🛡️ Compliance Check: ${ref.name}'s national identity matching check passed seamlessly.`,
              ...p,
            ]);
          }
        }

        return {
          ...ref,
          linkOpened,
          registered,
          verified,
          bonusPaid,
        };
      })
    );
  };

  // Add simulated referral to inspect first-hand tracking
  const handleCreateSimulatedReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName.trim() || !simPhone.trim()) {
      alert("Please provide both a name and mobile number to simulate fresh tracker registration.");
      return;
    }
    
    const newRef = {
      id: referrals.length + 1,
      name: simName,
      phone: simPhone,
      date: new Date().toISOString().split("T")[0],
      linkOpened: false,
      registered: false,
      verified: false,
      bonusPaid: false,
      payoutAmount: 5000,
    };
    
    setReferrals((prev) => [newRef, ...prev]);
    setReferralLogs((p) => [
      `🆕 Referral Created: Created simulation slot for proposed invite of ${simName}. Use the pipeline actions to click link, register, or verify!`,
      ...p,
    ]);
    setSimName("");
    setSimPhone("");
  };

  // Custom referral code updater
  const handleUpdateReferralCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCodeInput.trim() || referralCodeInput.length < 4) {
      alert("Referral code must have at least 4 alpha-numeric characters!");
      return;
    }
    const cleanCode = referralCodeInput.trim().toUpperCase().replace(/\s+/g, "-");
    setReferralCode(cleanCode);
    setReferralCodeInput(cleanCode);
    setReferralLogs((p) => [
      `🔐 Settings modified: Custom invite code updated to "${cleanCode}". Universal links refreshed!`,
      ...p,
    ]);
    alert(`🎉 Custom referral code successfully updated to: ${cleanCode}`);
  };

  // Claim milestones bonus
  const handleClaimMilestoneBonus = () => {
    const verifiedCount = referrals.filter((r) => r.verified).length;
    if (verifiedCount < 3) {
      alert("You need at least 3 fully verified referrals to claim this landmark bonus!");
      return;
    }
    if (milestoneClaimed) {
      alert("You have already claimed this Milestone Box!");
      return;
    }
    onUpdateStats({
      ...stats,
      coins: stats.coins + 15000,
    });
    setMilestoneClaimed(true);
    setReferralLogs((p) => [
      `🎁 Landmark Milestone Claimed: Received +15,000 Coins bonus chest for achieving 3+ verified referrals!`,
      ...p,
    ]);
    alert("🏆 Milestone bonus box claimed! 15,000 Coins added to your virtual balance.");
  };

  // 4. Security System & Fraud Center (Anti-Fraud)
  const [multipleAccountAlert, setMultipleAccountAlert] = useState(false);
  const [emulatorActiveCheck, setEmulatorActiveCheck] = useState(false);
  const [vpnUsageStatus, setVpnUsageStatus] = useState("CLEAN 🟢 No anomalous proxy patterns detected.");
  const [suspendLogs, setSuspendLogs] = useState([
    { id: 1, target: "User ID 248903", violation: "VPN Cloaking & Multi-Account login", action: "30-Day Device ID Suspended", time: "18 mins ago" },
    { id: 2, target: "EmulHost_99", violation: "Android Emulator spoofing layout", action: "Permanent Account Baned", time: "1 hour ago" },
  ]);
  const [userReportTarget, setUserReportTarget] = useState("");
  const [userReportReason, setUserReportReason] = useState("");

  // Speech simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking((prev) => {
        if (prev === null) return Math.floor(Math.random() * 5);
        return null;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleTriggerInvite = () => {
    if (!invitedFriendPhone.trim()) return;
    setReferralHistory((prev) => [
      { name: `Friend (${invitedFriendPhone})`, level: "Bronze Referrer", date: "2026-06-06", status: "Verified - 5,000 Coins Paid" },
      ...prev
    ]);
    onUpdateStats({ ...stats, coins: stats.coins + 5000 });
    setInvitedFriendPhone("");
    alert("🎉 Referral process succeeded! Interactive simulation rewards +5,000 coins to your Virtual Economy Balance!");
  };

  const handleVoiceRoomGift = (giftPrice: number, giftName: string) => {
    if (stats.coins < giftPrice) {
      alert(`Insufficient coins to purchase and send the ${giftName} gift! Require ${giftPrice} coins.`);
      return;
    }
    const leftCoins = stats.coins - giftPrice;
    onUpdateStats({ ...stats, coins: leftCoins });
    setVoiceMessages((prev) => [
      ...prev,
      `You sent ${giftName} (Bought with ${giftPrice.toLocaleString()} coins) 🎁 +10 XP gained!`
    ]);
    setStatsXp(10);
  };

  const setStatsXp = (xpReward: number) => {
    const nextLimit = stats.nextLevelXp;
    let currentXp = stats.xp + xpReward;
    let currentLevel = stats.level;
    if (currentXp >= nextLimit) {
      currentXp = currentXp - nextLimit;
      currentLevel += 1;
    }
    onUpdateStats({
      ...stats,
      level: currentLevel,
      xp: currentXp,
      nextLevelXp: Math.floor(100 * Math.pow(currentLevel, 1.5)),
    });
  };

  const handleApplyGiftShortVideo = () => {
    if (stats.coins < 500) {
      alert("Requires 500 Coins to send visual flower gift!");
      return;
    }
    onUpdateStats({ ...stats, coins: stats.coins - 500 });
    const updated = [...shortVideosList];
    updated[activeVideoIndex].likes += 1;
    setShortVideosList(updated);
    alert("🌹 Visual Flower Gift applied to host creator. Your virtual balance has been updated.");
  };

  const handleSaveVideoDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;
    setLocalDrafts((prev) => [
      { title: draftTitle, music: draftMusic, timestamp: "Just now" },
      ...prev,
    ]);
    setDraftTitle("");
    alert("📁 Draft file locally persistent! It is ready in your offline media pool.");
  };

  const handleLuckyDraw = () => {
    setIsLuckyDrawRunning(true);
    setLuckyDrawWinner(null);
    setTimeout(() => {
      const candidates = ["Abebe (VIP Golden)", "Nadia (Creator Star)", "Saba (Junior Host)", "You (Host)"];
      const randomWinner = candidates[Math.floor(Math.random() * candidates.length)];
      setLuckyDrawWinner(randomWinner);
      setIsLuckyDrawRunning(false);
      setVoiceMessages((prev) => [
        ...prev,
        `🎉 Lucky Draw Winner is ${randomWinner}! Claiming 1,500 Coin Jackpot!`
      ]);
    }, 2000);
  };

  const handleApproveRecruit = (id: number) => {
    setRecruits((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: "Active Contracted" } : rec))
    );
  };

  const handleRejectRecruit = (id: number) => {
    setRecruits((prev) => prev.filter((rec) => rec.id !== id));
  };

  const checkMultipleAccountAbuse = () => {
    setMultipleAccountAlert(true);
    setTimeout(() => {
      setMultipleAccountAlert(false);
      alert("🚨 Anti-Fraud Guard Scan complete. Spoof accounts & VPN multi-login checks processed cleanly.");
    }, 2500);
  };

  const handleBuyVip = () => {
    if (stats.coins < 100000) {
      alert("You need at least 100,000 Coins in your Virtual Economy balance to subscribe for VIP days.");
      return;
    }
    onUpdateStats({ ...stats, coins: stats.coins - 100000 });
    alert("👑 VIP Membership activated successfully! Welcome to priority routing tiers.");
  };

  return (
    <div className="w-full bg-zinc-950 text-left border border-zinc-850 rounded-3xl p-6 shadow-xl relative overflow-hidden" id="mela-live-ecosystem">
      {/* Absolute Decorative Aura background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />

      {/* Top Banner introducing MELA LIVE */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-zinc-850 pb-5 mb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-mono tracking-widest">
              Pan-African Ecosystem
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono tracking-widest">
              Investor Ready v4
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            MELA LIVE <span className="text-zinc-500 text-xs font-normal font-mono">(Formerly Ethio-Spark)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            The ultimate social entertainment destination designed for localized monetization, live broadcasting battles, audio lounges, TikTok-style short videos, and an agency system.
          </p>
        </div>

        {/* Global Mini Balance bar */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-2xl">
          <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-3">
            <Coins className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-zinc-500 block leading-none font-bold uppercase">Coins</span>
              <span className="text-xs font-black text-amber-400 font-mono">{stats.coins.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-[10px] text-zinc-500 block leading-none font-bold uppercase">Level</span>
              <span className="text-xs font-black text-white font-mono">{stats.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Segment Selectors Nav Rail */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-none border-b border-zinc-900 mb-6">
        <button
          onClick={() => setEcoTab("voice_rooms")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            ecoTab === "voice_rooms"
              ? "bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/10"
              : "bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white"
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          Voice Party Rooms
        </button>

        <button
          onClick={() => setEcoTab("short_videos")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            ecoTab === "short_videos"
              ? "bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/10"
              : "bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white"
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          Short Video platform (TikTok)
        </button>

        <button
          onClick={() => setEcoTab("agency_system")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            ecoTab === "agency_system"
              ? "bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/10"
              : "bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Host Agency Portal
        </button>

        <button
          onClick={() => setEcoTab("referrals")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            ecoTab === "referrals"
              ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/10"
              : "bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white"
          }`}
        >
          <UserPlus className="w-3.5 h-3.5 animate-pulse" />
          Referral Tracker 🌟
        </button>

        <button
          onClick={() => setEcoTab("vip_member")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            ecoTab === "vip_member"
              ? "bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/10"
              : "bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          VIP Clubhouse
        </button>

        <button
          onClick={() => setEcoTab("security_guard")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            ecoTab === "security_guard"
              ? "bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/10"
              : "bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Anti-Fraud Security System
        </button>
      </div>

      {/* Module Component Rendering Slot */}
      <div className="animate-fade-in text-xs min-h-[460px]">
        {/* ================= 1. VOICE PARTY ROOMS ================= */}
        {ecoTab === "voice_rooms" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Active Mic Room */}
            <div className="lg:col-span-8 bg-zinc-900/50 border border-zinc-850 rounded-2xl p-5 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  <span className="font-extrabold text-white text-sm">Room Chat Room: Habesha Stars Live Class</span>
                </div>
                <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800 text-[10px]">
                  <span className="text-zinc-500 font-bold">Room Class Type:</span>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="bg-transparent text-white outline-none cursor-pointer border-none font-bold"
                  >
                    <option value="Public" className="bg-zinc-900">🔓 Public</option>
                    <option value="Private" className="bg-zinc-900">🔒 Private</option>
                    <option value="Password" className="bg-zinc-900 font-mono">🔑 Password Room</option>
                  </select>
                </div>
              </div>

              {/* Password prompt if password selected */}
              {roomType === "Password" && (
                <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl mb-4 flex items-center justify-between">
                  <span className="text-[10px] text-amber-500 font-bold block">Password Protection Verified required for guests:</span>
                  <input
                    type="password"
                    placeholder="Set lobby code..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="p-1 px-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-emerald-400 font-mono text-[11px] w-28 text-center outline-none"
                  />
                </div>
              )}

              {/* 8 Mic Seat positions visualizer */}
              <div className="grid grid-cols-4 gap-3 py-4">
                {Object.entries(activeMics).map(([seatId, name]) => {
                  const sId = parseInt(seatId);
                  const isSeatSpeaking = isSpeaking === sId;
                  const isVacant = (name as string).includes("vacant");
                  return (
                    <div
                      key={seatId}
                      className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isSeatSpeaking
                          ? "bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-600/5 scale-102"
                          : isVacant
                          ? "bg-zinc-950 border-zinc-900 text-zinc-650 opacity-60"
                          : "bg-zinc-950 border-zinc-800 text-zinc-300"
                      }`}
                    >
                      <div className="relative">
                        <div className={`w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center border ${
                          isSeatSpeaking ? "border-indigo-500" : "border-zinc-800"
                        }`}>
                          <Mic className={`w-4 h-4 ${isSeatSpeaking ? "text-indigo-400" : "text-zinc-500"}`} />
                        </div>
                        {/* Audio Waves graphic */}
                        {isSeatSpeaking && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold mt-2 truncate max-w-full font-mono">{name}</span>
                      <span className="text-[8px] text-zinc-500 font-mono mt-0.5">Seat #{sId + 1}</span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Virtual Gifts Center inside voice rooms */}
              <div className="border-t border-zinc-850 pt-4 mt-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">🎁 Virtual Audio Gift Drawer</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleVoiceRoomGift(100, "Rose Garland")}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="text-zinc-200 block text-[11px] font-bold">🌹 Rose Flower</span>
                      <span className="text-[10px] text-amber-500 font-mono">100 Coins</span>
                    </div>
                    <Gift className="w-4 h-4 text-rose-500" />
                  </button>
                  <button
                    onClick={() => handleVoiceRoomGift(500, "Traditional Masinqo")}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="text-zinc-200 block text-[11px] font-bold">🎻 Masinqo Track</span>
                      <span className="text-[10px] text-amber-500 font-mono">500 Coins</span>
                    </div>
                    <Gift className="w-4 h-4 text-purple-400" />
                  </button>
                  <button
                    onClick={() => handleVoiceRoomGift(2000, "Coffee Ceremony Aura")}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="text-zinc-200 block text-[11px] font-bold">☕ Ethiopian Buna</span>
                      <span className="text-[10px] text-amber-500 font-mono">2,000 Coins</span>
                    </div>
                    <Gift className="w-4 h-4 text-amber-500" />
                  </button>
                  <button
                    onClick={() => handleVoiceRoomGift(15000, "Kingdom of Lalibela Crown")}
                    className="p-2.5 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-800/40 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="text-purple-300 block text-[11px] font-black">👑 Imperial Crown</span>
                      <span className="text-[10px] text-amber-500 font-mono">15,000 Coins</span>
                    </div>
                    <Gift className="w-4 h-4 text-yellow-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Box: Chat Logs & Voice Effects Simulator */}
            <div className="lg:col-span-4 space-y-4">
              {/* Board message stream */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 flex flex-col h-60">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Live Room Signals</span>
                <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none text-[11px] text-zinc-300">
                  {voiceMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded-lg ${
                        msg.includes("Welcome")
                          ? "bg-indigo-950/30 text-indigo-400 border border-indigo-900/45 font-semibold"
                          : msg.includes("Jackpot") || msg.includes("sent")
                          ? "bg-amber-950/20 text-amber-400 border border-amber-900/45 text-[10.5px] font-extrabold"
                          : "bg-zinc-950/50"
                      }`}
                    >
                      {msg}
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls and Sound Effects */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">🎙️ Real-time Sound Voice FX Tones</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["Studio Studio Reverb 🟢", "Low Bass Echo 🔊", "Cartoon Chipmunk 🐿️", "AI Vocoder Robot 🤖"].map((fx) => (
                      <button
                        key={fx}
                        onClick={() => setSelectedEffect(fx)}
                        className={`p-1.5 rounded-lg text-left text-[10px] truncate transition-all cursor-pointer ${
                          selectedEffect === fx
                            ? "bg-indigo-600 font-bold text-white"
                            : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400"
                        }`}
                      >
                        {fx.split(" ")[1] || fx}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-850 pt-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">🎟️ Lobby Activity (Jackpot Draw)</span>
                  <button
                    onClick={handleLuckyDraw}
                    disabled={isLuckyDrawRunning}
                    className="w-full py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    {isLuckyDrawRunning ? "Spining Lobby..." : "Trigger 1,500 Coin Lucky Draw"}
                  </button>
                  {luckyDrawWinner && (
                    <div className="mt-2 text-center text-xs text-amber-400 font-black animate-pulse">
                      🏆 WINNER: {luckyDrawWinner}!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. SHORT VIDEO PLATFORM ================= */}
        {ecoTab === "short_videos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4">
            {/* Left: Swipable TikTok style Phone mockup */}
            <div className="lg:col-span-5 bg-black border border-zinc-850 rounded-3xl p-4 flex flex-col items-center justify-center relative min-h-[500px]">
              {/* Dynamic simulated phone viewport */}
              <div className="w-full max-w-[280px] h-[460px] bg-zinc-900 rounded-[28px] border-4 border-zinc-800 relative overflow-hidden flex flex-col justify-between p-3 flex-shrink-0 text-white shadow-2xl">
                {/* Visual Camera Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-full z-20" />

                {/* Subtitle / Top feeds toggle */}
                <div className="flex justify-center gap-3 text-[10.5px] font-black tracking-wide z-10 pt-1 mt-1">
                  <span className="opacity-60 cursor-pointer">Following</span>
                  <span className="border-b-2 border-amber-500 pb-0.5 cursor-pointer">Live Mela Shorts</span>
                </div>

                {/* Video Backdrop visual details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/40 to-black/80 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2.5 animate-pulse">
                      <Play className="w-6 h-6 text-indigo-400 fill-indigo-400" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase block">Streaming Audio Content Track</span>
                    <span className="text-xs font-bold text-amber-500 mt-1 block">{shortVideosList[activeVideoIndex].music}</span>
                  </div>
                </div>

                {/* Right side interaction buttons */}
                <div className="absolute right-2.5 bottom-24 flex flex-col gap-4 items-center z-10">
                  <div className="text-center">
                    <button
                      onClick={() => {
                        const updated = [...shortVideosList];
                        updated[activeVideoIndex].likes += updated[activeVideoIndex].isLiked ? -1 : 1;
                        updated[activeVideoIndex].isLiked = !updated[activeVideoIndex].isLiked;
                        setShortVideosList(updated);
                      }}
                      className="w-9 h-9 rounded-full bg-black/60 border border-zinc-850 flex items-center justify-center text-white"
                    >
                      <Heart className={`w-4 h-4 ${shortVideosList[activeVideoIndex].isLiked ? "text-rose-500 fill-rose-500" : "text-white"}`} />
                    </button>
                    <span className="text-[9.5px] font-bold font-mono text-zinc-300 block mt-1">{shortVideosList[activeVideoIndex].likes}</span>
                  </div>

                  <div className="text-center">
                    <button className="w-9 h-9 rounded-full bg-black/60 border border-zinc-850 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-[9.5px] font-bold font-mono text-zinc-300 block mt-1">{shortVideosList[activeVideoIndex].comments}</span>
                  </div>

                  <div className="text-center">
                    <button className="w-9 h-9 rounded-full bg-black/60 border border-zinc-850 flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-[9.5px] font-bold font-mono text-zinc-300 block mt-1">{shortVideosList[activeVideoIndex].shares}</span>
                  </div>

                  {/* Virtual economy shortcut */}
                  <div className="text-center">
                    <button
                      onClick={handleApplyGiftShortVideo}
                      className="w-9 h-9 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold"
                      title="Send Rose Gift (500 Coins)"
                    >
                      <Gift className="w-4 h-4" />
                    </button>
                    <span className="text-[8px] font-mono text-amber-500 block mt-0.5">Gift Host</span>
                  </div>
                </div>

                {/* Left side text overlays */}
                <div className="z-10 text-left space-y-0.5 max-w-[190px] self-end pb-3 pl-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                      {shortVideosList[activeVideoIndex].avatar}
                    </div>
                    <span className="text-[11px] font-bold text-white">{shortVideosList[activeVideoIndex].creator}</span>
                  </div>
                  <p className="text-[10px] text-zinc-200 line-clamp-2 leading-relaxed">{shortVideosList[activeVideoIndex].title}</p>
                </div>
              </div>

              {/* Navigation toggle to slide videos */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  disabled={activeVideoIndex === 0}
                  onClick={() => setActiveVideoIndex((p) => p - 1)}
                  className="px-3 py-1 bg-zinc-900 border border-zinc-800 disabled:opacity-30 rounded-lg text-[10px] font-bold"
                >
                  ◀ Back
                </button>
                <span className="text-[11px] text-zinc-400 font-mono">Reel {activeVideoIndex + 1}/{shortVideosList.length}</span>
                <button
                  disabled={activeVideoIndex === shortVideosList.length - 1}
                  onClick={() => setActiveVideoIndex((p) => p + 1)}
                  className="px-3 py-1 bg-zinc-900 border border-zinc-800 disabled:opacity-30 rounded-lg text-[10px] font-bold"
                >
                  Next ▶
                </button>
              </div>
            </div>

            {/* Right: Upload short video drafts and local resources */}
            <div className="lg:col-span-7 space-y-6">
              {/* Creator upload card */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  Stitch or Upload Creative Reels
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                  Stitch cultural highlights, tourist expeditions, or duet classic live PK wins. High viewer counts unlock daily coin multipliers!
                </p>

                <form onSubmit={handleSaveVideoDraft} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Reel Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Traditional Gurage Dance competition #EthioTraditional..."
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-semibold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Regional Soundtrack</label>
                      <select
                        value={draftMusic}
                        onChange={(e) => setDraftMusic(e.target.value)}
                        className="w-full p-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white outline-none"
                      >
                        <option value="Afaan Oromo Modern Pop Mix">Oromoo Pop Mix 🎧</option>
                        <option value="Amharic Tizita Massinqo acoustic">Tizita (Acoustic Masinqo)</option>
                        <option value="Swahili Coast - Coastal Beats">Coastal Beats (Dar-es-Salaam)</option>
                        <option value="Tigrinya Guayla - Shambako">Guayla Shambako mix</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Publish Action Type</label>
                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        💾 Save to Offline Draft Pools
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Local persistent draft pool cabinet */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2.5">Your Saved Video Studio Drafts</span>
                <div className="space-y-2.5">
                  {localDrafts.map((dr, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-850 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 font-bold border border-zinc-800">
                          {index + 1}
                        </div>
                        <div>
                          <span className="text-zinc-200 block text-[11px] font-bold">{dr.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">Theme Music: {dr.music}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setShortVideosList((prev) => [
                              {
                                id: prev.length + 1,
                                title: dr.title,
                                creator: `@You`,
                                avatar: `ME`,
                                music: dr.music,
                                likes: 0,
                                comments: 0,
                                shares: 0,
                                isLiked: false
                              },
                              ...prev
                            ]);
                            setLocalDrafts((p) => p.filter((_, idx) => idx !== index));
                            alert("🚀 Published draft reel live into your feed!");
                          }}
                          className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                        >
                          Publish Live
                        </button>
                        <button
                          onClick={() => setLocalDrafts((p) => p.filter((_, idx) => idx !== index))}
                          className="p-1 bg-zinc-900 hover:bg-rose-500 text-zinc-500 hover:text-white rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {localDrafts.length === 0 && (
                    <p className="text-center text-zinc-650 italic py-4">No video drafts saved in your dashboard yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. AGENCY & REFERRALS ================= */}
        {ecoTab === "agency_system" && (
          <div className="space-y-6">
            {/* Split layout: Recruits on Left, Referral on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recruits List box */}
              <div className="lg:col-span-7 bg-zinc-900/50 border border-zinc-850 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    Host Agency Management Center
                  </h3>
                  <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">
                    Class level {agencyLevel} Agency
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                  Recruit fresh regional hosts, earn commissions on accumulated target milestones. 
                  Commission matrix: <span className="text-emerald-400 font-bold">Level 1-4 = 4%</span>, <span className="text-amber-500 font-bold">Level 5+ = 8%</span>.
                </p>

                {/* List of active recruits */}
                <div className="space-y-2.5">
                  {recruits.map((rec) => (
                    <div key={rec.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-zinc-100 text-xs">{rec.name}</span>
                          <span className="text-[8px] bg-zinc-900 text-zinc-400 px-1 py-0.2 rounded font-mono font-bold">
                            {rec.level}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1.5">
                          <span>Milestone: <span className="text-amber-500 font-bold">{rec.diamonds.toLocaleString()} Diamonds</span></span>
                          <span>•</span>
                          <span className={`${rec.status.includes("Pending") ? "text-amber-400" : "text-emerald-400"}`}>{rec.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {rec.status.includes("Pending") ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleApproveRecruit(rec.id)}
                              className="p-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRecruit(rec.id)}
                              className="p-1 px-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 text-[10px] rounded-lg cursor-pointer"
                            >
                              Deny
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                            <UserCheck className="w-3.5 h-3.5" /> Approved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form to scout / recruit new host */}
                <div className="border-t border-zinc-850 pt-4 mt-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Scout new host applicant</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Applicant's Full Name..."
                      value={newRecruitName}
                      onChange={(e) => setNewRecruitName(e.target.value)}
                      className="flex-1 p-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white outline-none text-xs"
                    />
                    <button
                      onClick={() => {
                        if (!newRecruitName.trim()) return;
                        setRecruits((prev) => [
                          ...prev,
                          { id: prev.length + 1, name: newRecruitName, level: "Basic", status: "Pending approval", diamonds: 0 }
                        ]);
                        setNewRecruitName("");
                        setStatsXp(30);
                        alert(`📧 Recruitment scouting request sent! Earned 30 XP agency XP reward!`);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
                    >
                      Scout Host
                    </button>
                  </div>
                </div>
              </div>

              {/* Referral bonus box */}
              <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-850 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  Referral Reward Program
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Invite your friends to register and complete their identity checks. Upon phone check qualification, both parties earn a premium bonus payout!
                </p>

                {/* Referral Link copy field */}
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 flex items-center justify-between">
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-zinc-500 block leading-none font-bold uppercase">Invite Link Code</span>
                    <span className="text-[11px] text-emerald-400 font-bold block mt-1">{referralCode}</span>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 px-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-white font-bold"
                  >
                    {copiedReferral ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Invite Friend Form input */}
                <div className="border-t border-zinc-850 pt-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Simulate Friend Register</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Friend's Mobile Number (e.g. +251 911 22...)"
                      value={invitedFriendPhone}
                      onChange={(e) => setInvitedFriendPhone(e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white outline-none font-mono text-[11px]"
                    />
                    <button
                      onClick={handleTriggerInvite}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                    >
                      Invite & Credit +5,000 Coins
                    </button>
                  </div>
                </div>

                {/* History list of referrals */}
                <div className="border-t border-zinc-850 pt-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Referral Milestones Status</span>
                  <div className="space-y-1.5">
                    {referralHistory.map((hist, i) => (
                      <div key={i} className="p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 flex items-center justify-between text-[10px]">
                        <div>
                          <span className="text-zinc-200 font-bold">{hist.name}</span>
                          <span className="text-zinc-500 block">{hist.level} • {hist.date}</span>
                        </div>
                        <span className="text-emerald-400 font-bold font-mono">{hist.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3.5 REFERRAL PROGRESS TRACKER & LINK GENERATOR ================= */}
        {ecoTab === "referrals" && (
          <div className="space-y-6">
            {/* Analytics Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block font-mono">Total Invites Sent</span>
                <span className="text-xl font-black text-white block mt-1.5 font-mono">{referrals.length}</span>
                <span className="text-[10px] text-zinc-500 mt-1 block font-medium">Live link session keys active</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block font-mono">Completed OTP Checks</span>
                <span className="text-xl font-black text-blue-400 block mt-1.5 font-mono">
                  {referrals.filter(r => r.registered).length}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 block font-medium font-sans">Authentication completed</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block font-mono">Verified ID Checkouts</span>
                <span className="text-xl font-black text-emerald-400 block mt-1.5 font-mono">
                  {referrals.filter(r => r.verified).length}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 block font-medium font-sans">Success rate: {Math.round((referrals.filter(r => r.verified).length / Math.max(1, referrals.length)) * 100)}%</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block font-mono">Bonus Coins Earned</span>
                <span className="text-xl font-black text-amber-500 block mt-1.5 font-mono">
                  {(referrals.filter(r => r.bonusPaid).length * 5000 + (milestoneClaimed ? 15000 : 0)).toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 block font-medium font-sans">Simulated coin payouts verified</span>
              </div>
            </div>

            {/* Split row: Link Settings + Social Embed on Left, Milestone progress on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side: Campaign Link Builder */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-emerald-400" />
                      Configure Your Invite Campaign Link
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Personalize your unique invite link. When friends use this custom landing page to complete their KYC Verification, both of you are instantly paid 5,000 Coins.
                    </p>
                  </div>

                  {/* Code Editor Form */}
                  <form onSubmit={handleUpdateReferralCode} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-[10px] text-zinc-500 font-mono select-none">mela.live/</span>
                      <input
                        type="text"
                        value={referralCodeInput}
                        onChange={(e) => setReferralCodeInput(e.target.value)}
                        placeholder="CUSTOM-CODE-HERE"
                        className="w-full pl-22 pr-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-bold outline-none uppercase tracking-wide text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-extrabold rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                    >
                      Update Code
                    </button>
                  </form>

                  {/* Absolute URL viewer */}
                  <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl flex items-center justify-between">
                    <div className="overflow-hidden mr-2.5 text-left">
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block leading-none font-mono">Your Shareable Universal Redirect Link</span>
                      <span className="text-xs text-emerald-400 font-bold block mt-1.5 truncate font-mono select-all">
                        https://ais-pre-ooztktxmrm37och7kimrwa-253866095193.europe-west3.run.app/join/{referralCode}?ref=user
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://ais-pre-ooztktxmrm37och7kimrwa-253866095193.europe-west3.run.app/join/${referralCode}?ref=user`);
                        setCopiedReferral(true);
                        setTimeout(() => setCopiedReferral(false), 2000);
                        setReferralLogs((p) => ["📋 Clipboard Copy: Reward invitation URL copied directly.", ...p]);
                      }}
                      className="p-1.5 px-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-200 font-bold shrink-0 text-[11px] cursor-pointer"
                    >
                      {copiedReferral ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Channel Presets Selector */}
                  <div className="border-t border-zinc-850/60 pt-4">
                    <label className="text-[10px] text-zinc-550 uppercase font-black tracking-widest block mb-2.5 font-mono">Precomposed Broadcast Presets</label>
                    <div className="flex gap-2 mb-3.5">
                      {(["Telegram", "WhatsApp", "SMS", "Direct Link"] as const).map((channel) => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setShareChannel(channel)}
                          className={`flex-1 py-2 rounded-xl text-[10.5px] font-extrabold cursor-pointer transition-all ${
                            shareChannel === channel
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                              : "bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {channel === "Telegram" && "✈️ Telegram"}
                          {channel === "WhatsApp" && "💬 WhatsApp"}
                          {channel === "SMS" && "📟 SMS Promo"}
                          {channel === "Direct Link" && "🔗 Link Only"}
                        </button>
                      ))}
                    </div>

                    {/* Precomposed text block */}
                    <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl relative text-left">
                      <p className="text-[11px] text-zinc-300 italic leading-relaxed pr-16 font-semibold select-all font-sans">
                        {shareChannel === "Telegram" && `📱 Join me on MELA LIVE, the ultimate gaming, livestream and audio lounge app in Africa! Use my invitation link to get a 5,000 Coin welcome bounty instantly: https://mela.live/invite/${referralCode}`}
                        {shareChannel === "WhatsApp" && `🔥 Hey! You've been invited to register on Mela Live! Listen to acoustic tunes, play streaming contests, and join audio party rooms. Grab your 5,000 coin gift here: https://mela.live/invite/${referralCode}`}
                        {shareChannel === "SMS" && `MELA LIVE: Earn and stream! Sign up with my referral campaign code ${referralCode} to claim 5,000 extra coins instantly: https://mela.live/invite/${referralCode}`}
                        {shareChannel === "Direct Link" && `https://mela.live/invite/${referralCode}`}
                      </p>
                      <button
                        onClick={() => {
                          let text = "";
                          if (shareChannel === "Telegram") text = `📱 Join me on MELA LIVE, the ultimate gaming, livestream and audio lounge app in Africa! Use my invitation link to get a 5,000 Coin welcome bounty instantly: https://mela.live/invite/${referralCode}`;
                          if (shareChannel === "WhatsApp") text = `🔥 Hey! You've been invited to register on Mela Live! Listen to acoustic tunes, play streaming contests, and join audio party rooms. Grab your 5,000 coin gift here: https://mela.live/invite/${referralCode}`;
                          if (shareChannel === "SMS") text = `MELA LIVE: Earn and stream! Sign up with my referral campaign code ${referralCode} to claim 5,000 extra coins instantly: https://mela.live/invite/${referralCode}`;
                          if (shareChannel === "Direct Link") text = `https://mela.live/invite/${referralCode}`;
                          navigator.clipboard?.writeText(text);
                          alert(`📋 Precomposed ${shareChannel} message copied to your clipboard! Ready to share.`);
                        }}
                        className="absolute right-2.5 bottom-2.5 p-1 bg-zinc-905 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-[9px] font-bold"
                      >
                        Copy Promo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Social Message Card Preview Mockup */}
                <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 space-y-2.5">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block font-mono">Dynamic Messenger Card Preview in Social Apps</span>
                  <div className="bg-[#182533] border-l-4 border-emerald-500 p-3.5 rounded-xl text-left max-w-sm">
                    <span className="text-emerald-400 font-extrabold text-[11px] block font-sans">Mela Live - Discover, Stream & Connect</span>
                    <span className="text-[10px] text-zinc-300 block font-semibold mt-1 font-sans">
                      You are invited to join Mela Social Lounge! Claim a complimentary welcome gift of 5,000 Coins upon KYC phone activation.
                    </span>
                    <span className="text-[9.5px] text-zinc-400 block mt-2 font-mono uppercase bg-black/30 p-1 px-1.5 rounded leading-none w-max">
                      Inviter: {sessionEmail || "mesgebudebeli0@gmail.com"} • `{referralCode}`
                    </span>
                    <div className="w-full h-24 bg-gradient-to-tr from-emerald-950/40 to-teal-900/35 border border-emerald-900/20 rounded-lg mt-2.5 flex items-center justify-center">
                      <div className="text-center animate-pulse">
                        <Gift className="w-5 h-5 text-emerald-400 mx-auto" />
                        <span className="text-[9px] text-emerald-400 font-extrabold block mt-1 tracking-wider uppercase">🎁 Welcome Gift Acknowledged</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Invite Milestones Achievement */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                {/* How it works card */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-3.5 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-xl">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-black text-white">How Referral Verification Works</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-2.5 text-[11px]">
                      <span className="w-4.5 h-4.5 bg-zinc-900 border border-zinc-800 rounded-full font-black text-zinc-450 text-[10px] flex items-center justify-center font-mono shrink-0">1</span>
                      <p className="text-zinc-300 leading-normal">
                        <strong className="text-white block">Generate & Share:</strong> Link your custom code to dispatch precomposed promos on WhatsApp or Telegram.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 text-[11px]">
                      <span className="w-4.5 h-4.5 bg-zinc-900 border border-zinc-800 rounded-full font-black text-zinc-450 text-[10px] flex items-center justify-center font-mono shrink-0">2</span>
                      <p className="text-zinc-300 leading-normal">
                        <strong className="text-white block">Simulate Registration:</strong> Friend clicks the invite link and proceeds with mobile registration (verified via SMS OTP).
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 text-[11px]">
                      <span className="w-4.5 h-4.5 bg-zinc-900 border border-zinc-800 rounded-full font-black text-zinc-450 text-[10px] flex items-center justify-center font-mono shrink-0">3</span>
                      <p className="text-zinc-300 leading-normal">
                        <strong className="text-white block">Identity Verification Compliance:</strong> Local system monitors anti-fraud parameters (No multiple clones or VPN usage).
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 text-[11px]">
                      <span className="w-4.5 h-4.5 bg-zinc-900 border border-zinc-800 rounded-full font-black text-zinc-450 text-[10px] flex items-center justify-center font-mono shrink-0">4</span>
                      <p className="text-zinc-300 leading-normal">
                        <strong className="text-white block">Claim Double Payout:</strong> Once validated, both host and friend wallets instantly credit **5,000 Coins**!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Milestone box tracker */}
                <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white block">🏆 Referral Milestone Chest</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block leading-none font-mono">Invite 3 Verified Friends to Unlock Bonus Chest</span>
                    </div>
                    <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2 py-0.5 rounded font-mono font-black">
                      +15,000 Coins
                    </span>
                  </div>

                  {/* Progress details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-zinc-400 font-bold">Verified Recruits Achievement</span>
                      <span className="text-emerald-400 font-extrabold">{referrals.filter(r => r.verified).length} / 3 friends</span>
                    </div>
                    {/* Bar */}
                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850 p-0.5">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (referrals.filter(r => r.verified).length / 3) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Claim Button */}
                  {milestoneClaimed ? (
                    <div className="p-2.5 bg-zinc-950 border border-zinc-850 text-center rounded-xl text-zinc-500 font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Extra +15,000 Prize Claimed & Credited
                    </div>
                  ) : (
                    <button
                      onClick={handleClaimMilestoneBonus}
                      disabled={referrals.filter(r => r.verified).length < 3}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 disabled:from-zinc-900 disabled:to-zinc-900 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-20 text-zinc-950 disabled:text-zinc-650 font-black text-xs rounded-xl cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      🎁 Claim 15,000 Milestone Bonus Box
                    </button>
                  )}
                </div>

                {/* Simulated Registration Console */}
                <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 space-y-4 text-left">
                  <div>
                    <span className="text-xs font-black text-white block">➕ Launch Simulated Account Signup</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5 block leading-none">Simulate a friend using your active referral code to test live tracking response.</span>
                  </div>

                  <form onSubmit={handleCreateSimulatedReferral} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase font-black tracking-wider mb-1">Friend's Name</label>
                        <input
                          type="text"
                          required
                          value={simName}
                          onChange={(e) => setSimName(e.target.value)}
                          placeholder="e.g. Saron Berhe"
                          className="w-full p-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-bold outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase font-black tracking-wider mb-1">Mobile Number</label>
                        <input
                          type="text"
                          required
                          value={simPhone}
                          onChange={(e) => setSimPhone(e.target.value)}
                          placeholder="e.g. +251 912 345678"
                          className="w-full p-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-mono text-xs outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#2DA44E] hover:bg-[#2c974b] text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Create Proposed Referral Record
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom Section: Real-time Live Pipeline Pipeline Tracker & Simulator Board */}
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-850 pb-3 mb-4 gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-white">Live Pipeline Referral Tracker Console</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">Click action steps to push friends from stage to stage and simulate identity checks to trigger the coin awards in real-time.</p>
                </div>
                <span className="px-2.5 py-1 bg-zinc-950 rounded border border-zinc-850 text-emerald-450 font-mono text-[10px] font-bold">
                  Device Verification Engine Active 🟢
                </span>
              </div>

              {/* Table List of Referrals */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-850 text-[10px] text-zinc-500 uppercase font-bold font-mono">
                      <th className="pb-2.5 font-bold">Friend / Applicant info</th>
                      <th className="pb-2.5 font-bold">Date Joined</th>
                      <th className="pb-2.5 font-bold">Registration & Tracking Pipeline Stage</th>
                      <th className="pb-2.5 font-bold">Simulated Action Controllers</th>
                      <th className="pb-2.5 font-bold text-right">Credit Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850/40">
                    {referrals.map((partner) => {
                      // Calculate active pipeline stage index
                      let currentStageName = "Initialized Link";
                      let currentStageColor = "text-zinc-450 bg-zinc-950/40 border-zinc-900/35";
                      let pct = 25;
                      
                      if (partner.verified) {
                        currentStageName = "Face Verified ✅ Device Safe";
                        currentStageColor = "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";
                        pct = 100;
                      } else if (partner.registered) {
                        currentStageName = "OTP Authenticated 📱 Pending KYC";
                        currentStageColor = "text-blue-400 bg-blue-950/25 border-blue-900/30";
                        pct = 75;
                      } else if (partner.linkOpened) {
                        currentStageName = "Opened Invite Link 🔗";
                        currentStageColor = "text-yellow-500 bg-yellow-950/20 border-yellow-904/20";
                        pct = 50;
                      }

                      return (
                        <tr key={partner.id} className="text-xs">
                          <td className="py-3.5 pr-2.5">
                            <span className="font-bold text-zinc-100 block">{partner.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{partner.phone}</span>
                          </td>
                          <td className="py-3.5 pr-2.5 text-zinc-400 font-mono text-[11px] font-bold">
                            {partner.date}
                          </td>
                          <td className="py-3.5 pr-2.5">
                            {/* Pipeline Status Indicator Row */}
                            <div className="space-y-1.5">
                              <span className={`inline-block text-[9.5px] font-black tracking-wide px-2 py-0.5 rounded-full border ${currentStageColor}`}>
                                {currentStageName}
                              </span>
                              <div className="w-32 h-2 bg-zinc-950 rounded-full border border-zinc-850 overflow-hidden p-0.5">
                                <div
                                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-2.5 whitespace-nowrap">
                            {/* Action Trigger Buttons */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleAdvanceStage(partner.id, "link")}
                                disabled={partner.linkOpened}
                                className="p-1 px-2 bg-zinc-900 hover:bg-zinc-850 disabled:opacity-30 border border-zinc-800 text-[10px] font-black rounded-lg transition-all cursor-pointer text-zinc-300"
                                title="Device browser registers cookie click"
                              >
                                🔗 Click Link
                              </button>
                              <button
                                onClick={() => handleAdvanceStage(partner.id, "register")}
                                disabled={partner.registered}
                                className="p-1 px-2 bg-zinc-900 hover:bg-zinc-850 disabled:opacity-30 border border-zinc-800 text-[10px] font-black rounded-lg transition-all cursor-pointer text-zinc-300"
                                title="Friend registers with SMS phone code"
                              >
                                📱 Auth SMS OTP
                              </button>
                              <button
                                onClick={() => handleAdvanceStage(partner.id, "verify")}
                                disabled={partner.verified}
                                className="p-1 px-2 bg-emerald-600/15 border border-emerald-500/25 hover:bg-emerald-600/30 text-emerald-400 disabled:opacity-30 text-[10px] font-black rounded-lg transition-all cursor-pointer"
                                title="Run face scan + compliance registry validation"
                              >
                                🛡️ Government Face ID Checks
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 text-right font-mono font-black shrink-0">
                            {partner.bonusPaid ? (
                              <span className="text-emerald-400 text-xs text-right block font-black">+5,000 Coins Paid</span>
                            ) : (
                              <span className="text-zinc-600 text-[11px] block text-right font-black">Pending Approval</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Real-time audit log stream */}
              <div className="border-t border-zinc-850 mt-4 pt-3.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 font-mono">Real-time Compliance Audit Trail Logs</span>
                <div className="bg-zinc-950 rounded-xl p-3 h-28 overflow-y-auto space-y-1.5 text-[10.5px] font-sans scrollbar-none font-semibold">
                  {referralLogs.map((log, lIdx) => (
                    <div
                      key={lIdx}
                      className={`p-1.5 rounded-lg text-left ${
                        log.includes("Payout") || log.includes("Landmark")
                          ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 font-bold"
                          : log.includes("Settings")
                          ? "bg-blue-950/20 text-blue-400 border border-blue-900/20"
                          : "bg-zinc-900/40 text-zinc-400 border border-zinc-900/50"
                      }`}
                    >
                      <span className="text-[8.5px] opacity-60 font-mono mr-1.5">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. VIP CLUBHOUSE DETAILS ================= */}
        {ecoTab === "vip_member" && (
          <div className="max-w-2xl mx-auto bg-zinc-900/50 border border-zinc-850 rounded-2xl p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center mx-auto text-black">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-white">Unlock Mela Premium VIP Status</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Gain prestigious entrance animations, exclusive badge flares, custom user frames, higher priority during withdrawal processing, and a continuous daily bonus!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                  👑 VIP Elite Frame Profile
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Your profile avatar gains gold lighting. Stand out in live rooms and priority dashboard lists.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                  💰 Daily Return Bonus
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Earn passive feedback dividends: receive a reward of <span className="text-emerald-400 font-bold font-mono">3,000 Coins</span> everyday you visit the app!
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                  ✨ Room Entry Animation
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  When you join a voice room or live audio lounge, a giant cosmic entry banner signals your arrival to moderators!
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                  🛡️ Special Withdrawal Priority
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Instantly process Telebirr, Chapa, and M-Pesa payments with zero platform handling fees on the spot.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-5 flex flex-col items-center gap-3">
              <div className="text-center font-mono">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">VIP Premium Price</span>
                <span className="text-lg font-black text-amber-400 block mt-1">100,000 Coins</span>
              </div>
              <button
                onClick={handleBuyVip}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                Join VIP Clubhouse Now
              </button>
            </div>
          </div>
        )}

        {/* ================= 5. SECURITY SYSTEM & FRAUD CENTER ================= */}
        {ecoTab === "security_guard" && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-850 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2.5 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    Interactive Anti-Fraud Security Diagnostics
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Mela Live strictly enforces region compliance, VPN blockades, emulator barriers, and multi-login abuse audits to maintain virtual coin economy security.
                  </p>
                </div>
                <button
                  onClick={checkMultipleAccountAbuse}
                  className="px-4 py-2 bg-rose-600/10 border border-rose-500/25 hover:bg-rose-600/20 text-rose-400 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  🛡️ Run Guard Sweep
                </button>
              </div>

              {/* Status lights diagnostics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-4">
                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-bold uppercase font-mono">VPN Proxy Filter</span>
                    <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">{vpnUsageStatus}</span>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-bold uppercase font-mono">Emulator Shield</span>
                    <span className="text-[11px] text-indigo-400 font-bold block mt-0.5">CLEAN 📶 Native Arm7 device signatures</span>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-bold uppercase font-mono">Multi-Sys accounts</span>
                    <span className="text-[11px] text-amber-400 font-bold block mt-0.5">0 anomalous clone hashes detected.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderator actions reports & simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Report user form */}
              <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-850 rounded-2xl p-5 space-y-3.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Report Community Violation</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Target Account ID</label>
                    <input
                      type="text"
                      placeholder="e.g. Host_ID_48021 or Name..."
                      value={userReportTarget}
                      onChange={(e) => setUserReportTarget(e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Violation Category</label>
                    <select
                      value={userReportReason}
                      onChange={(e) => setUserReportReason(e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white outline-none"
                    >
                      <option value="vpn">VPN / Fake GPS Spoofing</option>
                      <option value="clones">Emulator Clones & Macro scripts</option>
                      <option value="abuse">Hate Speech during PK Battle</option>
                      <option value="underage">Broadcasting Underage guidelines</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!userReportTarget) return;
                      setSuspendLogs((prev) => [
                        {
                          id: prev.length + 1,
                          target: userReportTarget,
                          violation: userReportReason === "vpn" ? "VPN Abuse" : "Platform integrity breach",
                          action: "Temporary Suspended for Compliance Review",
                          time: "Just now"
                        },
                        ...prev,
                      ]);
                      setUserReportTarget("");
                      alert(`⚖️ Report securely logged to Mela Live Moderation Center. Appeal tickets are routed asynchronously.`);
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
                  >
                    Transmit Moderation Report
                  </button>
                </div>
              </div>

              {/* Live Suspended log tracker */}
              <div className="lg:col-span-7 bg-zinc-900/50 border border-zinc-850 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2.5">Live Security Safeguard Logbook</span>
                <div className="space-y-2">
                  {suspendLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between text-[11px]">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-200 font-bold font-mono">{log.target}</span>
                          <span className="text-[8px] bg-red-950/40 text-red-400 border border-red-900/30 px-1 py-0.2 rounded font-mono font-bold">
                            {log.violation}
                          </span>
                        </div>
                        <span className="text-rose-400 mt-1 block font-bold leading-none">{log.action}</span>
                      </div>
                      <span className="text-zinc-500 font-mono text-[9px] shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
