import { useState } from "react";
import { Backpack, Trophy, Sparkles, User, BadgeAlert } from "lucide-react";
import { BackpackItem, LeaderboardUser } from "../types";
import { INITIAL_BACKPACK, INITIAL_LEADERBOARD, Language, DICTIONARY } from "../mockData";

interface BackpackComponentProps {
  backpackItems: BackpackItem[];
  lang: Language;
  onOpenProfile?: (userId: string) => void;
}

export default function BackpackComponent({ backpackItems, lang, onOpenProfile }: BackpackComponentProps) {
  const [items] = useState<BackpackItem[]>(INITIAL_BACKPACK);
  const [leaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [activeSegment, setActiveSegment] = useState<"inventory" | "leaderboard">("inventory");

  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  // Merge default items with runtime items (e.g. bought items)
  const allItems = [...items, ...backpackItems];

  // Map leaderboard usernames to our database entity IDs
  const getSocialUserId = (name: string): string => {
    if (name.includes("Sintayehu")) return "sintayehu";
    if (name.includes("Netsanet")) return "netsanet";
    if (name.includes("Alex")) return "alex_j";
    if (name.includes("Guang")) return "guang_z";
    if (name.includes("Helen")) return "helen_tesfaye";
    if (name.includes("Yared")) return "yared_abera";
    return "current_user";
  };

  return (
    <div id="backpack-and-leaderboard-widget" className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {" "}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Switch segmented list */}
      <div className="flex items-center gap-2 mb-4 bg-zinc-950 border border-zinc-900 p-1 rounded-xl">
        <button
          onClick={() => setActiveSegment("inventory")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === "inventory" ? "bg-zinc-800 text-white border border-zinc-700 shadow" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Backpack className="w-4 h-4 text-blue-400" />
          {t("backpack")} ({allItems.length})
        </button>
        <button
          onClick={() => setActiveSegment("leaderboard")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === "leaderboard" ? "bg-zinc-800 text-white border border-zinc-700 shadow" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Trophy className="w-4 h-4 text-blue-500" />
          {t("leaderboard")}
        </button>
      </div>

      {/* Segment Content */}
      {activeSegment === "inventory" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {allItems.map((item, idx) => (
              <div
                key={item.id + idx}
                className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-850 flex items-start gap-2.5 relative group hover:border-zinc-700 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-lg shrink-0">
                  {item.iconName}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight pr-4">{item.name}</div>
                  <div className="text-[9px] text-zinc-450 text-zinc-400 mt-1 leading-normal line-clamp-2">{item.description}</div>
                  
                  {item.badgeLevel && (
                    <span className="inline-block mt-1 font-mono text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded uppercase">
                      RANK {item.badgeLevel} ACCREDITED
                    </span>
                  )}
                </div>
                <div className="absolute top-1.5 right-1.5 bg-zinc-900 border border-zinc-800 text-blue-405 text-blue-400 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                  x{item.qty}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-gradient-to-r from-blue-500/5 to-indigo-505/5 border border-zinc-800 rounded-2xl mt-3 flex items-center gap-2.5">
            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="text-[10px] text-zinc-400 leading-normal">
              Accumulate rare collectibles to trigger daily tasks coin multipliers and display gorgeous badge borders in live chat streams!
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                if (onOpenProfile) {
                  const resolvedId = getSocialUserId(user.name);
                  onOpenProfile(resolvedId);
                }
              }}
              className={`p-3 bg-zinc-950/60 border rounded-2xl flex items-center justify-between transition-all cursor-pointer hover:border-zinc-700 ${
                user.name === "Mezgebu Debeli" ? "border-blue-500/30 bg-blue-500/[0.02]" : "border-zinc-850"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 text-center font-mono font-bold text-xs">
                  {user.rank === 1 ? (
                    <span className="text-yellow-500 text-sm">🥇</span>
                  ) : user.rank === 2 ? (
                    <span className="text-slate-300 text-sm">🥈</span>
                  ) : user.rank === 3 ? (
                    <span className="text-amber-700 text-sm">🥉</span>
                  ) : (
                    <span className="text-zinc-500">{user.rank}</span>
                  )}
                </div>
                
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-zinc-800 text-xs object-cover"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{user.name}</span>
                    <span className="bg-zinc-900 border border-zinc-800 font-mono text-[8px] font-semibold text-zinc-400 px-1 py-0.2 rounded">
                      LV.{user.level}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500">ID: {user.appId}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold font-mono text-blue-400">
                  {user.score.toLocaleString()}
                </span>
                <span className="text-[8px] block text-zinc-500 uppercase font-bold tracking-wider">contributions</span>
              </div>
            </div>
          ))}

          <div className="text-[10px] text-zinc-500 text-center mt-3 pt-2">
            * Leaderboard updates live every 60 seconds calculated across all regional zones.
          </div>
        </div>
      )}
    </div>
  );
}
