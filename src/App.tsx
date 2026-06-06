import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  Sparkles,
  User,
  Shield,
  CreditCard,
  Award,
  Backpack,
  MessageSquare,
  Globe,
  Camera,
  LogOut,
  AppWindow,
  Briefcase,
  Layers,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Language, LANGUAGES, DICTIONARY } from "./mockData";
import { UserStats, PrivacySettings, FaceIdAuthStatus, BackpackItem } from "./types";

// Component imports
import AuthPortal from "./components/AuthPortal";
import FaceIdVerification from "./components/FaceIdVerification";
import PayoutScreen from "./components/PayoutScreen";
import HonorCenter from "./components/HonorCenter";
import BackpackComponent from "./components/BackpackComponent";
import HelpSupport from "./components/HelpSupport";
import PrivacySettingsUI from "./components/PrivacySettingsUI";
import LiveStreamingStudio from "./components/LiveStreamingStudio";
import MezgebuPortfolio from "./components/MezgebuPortfolio";
import UserProfileModal from "./components/UserProfileModal";
import MessagingComponent from "./components/MessagingComponent";
import MelaEcosystemExt from "./components/MelaEcosystemExt";
import { socialService } from "./socialStore";

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ethio-spark-theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("ethio-spark-theme", theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.add("bg-white");
      root.classList.remove("dark");
      root.classList.remove("bg-black");
      root.style.colorScheme = "light";
    } else {
      root.classList.add("dark");
      root.classList.add("bg-black");
      root.classList.remove("light");
      root.classList.remove("bg-white");
      root.style.colorScheme = "dark";
    }
  }, [theme]);

  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App vs Portfolio toggle
  const [isAppViewActive, setIsAppViewActive] = useState(false);

  // Spark App Dashboard dynamic section controller
  const [dashboardTab, setDashboardTab] = useState<
    "studio" | "mela_eco" | "payout" | "honor" | "backpack" | "privacy" | "help" | "messages"
  >("studio");

  // Global user variables
  const [stats, setStats] = useState<UserStats>({
    level: 3,
    xp: 140,
    nextLevelXp: 250,
    coins: 720,
    gems: 35,
  });

  const [backpackNewItems, setBackpackNewItems] = useState<BackpackItem[]>([]);

  // Interactive Tourist Profiles State
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [directChatRequestUserId, setDirectChatRequestUserId] = useState<string | null>(null);

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    visitorListPublic: true,
    messagingStatusPublic: true,
    profileInformationPublic: true,
  });

  const [faceId, setFaceId] = useState<FaceIdAuthStatus>({
    lastVerified: "",
    isRequiredNow: true,
    isRegistered: false,
  });

  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  // Watch Auth session changes
  useEffect(() => {
    let active = true;

    async function initSession() {
      const { data } = await supabase.auth.getSession();
      if (active) {
        setSession(data.session);
        setAuthLoading(false);
      }
    }

    initSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, ses) => {
      if (active) {
        setSession(ses);
      }
    });

    return () => {
      active = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  // Synchronize top-level levels & XP representation dynamically from localized database engine
  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      // Triggers initial mock account setup if not exist
      socialService.getCurrentUserId(email);
      
      const interval = setInterval(() => {
        const u = socialService.getUserById("current_user", email);
        if (u) {
          setStats((prev) => ({
            ...prev,
            level: u.level,
            xp: u.current_xp,
            nextLevelXp: Math.floor(100 * Math.pow(u.level, 1.5)),
          }));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session, stats.xp]);

  // Quick helper to sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAppViewActive(false);
    setFaceId((prev) => ({ ...prev, isRequiredNow: true }));
  };

  const handleAuthSuccess = (newSession: any) => {
    setSession(newSession);
    // On registration / login, trigger biometric checking
    setFaceId((prev) => ({ ...prev, isRequiredNow: true }));
  };

  const handleAddBackpackItem = (item: BackpackItem) => {
    setBackpackNewItems((prev) => [item, ...prev]);
  };

  const isBypassedOrVerified = !faceId.isRequiredNow || faceId.lastVerified !== "";

  return (
    <div className={`min-h-screen ${theme} bg-black text-zinc-100 font-sans selection:bg-blue-500 selection:text-white antialiased overflow-x-hidden`}>
      
      {/* 1. Universal Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setIsAppViewActive(false)}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full rounded-[10px] bg-zinc-950 flex items-center justify-center">
              <span className="text-amber-500 text-lg font-black tracking-tight font-mono">M</span>
            </div>
          </div>
          <div>
            <span className="text-md font-extrabold text-white tracking-tight block leading-none">MELA LIVE</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mt-0.5 font-bold font-mono">
              Pan-African Ecosystem
            </span>
          </div>
        </div>

        {/* Desktop Anchor Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {!isAppViewActive ? (
            <>
              <a
                href="#about-me"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                {t("aboutMe")}
              </a>
              <a
                href="#projects"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                {t("projects")}
              </a>
              <a
                href="#ai-expertise"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                {t("aiExpertise")}
              </a>
              <a
                href="#testimonials"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                {t("testimonials")}
              </a>
            </>
          ) : (
            <button
              onClick={() => setIsAppViewActive(false)}
              className="px-3.5 py-1.5 text-xs font-bold text-blue-500 hover:text-blue-400 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              ← Return to Mezgebu's Portfolio Home
            </button>
          )}
        </nav>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          {/* Multilingual Selector */}
          <div className="relative group flex items-center gap-1 bg-zinc-900/40 border border-zinc-800 px-2.5 py-1.5 rounded-xl cursor-pointer hover:border-zinc-700 transition-all text-xs">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent border-none text-zinc-350 bg-black font-bold outline-none cursor-pointer pr-1"
              id="language-dropdown-select"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-zinc-900 text-white">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selector Toggle */}
          <button
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            className="flex items-center justify-center p-2 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:text-white transition-all cursor-pointer text-zinc-450 text-zinc-400 shadow-sm"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Quick Trigger App Launcher button */}
          {!isAppViewActive ? (
            <button
              id="header-launch-app-btn"
              onClick={() => setIsAppViewActive(true)}
              className="hidden sm:inline-flex px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer shadow"
            >
              {t("enterApp")}
            </button>
          ) : (
            session && (
              <button
                id="header-logout-btn"
                onClick={handleSignOut}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold text-xs"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden md:inline">{t("signOut")}</span>
              </button>
            )
          )}

          {/* Mobile responsive drawer toggler */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-300 border border-zinc-800/80 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Responsive Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-20 left-0 w-full bg-slate-950 border-b border-slate-900 p-5 z-40 space-y-4 shadow-2xl"
          >
            {!isAppViewActive ? (
              <div className="flex flex-col gap-2">
                <a
                  href="#about-me"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-sm text-slate-300 hover:text-white"
                >
                  {t("aboutMe")}
                </a>
                <a
                  href="#projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-sm text-slate-300 hover:text-white"
                >
                  {t("projects")}
                </a>
                <a
                  href="#ai-expertise"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-sm text-slate-300 hover:text-white"
                >
                  {t("aiExpertise")}
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-sm text-slate-300 hover:text-white"
                >
                  {t("testimonials")}
                </a>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAppViewActive(false);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-slate-900 rounded-xl text-xs font-bold text-amber-500"
              >
                ← Return to Portfolio Vision
              </button>
            )}

            {!isAppViewActive && (
              <button
                onClick={() => {
                  setIsAppViewActive(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-xs"
              >
                {t("enterApp")}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Primary Content Wrapper */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {authLoading ? (
          <div className="py-20 text-center text-slate-500 font-mono text-sm flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span>Establishing database connection parameters...</span>
          </div>
        ) : !isAppViewActive ? (
          // Portfolio Vision Mode
          <MezgebuPortfolio onEnterApp={() => setIsAppViewActive(true)} lang={lang} />
        ) : (
          // Spark App Sandbox Mode
          <div className="space-y-6">
            {!session ? (
              // Login Barrier
              <div className="py-8 flex flex-col items-center justify-center">
                <AuthPortal onAuthSuccess={handleAuthSuccess} lang={lang} />
              </div>
            ) : !isBypassedOrVerified ? (
              // Face ID Biometric Compliance Barrier
              <div className="py-8 flex flex-col items-center justify-center">
                <FaceIdVerification
                  onVerifyComplete={() => {
                    setFaceId({
                      lastVerified: new Date().toISOString(),
                      isRequiredNow: false,
                      isRegistered: true,
                    });
                  }}
                  lang={lang}
                />
              </div>
            ) : (
              // Fully authenticated Spark Interface Hub
              <div className="space-y-6">
                
                {/* Visual Header with stats summary */}
                <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                    <div className="w-11 h-11 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-blue-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-100 block">
                          Logged: <span className="font-mono text-blue-400">{session.user?.email || "User Account"}</span>
                        </span>
                        <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono uppercase font-bold leading-none">
                          Level {stats.level}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block font-mono mt-0.5">
                        Device compliance check: Verified Face ID
                      </span>
                    </div>
                  </div>

                  {/* App Subcategory navigation */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto justify-start md:justify-end pb-2 md:pb-0 scrollbar-none border-t border-zinc-800 pt-3 md:pt-0 md:border-transparent">
                    <button
                      onClick={() => setDashboardTab("studio")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "studio"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      📺 Live Streams
                    </button>
                    <button
                      onClick={() => setDashboardTab("mela_eco")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "mela_eco"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/15"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      📲 Mela Ecosystem 🌟
                    </button>
                    <button
                      onClick={() => setDashboardTab("messages")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "messages"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      💬 Messenger Chat
                    </button>
                    <button
                      onClick={() => setDashboardTab("payout")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "payout"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      {t("payoutConfig")}
                    </button>
                    <button
                      onClick={() => setDashboardTab("honor")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "honor"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      Honor Dashboard
                    </button>
                    <button
                      onClick={() => setDashboardTab("backpack")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "backpack"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Backpack className="w-3.5 h-3.5" />
                      Backpack
                    </button>
                    <button
                      onClick={() => setDashboardTab("privacy")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "privacy"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {t("privacySettings")}
                    </button>
                    <button
                      onClick={() => setDashboardTab("help")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        dashboardTab === "help"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Help Support
                    </button>
                  </div>
                </div>

                {/* Subcategory rendering slot */}
                <div className="transition-all duration-350">
                  {dashboardTab === "studio" && (
                    <LiveStreamingStudio
                      stats={stats}
                      onUpdateStats={setStats}
                      lang={lang}
                      sessionEmail={session.user?.email || "demo@example.com"}
                      onOpenProfile={(id) => setSelectedProfileId(id)}
                      directChatRequestUserId={directChatRequestUserId}
                      onClearChatRequest={() => setDirectChatRequestUserId(null)}
                    />
                  )}

                  {dashboardTab === "mela_eco" && (
                    <MelaEcosystemExt
                      stats={stats}
                      onUpdateStats={setStats}
                      lang={lang}
                      sessionEmail={session.user?.email || "demo@example.com"}
                    />
                  )}

                  {dashboardTab === "payout" && <PayoutScreen lang={lang} />}

                  {dashboardTab === "honor" && (
                    <HonorCenter
                      stats={stats}
                      onUpdateStats={setStats}
                      onAddItemToBackpack={handleAddBackpackItem}
                      lang={lang}
                      sessionEmail={session.user?.email || "demo@example.com"}
                    />
                  )}

                  {dashboardTab === "backpack" && (
                    <BackpackComponent
                      backpackItems={backpackNewItems}
                      lang={lang}
                      onOpenProfile={(id) => setSelectedProfileId(id)}
                    />
                  )}

                  {dashboardTab === "privacy" && (
                    <PrivacySettingsUI
                      settings={privacySettings}
                      onUpdateSettings={setPrivacySettings}
                      lang={lang}
                    />
                  )}

                  {dashboardTab === "help" && <HelpSupport lang={lang} />}

                  {dashboardTab === "messages" && (
                    <MessagingComponent
                      lang={lang}
                      sessionEmail={session.user?.email || "demo@example.com"}
                      onOpenProfile={(id) => setSelectedProfileId(id)}
                      directChatRequestUserId={directChatRequestUserId}
                      onClearChatRequest={() => setDirectChatRequestUserId(null)}
                      stats={stats}
                      onUpdateStats={setStats}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Interactive User Profiles Portal Modal */}
      {selectedProfileId && session?.user?.email && (
        <UserProfileModal
          userId={selectedProfileId}
          sessionEmail={session.user.email}
          onClose={() => setSelectedProfileId(null)}
          onOpenMessage={(tgtId) => {
            setDirectChatRequestUserId(tgtId);
            setSelectedProfileId(null);
            setDashboardTab("messages");
          }}
          onXpGained={(xpGain, src) => {
            setStats((prev) => ({ ...prev, xp: prev.xp + xpGain }));
          }}
          lang={lang}
        />
      )}

      {/* Footer copyright */}
      <footer className="py-8 text-center text-[10px] text-zinc-500 border-t border-zinc-900 mt-12 bg-black relative z-25">
        <p>© 2026 Mela Live Social Entertainment Ecosystem. Designed for pan-African growth. Authored by Mezgebu Debeli.</p>
        <p className="mt-1 opacity-60">PCI-DSS Secured, Device-Bound Compliance Verified Platform.</p>
      </footer>
    </div>
  );
}
