import React, { useState } from 'react';
import { User } from '../types';
import { 
  User as UserIcon, 
  ShieldCheck, 
  HardDrive, 
  Settings, 
  Save, 
  CheckCircle2, 
  Download,
  Sliders,
  Sparkles
} from 'lucide-react';
import { getExportHistory } from '../utils/storage';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [defaultResolution, setDefaultResolution] = useState('1080p');
  const [defaultRatio, setDefaultRatio] = useState('16:9');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const exportHistory = getExportHistory();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      avatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] text-slate-100 p-4 sm:p-8 max-w-4xl mx-auto space-y-8 select-none">
      
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Creator Profile & Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your identity, personal cloud preferences, and default rendering presets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Account Card */}
        <div className="p-6 rounded-3xl bg-[#090D16] border border-slate-800 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full rounded-[14px] bg-[#070913] overflow-hidden flex items-center justify-center text-2xl font-bold text-white">
              {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : name.charAt(0)}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
          </div>

          <div className="flex flex-col gap-2 w-full pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Account Role</span>
              <span className="font-bold uppercase text-purple-400">{user.role}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Subscription Tier</span>
              <span className="font-bold text-cyan-300">VIP (100% Free)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Storage Quota</span>
              <span className="font-mono text-emerald-400">1.4 GB / 10 GB</span>
            </div>
          </div>
        </div>

        {/* Right Form: Settings */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#090D16] border border-slate-800 space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Account Preferences</span>
              </h3>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Preferences saved!</span>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Default Resolution</label>
                <select
                  value={defaultResolution}
                  onChange={(e) => setDefaultResolution(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="1080p">1080p Full HD (Recommended)</option>
                  <option value="4k">4K Ultra HD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Default Aspect Ratio</label>
                <select
                  value={defaultRatio}
                  onChange={(e) => setDefaultRatio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="16:9">16:9 Landscape (YouTube)</option>
                  <option value="9:16">9:16 Vertical (Shorts/Reels)</option>
                  <option value="1:1">1:1 Square (Instagram)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
