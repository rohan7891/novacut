import React from 'react';
import { Logo } from '../components/brand/Logo';
import { 
  Play, 
  Sparkles, 
  Film, 
  Download, 
  Languages, 
  Wand2, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Scissors, 
  Volume2, 
  Smartphone, 
  Monitor, 
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Zap,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onStartEditing: () => void;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartEditing,
  onNavigate,
  onOpenAuth,
}) => {
  const faqs = [
    {
      q: 'Is NovaCut really 100% free at launch?',
      a: 'Yes! Every single feature—including 4K rendering, multi-track timeline, AI script writing, Bengali and English auto-captions, and royalty-free music—is 100% free for all registered creators. There are no paywalls and no forced watermarks.'
    },
    {
      q: 'Does NovaCut add a watermark to my exported videos?',
      a: 'Never. Unlike other editors that hold your high-resolution exports hostage with giant watermarks, NovaCut delivers pristine, watermark-free renders directly to your computer.'
    },
    {
      q: 'Can I generate subtitles in Bengali as well as English?',
      a: 'Absolutely! NovaCut features native dual-language subtitle generation and editing. You can auto-generate Bengali or English captions, fine-tune timestamps, and export standard .SRT subtitle files.'
    },
    {
      q: 'Does video rendering happen in my browser or in the cloud?',
      a: 'NovaCut uses high-performance HTML5 Canvas and the Web Audio API to compose and render your edits locally in your browser. This means instant turnaround with zero cloud wait queues.'
    },
    {
      q: 'What aspect ratios are supported?',
      a: 'NovaCut provides one-click presets for 16:9 (YouTube & widescreen), 9:16 (TikTok, YouTube Shorts, Instagram Reels), 1:1 (Square), 4:5 (Instagram Feed), and 3:4.'
    }
  ];

  return (
    <div className="w-full bg-[#070913] text-slate-100 overflow-hidden select-none">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Glowing backdrop halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-blue-600/20 to-cyan-500/20 blur-[120px] pointer-events-none rounded-full" />

        {/* Free Launch Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/40 text-cyan-300 text-xs font-bold mb-6 shadow-lg shadow-purple-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Launch Celebration: All Features & 4K Exports 100% Free</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-5xl leading-[1.1] mb-6">
          Create Beyond Limits with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300">
            AI Video Mastery.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed font-normal">
          The next-generation browser video studio with multi-track timeline, Bengali & English auto-captions, Gemini AI script assistants, and real watermark-free 4K export.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onStartEditing}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-extrabold text-base hover:opacity-95 shadow-xl shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
            <span>Start Editing Free</span>
            <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded uppercase">No Card Required</span>
          </button>

          <button
            onClick={() => onNavigate('templates')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Templates</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </button>
        </div>

        {/* Trust points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Watermark Ever</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Real 1080p & 4K Export</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bengali & English Auto-Captions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Runs 100% in Browser</span>
          </div>
        </div>

        {/* Interactive Studio Preview Mockup */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl p-2 bg-gradient-to-b from-purple-500/30 via-slate-800/40 to-transparent border border-purple-500/30 shadow-2xl shadow-purple-950/40 relative group">
          <div className="w-full rounded-2xl bg-[#090D16] border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            
            {/* Fake Studio Top Bar */}
            <div className="h-10 bg-[#0B0F19] border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-semibold text-slate-200">NovaCut Studio — Cyberpunk_Showcase_4K.proj</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  Ready to Render
                </span>
              </div>
            </div>

            {/* Fake Editor Center & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-4 h-72 md:h-96 bg-[#070913]">
              
              {/* Fake Sidebar */}
              <div className="hidden md:block p-3 border-r border-slate-800 bg-[#080B14] space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/40 text-purple-300 font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Auto-Captions</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  <span>বাংলা Subtitles</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gemini Voiceover</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5 text-rose-400" />
                  <span>Silence Cut AI</span>
                </div>
              </div>

              {/* Fake Canvas Screen */}
              <div className="md:col-span-3 p-4 flex flex-col items-center justify-center relative bg-gradient-to-br from-[#0B0F19] to-black">
                <div className="w-full max-w-lg aspect-video rounded-xl bg-gradient-to-tr from-purple-950 via-slate-900 to-cyan-950 border border-purple-500/40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 font-mono text-[10px] text-cyan-300">
                    4K • 60 FPS
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wide drop-shadow-md">
                    CREATE BEYOND LIMITS
                  </h3>
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-black/80 border border-purple-500/50 text-xs font-bold text-amber-300 shadow-md">
                    "নোভাকাট স্টুডিও — পেশাদার ভিডিও এডিটিং এখন সম্পূর্ণ ফ্রি"
                  </div>
                </div>
              </div>
            </div>

            {/* Fake Timeline strip */}
            <div className="h-20 bg-[#080B14] border-t border-slate-800 p-2 flex flex-col justify-center gap-1.5">
              <div className="w-full h-4 rounded bg-purple-900/60 border border-purple-500/40 flex items-center px-2 text-[9px] text-purple-200">
                Text & Subtitles Track: [00:00 - 00:16]
              </div>
              <div className="w-full h-5 rounded bg-blue-900/60 border border-blue-500/40 flex items-center px-2 text-[9px] text-blue-200">
                Main Video: Cyberpunk_4K_Visuals.mp4
              </div>
              <div className="w-full h-4 rounded bg-emerald-900/60 border border-emerald-500/40 flex items-center px-2 text-[9px] text-emerald-200">
                Audio BGM: Cybernetic_Pulse.wav (Stereo)
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 border-t border-slate-800/80 bg-[#05070E] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">
            Built for Modern Creators
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Professional Editing. Zero Obstacles.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything you need to produce cinematic content for YouTube, Shorts, TikTok, and commercial campaigns without paying subscription fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multitrack Timeline</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Layer videos, audio soundscapes, animated text cards, and sticker graphics. Split at playhead, trim handles, and drag anywhere with magnetic snapping.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-purple-300 font-semibold flex items-center gap-1">
              <span>Unlimited tracks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/30">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bengali & English Auto-Captions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate word-by-word synchronized subtitles in English and Bengali. Customize font size, colors, stroke, and download standard .SRT files with one click.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-cyan-300 font-semibold flex items-center gap-1">
              <span>Dual-language engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gemini AI Studio Suite</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate high-retention video scripts, viral YouTube titles, SEO tags, realistic text-to-speech voiceovers, and detect dead-air silence gaps automatically.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-blue-300 font-semibold flex items-center gap-1">
              <span>Powered by Gemini 3.8</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real 4K & 1080p Canvas Exporter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never fake downloads. NovaCut compiles all video elements, text animations, audio mixing, and color grading into high-resolution WebM and MP4 files directly to your device.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-emerald-300 font-semibold flex items-center gap-1">
              <span>Zero watermark guarantee</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Social Presets & Aspect Ratios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Switch instantly between 16:9 widescreen, 9:16 Shorts/Reels/TikTok, 1:1 Square, and 4:5 vertical feeds with intelligent framing.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-amber-300 font-semibold flex items-center gap-1">
              <span>Multi-platform ready</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure Admin Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in future-ready subscription and entitlement engine. Super Admins can configure plans, quotas, and audit logs without rebuilding the platform.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-rose-300 font-semibold flex items-center gap-1">
              <span>Admin control panel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
            Frictionless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Idea to Export in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 rounded-3xl bg-[#090D16] border border-slate-800 text-center relative">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-sm shadow-md shadow-purple-500/30">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Import or Pick a Template</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag in your footage, audio, and graphics, or start from one of our pre-built vlog, gaming, or viral Shorts templates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#090D16] border border-slate-800 text-center relative">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-sm shadow-md shadow-blue-500/30">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">Edit with AI Superpowers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cut clips, generate Bengali & English captions, synthesize AI voiceovers, cut dead air, and grade colors with cinematic filters.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#090D16] border border-slate-800 text-center relative">
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-900 font-extrabold flex items-center justify-center mx-auto mb-4 text-sm shadow-md shadow-cyan-500/30">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Export in Crisp 4K Free</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Render in 1080p or 4K with custom frame rates and zero watermarks. Download straight to your computer instantly.
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 border-t border-slate-800/80 bg-[#05070E] px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">
            Questions & Answers
          </span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-cyan-900/40 border border-purple-500/30 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Create Beyond Limits?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Join thousands of creators producing viral videos with NovaCut Studio. No credit card, no paywall, no watermark.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartEditing}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-extrabold text-sm sm:text-base hover:opacity-95 shadow-xl shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch NovaCut Studio Now</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
