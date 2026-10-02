import React from 'react';
import { AspectRatio, Project } from '../../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Scissors, 
  Trash2, 
  Download, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Smartphone, 
  Monitor, 
  Square,
  CheckCircle2,
  Copy
} from 'lucide-react';

interface TopToolbarProps {
  project: Project;
  onUpdateTitle: (title: string) => void;
  onUpdateAspectRatio: (ratio: AspectRatio) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSplitClip: () => void;
  onDuplicateClip: () => void;
  onDeleteClip: () => void;
  hasSelectedClip: boolean;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onSave: () => void;
  lastSavedTime: string;
  onOpenExport: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  project,
  onUpdateTitle,
  onUpdateAspectRatio,
  isPlaying,
  onTogglePlay,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSplitClip,
  onDuplicateClip,
  onDeleteClip,
  hasSelectedClip,
  zoom,
  onZoomChange,
  onSave,
  lastSavedTime,
  onOpenExport,
}) => {
  const aspectRatios: { ratio: AspectRatio; label: string; icon: any }[] = [
    { ratio: '16:9', label: '16:9 Landscape', icon: Monitor },
    { ratio: '9:16', label: '9:16 Shorts/Reels', icon: Smartphone },
    { ratio: '1:1', label: '1:1 Square', icon: Square },
    { ratio: '4:5', label: '4:5 Portrait', icon: Smartphone },
  ];

  return (
    <div className="w-full bg-[#0B0F19] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap select-none">
      
      {/* Left: Project title & Aspect Ratio */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="bg-transparent border border-transparent hover:border-slate-700 focus:border-purple-500 rounded-lg px-2.5 py-1 text-sm font-semibold text-white focus:outline-none focus:bg-slate-900 transition-colors w-48 sm:w-60 truncate"
            title="Click to rename project"
          />
        </div>

        {/* Aspect Ratio Picker */}
        <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
          {aspectRatios.map((item) => {
            const Icon = item.icon;
            const isSelected = project.aspectRatio === item.ratio;
            return (
              <button
                key={item.ratio}
                onClick={() => onUpdateAspectRatio(item.ratio)}
                title={item.label}
                className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.ratio}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center: Playback & Timeline Edit Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={`p-1.5 rounded-lg border transition-colors ${
            canUndo
              ? 'text-slate-200 border-slate-800 hover:bg-slate-800'
              : 'text-slate-600 border-slate-900 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={`p-1.5 rounded-lg border transition-colors ${
            canRedo
              ? 'text-slate-200 border-slate-800 hover:bg-slate-800'
              : 'text-slate-600 border-slate-900 cursor-not-allowed'
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Split Clip Button */}
        <button
          onClick={onSplitClip}
          disabled={!hasSelectedClip}
          title="Split Clip at Playhead (S)"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            hasSelectedClip
              ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
              : 'text-slate-600 border-slate-900 cursor-not-allowed'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Split</span>
        </button>

        {/* Duplicate Clip Button */}
        <button
          onClick={onDuplicateClip}
          disabled={!hasSelectedClip}
          title="Duplicate Clip"
          className={`p-1.5 rounded-lg border transition-colors ${
            hasSelectedClip
              ? 'text-slate-200 border-slate-800 hover:bg-slate-800'
              : 'text-slate-600 border-slate-900 cursor-not-allowed'
          }`}
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Delete Clip Button */}
        <button
          onClick={onDeleteClip}
          disabled={!hasSelectedClip}
          title="Delete Clip (Delete)"
          className={`p-1.5 rounded-lg border transition-colors ${
            hasSelectedClip
              ? 'text-rose-400 border-slate-800 hover:bg-rose-950/40 hover:border-rose-800'
              : 'text-slate-600 border-slate-900 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Timeline Zoom */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            className="text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-8 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            className="text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Save & Export */}
      <div className="flex items-center gap-2.5">
        {/* Autosave status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px]">{lastSavedTime ? `Saved ${lastSavedTime}` : 'Autosaved'}</span>
        </div>

        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
          title="Save Project to Cloud/Local"
        >
          <Save className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Real Export Button (No paywall, 100% free!) */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs hover:opacity-95 shadow-md shadow-purple-500/20 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Video</span>
          <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-mono">Free</span>
        </button>
      </div>

    </div>
  );
};
