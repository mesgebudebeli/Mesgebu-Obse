import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle, Sparkles } from "lucide-react";
import { SupportMessage } from "../types";
import { Language, DICTIONARY } from "../mockData";

interface HelpSupportProps {
  lang: Language;
}

export default function HelpSupport({ lang }: HelpSupportProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: "msg-1",
      sender: "admin",
      text: "Hello! Welcome to Spark Support. How can we assist you with live streams, payout setup, or local agency approvals today?",
      timestamp: "18:20",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: SupportMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSubmitting(true);
    setSuccessNotice(true);

    // Simulate Admin Auto Reply
    setTimeout(() => {
      const adminMsg: SupportMessage = {
        id: "msg-reply-" + Date.now(),
        sender: "admin",
        text: `Thank you for your request. An administrator has received your text ("${userMsg.text}"). We will verify your ID and resolve your issue within 2 hours. Your support ticket ID is SPK-TKT-${Math.floor(
          100000 + Math.random() * 900000
        )}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, adminMsg]);
      setIsSubmitting(false);
    }, 1800);

    setTimeout(() => setSuccessNotice(false), 4000);
  };

  return (
    <div id="help-technical-support" className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {" "}
      <div className="absolute bottom-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{t("helpSection")}</h3>
          <p className="text-xs text-slate-400">Directly contact the Spark Administrator team regarding regional tax compliance or payout options.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Request Ticket Form container */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick FAQ Directory</h4>
            
            <div className="space-y-2 text-[11px] text-slate-400 leading-normal">
              <details className="group border-b border-slate-900 pb-2">
                <summary className="font-bold text-white cursor-pointer hover:text-amber-500 list-none flex justify-between items-center">
                  <span>How to clear biometrics constraint?</span>
                  <span className="text-slate-600 group-open:rotate-180 transition-all font-mono">▼</span>
                </summary>
                <p className="mt-1.5 text-slate-400">
                  Perform a registration check inside the Face ID console. Once verified, compliance checks remain active for 30 consecutive calendar days.
                </p>
              </details>

              <details className="group border-b border-slate-900 pb-2">
                <summary className="font-bold text-white cursor-pointer hover:text-amber-500 list-none flex justify-between items-center">
                  <span>What are the payout waiting periods?</span>
                  <span className="text-slate-600 group-open:rotate-180 transition-all font-mono">▼</span>
                </summary>
                <p className="mt-1.5 text-slate-400">
                  CBE and Telebirr standard transfers are audited and credited within 24 hours. Awash, Abyssinian, and PayPal cycles execute every Friday at 12:00 UTC.
                </p>
              </details>

              <details className="group">
                <summary className="font-bold text-white cursor-pointer hover:text-amber-500 list-none flex justify-between items-center">
                  <span>How to register as an Agency?</span>
                  <span className="text-slate-600 group-open:rotate-180 transition-all font-mono">▼</span>
                </summary>
                <p className="mt-1.5 text-slate-400">
                  Reach Level 10, fill the agency registration request form using this support interface. Be ready with your government registry documentation.
                </p>
              </details>
            </div>
          </div>

          <div className="p-4 bg-blue-950/20 border border-blue-500/15 rounded-xl text-[10px] text-blue-300 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Automated Ticket Audit</span>
              Your account metadata, language selection, and compliance state are automatically attached to private messages to fast-track support responses.
            </div>
          </div>
        </div>

        {/* Dynamic Chat conversation container */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between min-h-[320px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white">Spark Support Desk</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Clock className="w-3" /> Average response: &lt;2 mins
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 mb-4 max-h-[220px] pr-1.5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                    msg.sender === "user"
                      ? "bg-slate-800 text-white rounded-tr-none"
                      : "bg-blue-950/40 border border-blue-900/40 text-blue-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isSubmitting && (
              <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                <span>Admin typing a response...</span>
              </div>
            )}
          </div>

          {/* User Form Form Panel */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              id="support-direct-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="State your support query clearly here..."
              className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none transition-all placeholder-slate-600"
              required
            />
            <button
              id="support-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {successNotice && (
            <div className="p-2 bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-lg mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Support ticket submitted to regional Spark administrators. Keep direct chat open.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
