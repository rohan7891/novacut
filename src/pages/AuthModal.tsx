import React, { useState } from 'react';
import { User } from '../types';
import { Logo } from '../components/brand/Logo';
import { X, Lock, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      if (isResetPassword) {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setInfoMsg(data.message || 'Password reset link sent to your email.');
        return;
      }

      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? { email, name, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'skm958731@gmail.com', password: 'admin' }),
      });
      const data = await res.json();
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Admin sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <Logo size="md" showText={true} />
          <h3 className="text-xl font-bold text-white pt-2">
            {isRegister ? 'Create Your Free Studio Account' : 'Welcome Back Creator'}
          </h3>
          <p className="text-xs text-slate-400">
            {isRegister
              ? 'Join NovaCut with instant permanent VIP access to all 4K tools.'
              : 'Sign in to access your saved timelines and custom presets.'}
          </p>
        </div>

        {/* Error or Info Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
            {infoMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && !isResetPassword && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="creator@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {!isResetPassword && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => { setIsResetPassword(true); setErrorMsg(''); setInfoMsg(''); }}
                    className="text-[10px] text-purple-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isResetPassword ? 'Send Password Reset Link' : isRegister ? 'Register Free Account' : 'Sign In'}
          </button>
        </form>

        {isResetPassword ? (
          <div className="text-center text-xs text-slate-400">
            <button
              onClick={() => { setIsResetPassword(false); setErrorMsg(''); setInfoMsg(''); }}
              className="text-purple-400 hover:underline font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Quick Admin Access Button */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={handleAdminQuickLogin}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Sign In as Super Admin (skm958731@gmail.com)</span>
              </button>
            </div>

            <div className="text-center text-xs text-slate-400">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); setInfoMsg(''); }}
                className="text-purple-400 hover:underline font-semibold"
              >
                {isRegister ? 'Sign In' : 'Sign Up Free'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
