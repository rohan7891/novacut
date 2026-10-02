import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Command, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  Loader2
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email || 'creator@novacut.app',
          subject: subject || 'General Video Studio Inquiry',
          message,
        }),
      });
      const data = await res.json();
      setSubmittedTicket(data.ticket);
      setMessage('');
      setSubject('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Video Preview' },
    { key: 'Arrow Left', desc: 'Step backward 1.0 second' },
    { key: 'Arrow Right', desc: 'Step forward 1.0 second' },
    { key: 'S', desc: 'Split selected clip at current playhead' },
    { key: 'Delete / Backspace', desc: 'Delete selected clip from timeline' },
    { key: 'Ctrl / Cmd + Z', desc: 'Undo previous timeline change' },
    { key: 'Ctrl / Cmd + Y', desc: 'Redo previously undone change' },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] text-slate-100 p-4 sm:p-8 max-w-5xl mx-auto space-y-12 select-none">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Creator Help & Support</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Everything you need to master NovaCut Studio. Submit questions, review shortcuts, or explore our knowledge base.
        </p>
      </div>

      {/* Grid: Support Form + Keyboard Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Support Ticket Submission Form */}
        <div className="p-6 rounded-3xl bg-[#090D16] border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold">Contact Studio Engineers</h2>
          </div>

          {submittedTicket ? (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">Ticket Submitted Successfully!</h4>
                <p className="text-xs text-slate-300 mt-1">Ticket ID: <span className="font-mono text-cyan-300 font-bold">{submittedTicket.id}</span></p>
              </div>
              <p className="text-[11px] text-slate-400">
                Our support team and admin desk review tickets continuously. You will receive an update in the Admin Panel / email.
              </p>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="text-xs font-semibold text-purple-400 hover:underline pt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Email</label>
                <input
                  type="email"
                  placeholder="creator@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Subject</label>
                <input
                  type="text"
                  placeholder="Feature request, bug, or editing question..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your question or feedback in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 active:scale-95 transition-all"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Support Ticket</span>
              </button>
            </form>
          )}
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="p-6 rounded-3xl bg-[#090D16] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Command className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold">Studio Keyboard Shortcuts</h2>
          </div>
          <p className="text-xs text-slate-400">
            Speed up your cutting workflow with intuitive editing hotkeys.
          </p>

          <div className="divide-y divide-slate-800/80">
            {shortcuts.map((sc, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-300">{sc.desc}</span>
                <kbd className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] font-bold text-cyan-300">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
