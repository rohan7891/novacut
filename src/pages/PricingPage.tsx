import React from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  Zap,
  Lock,
  Unlock
} from 'lucide-react';

interface PricingPageProps {
  onStartEditing: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onStartEditing }) => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] text-slate-100 p-4 sm:p-8 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Launch Guarantee: All Features 100% Free for Everyone</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Create Beyond Limits. Zero Paywalls.
        </h1>
        <p className="text-xs sm:text-base text-slate-400 leading-relaxed">
          At NovaCut, we believe every creator deserves unrestricted access to professional multitrack video editing, AI subtitles, and 4K exports. No credit cards, no locked buttons, no forced watermarks.
        </p>
      </div>

      {/* Hero Free Plan Highlight Card */}
      <div className="max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 shadow-2xl shadow-purple-500/20">
        <div className="rounded-[23px] bg-[#090D16] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                Current Active Tier
              </span>
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" />
                <span>All Features Unlocked</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">NovaCut VIP Studio (Launch Mode)</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every registered user receives automatic, permanent VIP status granting full capability across all editing tools, AI modules, and canvas rendering pipelines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited 1080p & 4K Exports</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Watermark Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bengali & English Auto-Captions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gemini AI Script & Voiceover</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Track Video, Audio & Text</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All Templates & Color Grades</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#070913] border border-slate-800 text-center w-full md:w-64 space-y-4">
            <div>
              <span className="text-4xl sm:text-5xl font-black text-white">$0</span>
              <span className="text-slate-400 text-xs block mt-1">Free Forever at Launch</span>
            </div>

            <button
              onClick={onStartEditing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/25 active:scale-95 transition-all"
            >
              Start Editing Now
            </button>
            <span className="text-[10px] text-slate-500">Instant browser launch • No signup required</span>
          </div>
        </div>
      </div>

      {/* FUTURE SUBSCRIPTION ARCHITECTURE PREVIEW */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Configurable Subscription Architecture</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Future Plan Architecture (Disabled at Launch)
          </h3>
          <p className="text-xs text-slate-400">
            NovaCut is pre-architected with enterprise-grade entitlement models. Super Admins can configure and activate future paid tiers through the Admin Panel if desired, without altering existing free access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-4 opacity-75">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Future Tier 1</span>
              <h4 className="text-lg font-bold text-white mt-1">Free Starter</h4>
              <p className="text-xs text-slate-400 mt-2">Essential editing tools for hobbyists and students.</p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">$0</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <p>• Standard timeline editing</p>
              <p>• 1080p WebM/MP4 export</p>
              <p>• 10 GB cloud storage</p>
            </div>
          </div>

          {/* Plan 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-4 opacity-75">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Future Tier 2</span>
              <h4 className="text-lg font-bold text-white mt-1">Pro Creator</h4>
              <p className="text-xs text-slate-400 mt-2">Dedicated render node for daily YouTube & TikTok creators.</p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">$19</span>
                <span className="text-xs text-slate-500"> / month (Inactive)</span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <p>• 4K Ultra HD rendering</p>
              <p>• Unlimited AI speech-to-text</p>
              <p>• 50 GB cloud storage</p>
            </div>
          </div>

          {/* Plan 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-4 opacity-75">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Future Tier 3</span>
              <h4 className="text-lg font-bold text-white mt-1">Studio / Agency</h4>
              <p className="text-xs text-slate-400 mt-2">Shared workspaces and high-volume background pipelines.</p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">$49</span>
                <span className="text-xs text-slate-500"> / month (Inactive)</span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <p>• Multi-seat creator licenses</p>
              <p>• Centralized asset brand kits</p>
              <p>• 200 GB cloud storage</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
