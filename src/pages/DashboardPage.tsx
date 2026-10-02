import React, { useState } from 'react';
import { Project, User } from '../types';
import { 
  Plus, 
  Film, 
  Trash2, 
  Copy, 
  Download, 
  HardDrive, 
  Sparkles, 
  Calendar, 
  Clock, 
  Play,
  Monitor,
  Smartphone,
  Square,
  ChevronRight
} from 'lucide-react';
import { getExportHistory } from '../utils/storage';

interface DashboardPageProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onCreateNewProject: (aspectRatio: '16:9' | '9:16' | '1:1') => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  user: User;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  onOpenProject,
  onCreateNewProject,
  onDuplicateProject,
  onDeleteProject,
  user,
}) => {
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const exportHistory = getExportHistory();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] text-slate-100 p-4 sm:p-8 max-w-7xl mx-auto space-y-10 select-none">
      
      {/* Top Banner / Welcome Cluster */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Creator Dashboard</h1>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
              VIP Unlocked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome back, <strong className="text-slate-200">{user.name}</strong>. Manage your video timelines, templates, and export history.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewProjectModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Video Project</span>
          </button>
        </div>
      </div>

      {/* Storage and Usage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Active Projects</span>
            <span className="text-lg font-black text-white">{projects.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Completed Exports</span>
            <span className="text-lg font-black text-white">{exportHistory.length || 3}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Cloud Storage Used</span>
            <span className="text-lg font-black text-white">1.4 GB / 10 GB</span>
          </div>
        </div>
      </div>

      {/* MY PROJECTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>My Projects</span>
            <span className="text-xs font-mono text-slate-500">({projects.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const dateStr = new Date(proj.updatedAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={proj.id}
                className="rounded-2xl bg-[#090D16] border border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col group shadow-lg"
              >
                {/* Thumbnail Preview Area */}
                <div
                  onClick={() => onOpenProject(proj.id)}
                  className="w-full h-40 bg-gradient-to-tr from-purple-950/70 via-slate-900 to-cyan-950/70 relative cursor-pointer flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {/* Center Play Button on hover */}
                  <div className="w-12 h-12 rounded-full bg-purple-600/80 group-hover:bg-purple-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform relative z-10">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>

                  {/* Aspect Ratio Badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-cyan-300">
                    {proj.aspectRatio}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
                    {proj.duration.toFixed(1)}s
                  </div>
                </div>

                {/* Project Details Footer */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3
                      onClick={() => onOpenProject(proj.id)}
                      className="text-sm font-bold text-white hover:text-purple-400 cursor-pointer transition-colors truncate"
                      title={proj.title}
                    >
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span>{proj.tracks.length} tracks</span>
                      </span>
                      <span>•</span>
                      <span>Edited {dateStr}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => onOpenProject(proj.id)}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <span>Open Editor</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDuplicateProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Duplicate Project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPORT HISTORY SECTION */}
      {exportHistory.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            <span>Recent Video Exports</span>
          </h2>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden text-xs">
            <table className="w-full text-left divide-y divide-slate-800">
              <thead className="bg-[#0A0E18] text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Resolution</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {exportHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-white">{item.projectName}</td>
                    <td className="px-4 py-3 font-mono text-cyan-300">{item.resolution}</td>
                    <td className="px-4 py-3 uppercase font-mono">{item.format}</td>
                    <td className="px-4 py-3 font-mono">{(item.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</td>
                    <td className="px-4 py-3 text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold">Ready (Watermark-Free)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {newProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
          <div className="w-full max-w-md bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-white">Create New Video Project</h3>
              <p className="text-xs text-slate-400 mt-1">Select your target platform format to begin editing.</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { ratio: '16:9', title: '16:9 Landscape', desc: 'YouTube, Web, PC, Television', icon: Monitor },
                { ratio: '9:16', title: '9:16 Vertical', desc: 'TikTok, Shorts, Reels, Stories', icon: Smartphone },
                { ratio: '1:1', title: '1:1 Square', desc: 'Instagram Feed, Carousel, LinkedIn', icon: Square },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.ratio}
                    onClick={() => {
                      onCreateNewProject(opt.ratio as any);
                      setNewProjectModalOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-left flex items-center gap-3.5 group transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-950/60 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300">{opt.title}</h4>
                      <p className="text-[11px] text-slate-400">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setNewProjectModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
