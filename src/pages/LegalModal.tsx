import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-white">
          <ShieldCheck className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">
            {type === 'terms' ? 'NovaCut Terms of Service' : 'NovaCut Privacy Policy'}
          </h2>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white">1. Creator Ownership Guarantee</h4>
            <p>
              You retain 100% full legal ownership, copyright, and distribution rights to all video files, audio recordings, images, titles, and exported renders created within NovaCut. NovaCut claims no ownership over your creative output.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white">2. Launch Mode & Free Access</h4>
            <p>
              At launch, all editing features, template catalogs, AI subtitle tools, and 4K canvas export pipelines are provided free of charge without mandatory payment locks or watermarks.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white">3. Local Processing & Privacy</h4>
            <p>
              NovaCut renders videos directly inside your browser via HTML5 Canvas and Web Audio APIs. Your raw source video frames remain private on your device unless you explicitly opt into cloud background rendering.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white">4. AI Features & External APIs</h4>
            <p>
              When utilizing AI script generation, subtitle alignment, or text-to-speech services, text prompts are processed through server-side Gemini API endpoints without exposing credentials to the browser client.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
