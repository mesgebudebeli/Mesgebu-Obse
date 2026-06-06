import React, { useState } from "react";
import { CreditCard, Landmark, Plus, Trash2, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { PayoutMethod, PaymentMethodType } from "../types";
import { Language, DICTIONARY } from "../mockData";

interface PayoutScreenProps {
  lang: Language;
}

export default function PayoutScreen({ lang }: PayoutScreenProps) {
  const [region, setRegion] = useState<"Ethiopia" | "International">("Ethiopia");
  const [methods, setMethods] = useState<PayoutMethod[]>([
    {
      id: "pm1",
      type: "Telebirr",
      accountName: "Mezgebu Debeli Private",
      accountNumber: "+251911998877",
      region: "Ethiopia",
      isPrimary: true,
    },
    {
      id: "pm2",
      type: "CBE",
      accountName: "Mezgebu Debeli Dev",
      accountNumber: "1000293810293",
      region: "Ethiopia",
      isPrimary: false,
    },
  ]);

  // Form states for adding new payment method
  const [newType, setNewType] = useState<PaymentMethodType>("Telebirr");
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newNum) return;

    const newMethod: PayoutMethod = {
      id: "pm-" + Date.now(),
      type: newType,
      accountName: newName,
      accountNumber: newNum,
      region,
      isPrimary: methods.length === 0,
    };

    setMethods([...methods, newMethod]);
    setNewName("");
    setNewNum("");
    setShowAddForm(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteMethod = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isPrimary: m.id === id })));
  };

  const filteredMethods = methods.filter((m) => m.region === region);

  return (
    <div id="payout-configuration-panel" className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="flex items-center gap-3 mb-4 animate-fade-in">
        <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded-xl">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{t("payoutConfig")}</h3>
          <p className="text-xs text-zinc-400">{t("payoutDescription")}</p>
        </div>
      </div>

      {/* Region Selector Tab */}
      <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 mb-6">
        <button
          id="region-ethiopia-btn"
          onClick={() => {
            setRegion("Ethiopia");
            setNewType("Telebirr");
          }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            region === "Ethiopia"
              ? "bg-zinc-850 text-white shadow-sm border border-zinc-700 font-bold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          🇪🇹 Ethiopia Region (CBE, Telebirr, Awash, Abyssinia)
        </button>
        <button
          id="region-intl-btn"
          onClick={() => {
            setRegion("International");
            setNewType("PayPal");
          }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            region === "International"
              ? "bg-zinc-850 text-white shadow-sm border border-zinc-700 font-bold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          🌐 International (USD, PayPal, Mastercard)
        </button>
      </div>

      {/* Linked Accounts list */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Linked Accounts ({filteredMethods.length})
        </h4>

        {filteredMethods.length === 0 ? (
          <div className="text-center py-8 bg-zinc-950/40 border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs">
            No payment methods linked for this region. Click 'Add Payment Method' below.
          </div>
        ) : (
          filteredMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 bg-zinc-950 border rounded-2xl flex items-center justify-between transition-all ${
                method.isPrimary ? "border-blue-500/40 bg-blue-950/5" : "border-zinc-850 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-blue-400 shrink-0">
                  {method.type === "PayPal" ? "PP" : method.type === "Mastercard" ? "MC" : method.type.substr(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{method.type}</span>
                    {method.isPrimary && (
                      <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-450 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 font-medium">
                    {method.accountName} • <span className="font-mono text-zinc-500">{method.accountNumber}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!method.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(method.id)}
                    className="text-[10px] text-zinc-350 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMethod(method.id)}
                  className="p-1.5 text-zinc-500 hover:text-rose-455 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                  title="Remove account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2 mb-4 animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Payment integration link saved successfully with Spark Secure Gateway.</span>
        </div>
      )}

      {/* Inline Form to add method */}
      {showAddForm ? (
        <form onSubmit={handleAddMethod} className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3 mb-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Link New Account</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-zinc-400 mb-1 font-semibold">Transfer Gateway</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as PaymentMethodType)}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl p-2.5 outline-none font-semibold cursor-pointer"
              >
                {region === "Ethiopia" ? (
                  <>
                    <option value="Telebirr">Telebirr (Ethio Telecom)</option>
                    <option value="CBE">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Awash">Awash Bank</option>
                    <option value="Abyssinia">Abyssinia Bank (BoA)</option>
                  </>
                ) : (
                  <>
                    <option value="PayPal">PayPal Holdings Inc. (USD)</option>
                    <option value="Mastercard">Spark Virtual MasterCard</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 mb-1 font-semibold">Account Holder Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Holder Name"
                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl p-2.5 outline-none font-medium text-zinc-150"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-zinc-400 mb-1 font-semibold">
              {region === "Ethiopia" && newType === "Telebirr" ? "Mobile Number (+251)" : "Account Number / Email ID"}
            </label>
            <input
              type="text"
              value={newNum}
              onChange={(e) => setNewNum(e.target.value)}
              placeholder={region === "Ethiopia" && newType === "Telebirr" ? "+251 9xx xxx xcx" : "Account Number"}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl p-2.5 outline-none font-mono"
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs text-white bg-blue-600 font-semibold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-500 shadow-sm border border-transparent transition-all"
            >
              Confirm Account Link
            </button>
          </div>
        </form>
      ) : (
        <button
          id="toggle-add-payment-form-btn"
          onClick={() => setShowAddForm(true)}
          className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900/60 border border-dashed border-zinc-800 text-xs font-semibold text-zinc-300 rounded-2xl hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          Add Payment Method for {region} Area
        </button>
      )}

      {/* Safety Badges */}
      <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>PCI-DSS Secured Transfer Engine</span>
        </div>
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-zinc-650 text-zinc-600" />
          <a href="#help" className="hover:underline font-medium">Payout Rules FAQ</a>
        </div>
      </div>
    </div>
  );
}
