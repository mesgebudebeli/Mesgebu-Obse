import { useState, useEffect } from "react";
import { ShieldCheck, Camera, Scan, AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { Language, DICTIONARY } from "../mockData";

interface FaceIdVerificationProps {
  onVerifyComplete: () => void;
  lang: Language;
}

export default function FaceIdVerification({ onVerifyComplete, lang }: FaceIdVerificationProps) {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dots, setDots] = useState("");
  const [scanProgress, setScanProgress] = useState(0);

  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanning(false);
            setSuccess(true);
            setTimeout(() => {
              onVerifyComplete();
            }, 1800);
            return 100;
          }
          return prev + 8;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setDots((d) => (d.length >= 3 ? "" : d + "."));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  return (
    <div id="face-id-verification" className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500" />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Security Compliance Policy: Article 10</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t("faceIdRequired")}</h3>
        <p className="text-xs text-slate-400 px-4">
          {t("faceIdRegister")}
        </p>
      </div>

      <div className="relative w-64 h-64 mx-auto my-8 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
        
        {/* Animated scanning bar */}
        {scanning && (
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute left-0 w-full h-1 bg-teal-400 shadow-[0_0_15px_#2dd4bf] z-20"
          />
        )}

        <div className="relative z-10 flex flex-col items-center">
          {scanning ? (
            <div className="text-center">
              <Scan className="w-16 h-16 text-teal-400 animate-pulse mb-3" />
              <div className="text-sm font-mono text-teal-400">{scanProgress}% Captured</div>
            </div>
          ) : success ? (
            <div className="text-center text-emerald-400 animate-bounce">
              <ShieldCheck className="w-16 h-16 mx-auto mb-3" />
              <div className="text-sm font-semibold">{t("faceIdSuccess")}</div>
            </div>
          ) : (
            <div className="text-center text-slate-500 p-4">
              <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-10 h-10 text-slate-400" />
              </div>
              <span className="text-xs">Camera Simulator Standby</span>
            </div>
          )}
        </div>

        {/* Framing Corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500" />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {!scanning && !success && (
          <button
            id="start-face-id-scan-btn"
            onClick={() => {
              setScanning(true);
              setScanProgress(0);
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/15"
          >
            <Camera className="w-5 h-5" />
            {t("faceIdVerifyBtn")}
          </button>
        )}

        {scanning && (
          <div className="w-full text-center text-slate-400 font-mono text-xs">
            Align face within scanner and remain still{dots}
          </div>
        )}

        {success && (
          <div className="w-full text-center text-emerald-400 font-mono text-xs bg-emerald-950/20 border border-emerald-500/20 py-2 rounded-lg">
            ✓ Biometric registration verified successfully with Spark Compliance Server
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl mt-2 text-[11px] text-slate-500 border border-slate-800/60 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Notice: Failing biometrics check blocks payout withdrawals & daily quest multipliers for 30 calendar days. Keep your profile updated.</span>
        </div>
      </div>
    </div>
  );
}
