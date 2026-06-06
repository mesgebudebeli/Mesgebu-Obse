import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { KeyRound, Mail, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, DICTIONARY } from "../mockData";

interface AuthPortalProps {
  onAuthSuccess: (session: any) => void;
  lang: Language;
}

export default function AuthPortal({ onAuthSuccess, lang }: AuthPortalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all email and password fields.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) {
          setError(signUpErr.message);
        } else {
          // If session is null (which happens when email confirmation is enabled), show custom notice
          if (!data.session) {
            setInfo("Check your email and confirm your account before logging in.");
          } else {
            // Direct session
            onAuthSuccess(data.session);
          }
        }
      } else {
        // Sign In Flow
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          setError(signInErr.message);
        } else {
          if (data.session) {
            onAuthSuccess(data.session);
          } else {
            setError("No session was generated. Please verify your credentials or check your email verification status.");
          }
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during authorization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-portal" className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-md relative overflow-hidden">
      {" "}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-xl text-amber-500 mb-4 border border-amber-500/20">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isSignUp ? t("signUp") : t("signIn")} {t("appName")}
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          {t("tagline")}
        </p>
      </div>
      <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
            {t("email")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="auth-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder-slate-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
            {t("password")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <KeyRound className="w-5 h-5" />
            </div>
            <input
              id="auth-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder-slate-600"
              required
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            id="auth-error-message"
            className="flex items-start gap-2.5 p-3.5 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {info && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            id="auth-info-message"
            className="flex items-start gap-2.5 p-3.5 bg-amber-950/40 border border-amber-500/20 text-amber-300 rounded-xl text-xs leading-relaxed"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{info}</span>
          </motion.div>
        )}

        <button
          id="auth-submit-button"
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-medium py-3 rounded-xl shadow-lg transition-all duration-250 cursor-pointer disabled:opacity-50 text-sm mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : isSignUp ? (
            t("signUp")
          ) : (
            t("signIn")
          )}
        </button>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-slate-800 relative z-10 text-xs">
        <span className="text-slate-500">
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
        </span>{" "}
        <button
          id="auth-toggle-mode-button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setInfo(null);
          }}
          className="text-amber-500 font-semibold hover:underline ml-1 cursor-pointer"
        >
          {isSignUp ? "Click to Sign In" : "Register a free account"}
        </button>
      </div>

      <div className="mt-4 text-center text-[10px] text-slate-500">
        Demo Login: <span className="text-slate-400">demo@example.com</span> / password:{" "}
        <span className="text-slate-400">password123</span>
      </div>
    </div>
  );
}
