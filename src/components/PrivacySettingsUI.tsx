import { useState } from "react";
import { Eye, EyeOff, Shield, ShieldAlert, User, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { PrivacySettings, Visitor } from "../types";
import { INITIAL_VISITORS, Language, DICTIONARY } from "../mockData";

interface PrivacySettingsUIProps {
  settings: PrivacySettings;
  onUpdateSettings: (newSettings: PrivacySettings) => void;
  lang: Language;
}

export default function PrivacySettingsUI({ settings, onUpdateSettings, lang }: PrivacySettingsUIProps) {
  const [visitors] = useState<Visitor[]>(INITIAL_VISITORS);

  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  const toggleVisitorList = () => {
    onUpdateSettings({ ...settings, visitorListPublic: !settings.visitorListPublic });
  };

  const toggleMessagingStatus = () => {
    onUpdateSettings({ ...settings, messagingStatusPublic: !settings.messagingStatusPublic });
  };

  const toggleProfileInformation = () => {
    onUpdateSettings({ ...settings, profileInformationPublic: !settings.profileInformationPublic });
  };

  return (
    <div id="privacy-and-visitor-management" className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {" "}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="flex items-center gap-3 mb-5 animate-fade-in">
        <div className="p-2 bg-zinc-950 text-blue-400 border border-zinc-800 rounded-xl">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{t("privacySettings")}</h3>
          <p className="text-xs text-zinc-400">{t("visibilityToggles")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Toggle Grid */}
        <div className="space-y-4 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Toggle Privacy Visibility Flags</h4>

          {/* Visitor List Visibility Toggle */}
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl border border-zinc-900">
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                {settings.visitorListPublic ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4 text-zinc-500" />}
              </span>
              <div>
                <span className="text-xs font-bold text-white">Visitor Audits Public</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Allow other cultural creators to see that you visited them.</p>
              </div>
            </div>
            <button
              id="privacy-toggle-visitor"
              onClick={toggleVisitorList}
              className="text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              {settings.visitorListPublic ? (
                <ToggleRight className="w-9 h-9 text-blue-500 fill-blue-500/10" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-zinc-700" />
              )}
            </button>
          </div>

          {/* Messaging Status Visibility Toggle */}
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl border border-zinc-900">
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                {settings.messagingStatusPublic ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4 text-zinc-500" />}
              </span>
              <div>
                <span className="text-xs font-bold text-white">Active Status Badge</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Indicators show of you being online in community posts.</p>
              </div>
            </div>
            <button
              id="privacy-toggle-messaging"
              onClick={toggleMessagingStatus}
              className="text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              {settings.messagingStatusPublic ? (
                <ToggleRight className="w-9 h-9 text-blue-500 fill-blue-500/10" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-zinc-700" />
              )}
            </button>
          </div>

          {/* Profile Information Visibility Toggle */}
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl border border-zinc-900">
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                {settings.profileInformationPublic ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4 text-zinc-500" />}
              </span>
              <div>
                <span className="text-xs font-bold text-white">Profile Stats Public</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Let bystanders see your level progress and total coins.</p>
              </div>
            </div>
            <button
              id="privacy-toggle-profile"
              onClick={toggleProfileInformation}
              className="text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              {settings.profileInformationPublic ? (
                <ToggleRight className="w-9 h-9 text-blue-500 fill-blue-500/10" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-zinc-700" />
              )}
            </button>
          </div>
        </div>

        {/* Visitors Trace List */}
        <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-zinc-905 border-zinc-900 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t("visitors")}</h4>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest leading-none">
                ENCRYPTED
              </span>
            </div>

            {settings.visitorListPublic ? (
              <div className="space-y-2.5">
                {visitors.map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-1 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={v.avatarUrl}
                        alt={v.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full text-xs object-cover border border-zinc-800"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{v.name}</div>
                        <div className="text-[9px] font-mono text-zinc-500">ID: {v.appId}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                      <Clock className="w-3 text-zinc-500" />
                      <span>{v.visitTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-zinc-950/80 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center p-4">
                <ShieldAlert className="w-10 h-10 text-blue-500/30 mb-2.5" />
                <span className="text-xs font-bold text-zinc-300">Visitor List Incognito Mode</span>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[200px] leading-relaxed mx-auto">
                  Activate "Visitor Audits Public" visibility toggle on the left panel to list recent tourists and followers.
                </p>
              </div>
            )}
          </div>

          <div className="text-[9px] text-zinc-600 mt-3 pt-2 text-center leading-normal border-t border-zinc-900">
            Incognito actions comply fully with General Privacy Codes (GPC) Article 3.
          </div>
        </div>
      </div>
    </div>
  );
}
