import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Heart, Sparkles, Youtube, Twitter, Instagram, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#05070E] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand descriptor */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" showText={true} showTagline={true} />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
              NovaCut is a next-generation browser video editing suite. Empowering creators with high-speed multitrack timelines, AI speech-to-text, Bengali & English subtitles, and watermark-free 4K exports.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Mode: All Features 100% Free</span>
              </span>
            </div>
          </div>

          {/* Studio Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Studio</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('editor')} className="hover:text-purple-400 transition-colors">
                  Web Video Editor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-purple-400 transition-colors">
                  Template Library
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tools')} className="hover:text-purple-400 transition-colors">
                  AI Script & Voiceover
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-purple-400 transition-colors">
                  Cloud Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Advanced Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300">Bengali & English Subtitles</span>
              </li>
              <li>
                <span className="text-slate-300">Silence Gap Auto-Cutter</span>
              </li>
              <li>
                <span className="text-slate-300">YouTube, Shorts, TikTok Presets</span>
              </li>
              <li>
                <span className="text-slate-300">Real 4K & 1080p Canvas Exporter</span>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-purple-400 transition-colors">
                  Future Plans & Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-purple-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-purple-400 transition-colors">
                  Creator Support & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NovaCut AI Video Studio. Built for creators worldwide. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for frictionless video storytelling.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
