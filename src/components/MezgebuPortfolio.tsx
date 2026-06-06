import { Award, Code2, BrainCircuit, Users, Star, ArrowRight, Compass, ShieldCheck, HeartHandshake } from "lucide-react";
import { Language, DICTIONARY } from "../mockData";

interface MezgebuPortfolioProps {
  onEnterApp: () => void;
  lang: Language;
}

export default function MezgebuPortfolio({ onEnterApp, lang }: MezgebuPortfolioProps) {
  const t = (key: string) => DICTIONARY[lang]?.[key] || key;

  return (
    <div id="portfolio-interactive-hub" className="space-y-20 pb-20">
      {/* Dynamic Hero Section */}
      <section id="hero-showcase" className="relative text-center py-20 px-4 overflow-hidden rounded-3xl bg-slate-900 border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-500 border border-slate-800 text-[11px] font-bold tracking-wider uppercase">
            🚀 PROMOTING LOCAL CULTURE & TOURISM
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            Welcome to <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-teal-400 bg-clip-text text-transparent">Spark</span>
          </h1>

          <p className="text-base text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
            The next-generation, secure, ad-supported live streaming and social ecosystem for cultural heritage, configured with PCI-DSS payouts and robust biometric safety compliance.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="hero-launch-app-btn"
              onClick={onEnterApp}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer text-sm shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>{t("enterApp")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <a
              href="#about-me"
              className="px-6 py-3.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-200 hover:text-white rounded-xl transition-all text-sm font-semibold flex items-center justify-center"
            >
              Explore Vision Portfolio
            </a>
          </div>
        </div>

        {/* Minimal Graphic Canvas Simulation */}
        <div className="mt-12 max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-indigo-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 text-left">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest font-bold">Spark Broadcaster Console v2.0</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl relative overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-2 right-2 animate-ping" />
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">STREAM #1</span>
                <div className="text-xs font-bold text-white mt-1">Lalibela Rock Churches</div>
                <div className="text-[10px] text-amber-500 mt-2 font-mono">1,420 watching</div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">STREAM #2</span>
                <div className="text-xs font-bold text-white mt-1">Buna Coffee Ceremony</div>
                <div className="text-[10px] text-teal-400 mt-2 font-mono">980 watching</div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">REGIONAL COMPLIANCE</span>
                <div className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center gap-1">✓ FACE ID SECURED</div>
                <div className="text-[9px] text-slate-500 mt-2">Payout active via Telebirr & CBE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about-me" className="scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-2 bg-amber-500/10 rounded-2xl blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600"
              alt="Mezgebu Debeli portrait sketch"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/5] object-cover rounded-2xl border border-slate-800 shadow-xl relative z-10 text-xs"
            />
            <div className="absolute -bottom-4 -right-4 bg-slate-950 border border-slate-800 p-4 rounded-xl z-20 text-left shadow-lg">
              <span className="text-2xl font-bold text-amber-500 block leading-tight">6+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Years AI & Web Architectural Experience</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">CREATIVE VISION</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Mezgebu Debeli</h2>
            <p className="text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded-xl p-3 inline-block font-mono">
              Role: Principal Software Developer & AI Systems Architect of Spark
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              I am a visual engineer and systems designer passionate about writing immersive cultural technologies. By utilizing elegant microservices and computer vision models, my goal is to highlight regional beauty, tourism hotspots, and preserve historical treasures safely.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-900">
                <Compass className="w-5 h-5 text-amber-500 mb-2" />
                <span className="text-xs font-bold text-white block">Tourism Promotion</span>
                <span className="text-[10px] text-slate-500 block mt-1 leading-normal">Building safe ad-supported models highlighting horn heritage zones.</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-900">
                <ShieldCheck className="w-5 h-5 text-teal-400 mb-2" />
                <span className="text-xs font-bold text-white block">Safe Compliance</span>
                <span className="text-[10px] text-slate-500 block mt-1 leading-normal">Implementing Face ID device binding cycles validated every 30 days.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-24 text-left">
        <div className="mb-8">
          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">PORTFOLIO</span>
          <h2 className="text-3xl font-bold text-white mt-1.5 tracking-tight">Core Active Projects</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Pioneering digital solutions to facilitate cultural sharing, secure banking withdrawals, and live video feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="p-2.5 bg-slate-950 rounded-xl text-amber-500 border border-slate-850 inline-block mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-md font-bold text-white group-hover:text-amber-400 transition-colors">Spark Live Terminal Console</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Provides local livestreaming support promoting historic tourism (Lalibela rock churches, coffee brewing ceremonies), integrating real-time viewer tickers, encrypted private messaging, and filter tag pools.
            </p>
            <div className="flex gap-2 mt-4 flex-wrap text-[10px] font-mono">
              <span className="bg-slate-950 px-2 py-0.5 rounded text-amber-500">React 19</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded text-teal-400">Vite</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded text-indigo-400">Tailwind CSS</span>
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="p-2.5 bg-slate-950 rounded-xl text-teal-400 border border-slate-850 inline-block mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-md font-bold text-white group-hover:text-teal-400 transition-colors">PCI-DSS African Payout Link</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              An interactive regional payout module supporting local transfer agencies (Commercial Bank of Ethiopia (CBE), Telebirr, Awash, Abyssinia) and international channels (PayPal, Virtual MasterCard) for creators.
            </p>
            <div className="flex gap-2 mt-4 flex-wrap text-[10px] font-mono">
              <span className="bg-slate-950 px-2 py-0.5 rounded text-amber-500">Local Payout Services</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded text-teal-400">Secure Web Gateway</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Expertise Section */}
      <section id="ai-expertise" className="scroll-mt-24 text-left p-8 bg-slate-900 border border-slate-850 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="max-w-3xl space-y-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest block">DEEP CORE SKILLS</span>
            <h2 className="text-3xl font-bold text-white mt-1.5 tracking-tight">AI & Compliance Expertise</h2>
            <p className="text-xs text-slate-400 mt-1">
              Safeguarding livestream content and verifying identities with state-of-the-art neural modules and regional rules engines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900/80">
              <BrainCircuit className="w-5 h-5 text-amber-500 mb-2" />
              <span className="text-xs font-bold text-white block">Face ID Device Binding</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Biometrics capturing engine verified once in registration and checked on a recurring 30-day policy.
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900/80">
              <Users className="w-5 h-5 text-teal-400 mb-2" />
              <span className="text-xs font-bold text-white block">Moderation Filters</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Ad-supported, family-friendly streaming environment controlled via automated text and comment filters.
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900/80">
              <Award className="w-5 h-5 text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-white block">Automatic Translation</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Multilingual interface dictionaries supporting Amharic, Oromo, English, Arabic, Chinese, and Tagalog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="scroll-mt-24 text-left">
        <div className="mb-8">
          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">REVIEWS & AUDITS</span>
          <h2 className="text-3xl font-bold text-white mt-1.5 tracking-tight">Ecosystem Testimonials</h2>
          <p className="text-xs text-slate-400 mt-1">
            Read what community curators, regional officers, and world tourists think about Mezgebu's vision for Spark.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex gap-0.5 text-amber-500 mb-3.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Finding a streaming system that integrates Telebirr and Awash so smoothly is wonderful for local content monetization. Spark has unlocked incredible potential for Ethiopian tourism guides!"
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-900">
              <div className="text-xs font-bold text-white">Sintayehu Kebede</div>
              <div className="text-[9px] text-slate-500 font-mono">ID: TOUR-9022</div>
            </div>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex gap-0.5 text-amber-500 mb-3.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The 30-day Face ID biometric requirement sounded strict at first, but it completely weeds out bad actors. The streaming and comments quality on cultural channels is pristine."
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-900">
              <div className="text-xs font-bold text-white">Netsanet Shiferaw</div>
              <div className="text-[9px] text-slate-500 font-mono">Compliance Officer</div>
            </div>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex gap-0.5 text-amber-500 mb-3.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The instant backpack badges and level system are super engaging. It feels like a beautiful game where we support real guides and cultural specialists in the Horn region."
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-900">
              <div className="text-xs font-bold text-white">Sarah Wang</div>
              <div className="text-[9px] text-slate-500 font-mono">Global Backpacker</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Segment */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-500/20 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Ready to explore or stream your local culture?</h3>
        <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
          Start as a tourist or register a creator profile right away. Experience safe, compliant interaction.
        </p>
        <button
          id="cta-launch-button animate-pulse"
          onClick={onEnterApp}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-1.5"
        >
          <HeartHandshake className="w-4 h-4" /> Start Spark App Sandbox
        </button>
      </div>
    </div>
  );
}
