import React from 'react';
import { Clip, Project } from '../../types';
import { 
  Sliders, 
  Type, 
  Volume2, 
  RotateCw, 
  Move, 
  Maximize2, 
  Layers, 
  Sparkles,
  Info,
  Gauge
} from 'lucide-react';

interface PropertiesInspectorProps {
  selectedClip: Clip | null;
  onUpdateClip: (clip: Clip) => void;
  project: Project;
}

export const PropertiesInspector: React.FC<PropertiesInspectorProps> = ({
  selectedClip,
  onUpdateClip,
  project,
}) => {
  if (!selectedClip) {
    return (
      <div className="w-72 sm:w-80 h-full bg-[#090D16] border-l border-slate-800 p-4 select-none flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Project Inspector</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Aspect Ratio</span>
              <span className="font-mono font-bold text-cyan-300">{project.aspectRatio}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Duration</span>
              <span className="font-mono font-bold text-purple-300">{project.duration.toFixed(1)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Timeline Tracks</span>
              <span className="font-mono text-slate-200">{project.tracks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Clips</span>
              <span className="font-mono text-slate-200">{project.clips.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Subtitles Count</span>
              <span className="font-mono text-amber-300">{project.subtitles?.length || 0}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-purple-300">💡 Quick Tip</p>
            <p className="leading-relaxed">
              Click any clip in the bottom timeline to reveal its position, speed, opacity, color grading, and animation parameters.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-center py-2 border-t border-slate-800/80">
          All features unlocked for all users.
        </div>
      </div>
    );
  }

  // Helper updates
  const updateProp = (key: keyof Clip, val: any) => {
    onUpdateClip({ ...selectedClip, [key]: val });
  };

  const updateFilter = (filterKey: string, val: any) => {
    const existing = selectedClip.filter || { brightness: 100, contrast: 100, saturation: 100 };
    onUpdateClip({
      ...selectedClip,
      filter: { ...existing, [filterKey]: val }
    });
  };

  return (
    <div className="w-72 sm:w-80 h-full bg-[#090D16] border-l border-slate-800 p-4 select-none overflow-y-auto space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Clip Inspector</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 text-cyan-300 border border-slate-800">
          {selectedClip.type}
        </span>
      </div>

      {/* Clip Name */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-400">Clip Name</label>
        <input
          type="text"
          value={selectedClip.name}
          onChange={(e) => updateProp('name', e.target.value)}
          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* TEXT SPECIFIC PROPERTIES */}
      {selectedClip.type === 'text' && (
        <div className="space-y-3.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
            <Type className="w-3.5 h-3.5" />
            <span>Typography & Content</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Text Content</label>
            <textarea
              rows={2}
              value={selectedClip.text || ''}
              onChange={(e) => updateProp('text', e.target.value)}
              className="w-full bg-[#070913] border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Font Size ({selectedClip.fontSize || 36}px)</label>
              <input
                type="range"
                min="16"
                max="80"
                value={selectedClip.fontSize || 36}
                onChange={(e) => updateProp('fontSize', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Animation</label>
              <select
                value={selectedClip.animation || 'none'}
                onChange={(e) => updateProp('animation', e.target.value)}
                className="w-full bg-[#070913] border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
              >
                <option value="none">None</option>
                <option value="pop">Pop Zoom</option>
                <option value="slide-up">Slide Up</option>
                <option value="fade">Fade In</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedClip.textColor || '#FFFFFF'}
                  onChange={(e) => updateProp('textColor', e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <span className="text-[11px] font-mono text-slate-300">{selectedClip.textColor || '#FFFFFF'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Box Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedClip.backgroundColor === 'transparent' ? '#000000' : (selectedClip.backgroundColor || '#0F172A')}
                  onChange={(e) => updateProp('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <button
                  onClick={() => updateProp('backgroundColor', 'transparent')}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFORM PROPERTIES */}
      <div className="space-y-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
          <Move className="w-3.5 h-3.5" />
          <span>Transform & Scale</span>
        </div>

        {/* Scale */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Scale</span>
            <span className="font-mono text-slate-200">{Math.round((selectedClip.scale || 1.0) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            value={selectedClip.scale || 1.0}
            onChange={(e) => updateProp('scale', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Position X */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Position X</span>
            <span className="font-mono text-slate-200">{selectedClip.x || 0}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={selectedClip.x || 0}
            onChange={(e) => updateProp('x', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Position Y */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Position Y</span>
            <span className="font-mono text-slate-200">{selectedClip.y || 0}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={selectedClip.y || 0}
            onChange={(e) => updateProp('y', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Rotation</span>
            <span className="font-mono text-slate-200">{selectedClip.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={selectedClip.rotation || 0}
            onChange={(e) => updateProp('rotation', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded"
          />
        </div>
      </div>

      {/* SPEED & OPACITY */}
      <div className="space-y-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
          <Gauge className="w-3.5 h-3.5" />
          <span>Playback Speed & Opacity</span>
        </div>

        {/* Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Opacity</span>
            <span className="font-mono text-slate-200">{Math.round((selectedClip.opacity ?? 1.0) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedClip.opacity ?? 1.0}
            onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Speed presets */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400">Speed</label>
          <div className="grid grid-cols-4 gap-1 text-center">
            {[0.5, 1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => updateProp('playbackRate', rate)}
                className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                  (selectedClip.playbackRate || 1.0) === rate
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#070913] text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AUDIO VOLUME (If Video or Audio clip) */}
      {(selectedClip.type === 'video' || selectedClip.type === 'audio') && (
        <div className="space-y-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio & Mixing</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Volume</span>
              <span className="font-mono text-slate-200">{Math.round((selectedClip.volume ?? 0.8) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedClip.volume ?? 0.8}
              onChange={(e) => updateProp('volume', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded"
            />
          </div>
        </div>
      )}

      {/* COLOR GRADING & FILTERS (If Video or Image clip) */}
      {(selectedClip.type === 'video' || selectedClip.type === 'image') && (
        <div className="space-y-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Color Grading</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Brightness</span>
              <span className="font-mono text-slate-200">{selectedClip.filter?.brightness ?? 100}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="180"
              value={selectedClip.filter?.brightness ?? 100}
              onChange={(e) => updateFilter('brightness', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Contrast</span>
              <span className="font-mono text-slate-200">{selectedClip.filter?.contrast ?? 100}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="180"
              value={selectedClip.filter?.contrast ?? 100}
              onChange={(e) => updateFilter('contrast', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Saturation</span>
              <span className="font-mono text-slate-200">{selectedClip.filter?.saturation ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={selectedClip.filter?.saturation ?? 100}
              onChange={(e) => updateFilter('saturation', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded"
            />
          </div>

          {/* Chroma Key / Green Screen Toggle */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold">Chroma Key</span>
            <input
              type="checkbox"
              checked={!!selectedClip.filter?.chromaKey}
              onChange={(e) => updateFilter('chromaKey', e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

    </div>
  );
};
