import React, { useState, useRef } from 'react';
import { AspectRatio, Project, Resolution } from '../../types';
import { exportProjectVideo, RenderResult } from '../../utils/videoExporter';
import { logExportHistory } from '../../utils/storage';
import { 
  X, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Monitor, 
  Smartphone, 
  Square, 
  Loader2, 
  Play, 
  ShieldCheck,
  Film
} from 'lucide-react';

interface ExportModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, isOpen, onClose }) => {
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspectRatio);
  const [format, setFormat] = useState<'webm' | 'mp4'>('webm');
  const [fps, setFps] = useState<number>(30);
  
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [renderedResult, setRenderedResult] = useState<RenderResult | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const cancelFlagRef = useRef(false);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setStatusMessage('Preparing project timeline...');
    setRenderedResult(null);
    setExportError(null);
    cancelFlagRef.current = false;

    try {
      const result = await exportProjectVideo(project, {
        resolution,
        aspectRatio,
        format,
        fps,
        shouldCancel: () => cancelFlagRef.current,
        onProgress: (p, msg) => {
          setProgress(p);
          setStatusMessage(msg);
        },
      });

      setRenderedResult(result);
      
      // Log to local storage history
      logExportHistory({
        projectId: project.id,
        projectName: project.title,
        resolution,
        format,
        duration: result.durationSeconds,
        fileSizeBytes: result.sizeBytes,
      });

      // Log to backend API
      try {
        fetch('/api/render/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: project.title,
            resolution,
            format,
            durationSec: result.durationSeconds,
          }),
        }).catch(() => {});
      } catch (_) {}

    } catch (err: any) {
      if (err.message && err.message.includes('cancelled')) {
        setStatusMessage('Export was cancelled.');
      } else {
        setExportError(err.message || 'An error occurred during video rendering.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCancelExport = () => {
    cancelFlagRef.current = true;
    setIsExporting(false);
  };

  const handleDownloadFile = () => {
    if (!renderedResult) return;
    const a = document.createElement('a');
    a.href = renderedResult.url;
    a.download = renderedResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0B0F19] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#070913]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Video</h3>
              <p className="text-xs text-slate-400">High-fidelity client rendering with zero watermark</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Launch Mode Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-300">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>
                <strong>100% Free at Launch:</strong> All 1080p and 4K exports are unlocked without watermarks or mandatory paywalls.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] shrink-0 uppercase">
              VIP Unlocked
            </span>
          </div>

          {!renderedResult ? (
            <>
              {/* Resolution selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Export Resolution
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: '480p', label: '480p SD', desc: 'Fast draft render' },
                    { id: '720p', label: '720p HD', desc: 'Standard mobile' },
                    { id: '1080p', label: '1080p FHD', desc: 'Recommended', badge: 'Best' },
                    { id: '4k', label: '4K Ultra HD', desc: 'Crisp master' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setResolution(item.id as Resolution)}
                      disabled={isExporting}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        resolution === item.id
                          ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm shadow-purple-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-white">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Aspect Ratio Presets
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: '16:9', label: '16:9 Landscape', icon: Monitor },
                    { id: '9:16', label: '9:16 Shorts/Reels', icon: Smartphone },
                    { id: '1:1', label: '1:1 Square', icon: Square },
                    { id: '4:5', label: '4:5 Portrait', icon: Smartphone },
                    { id: '3:4', label: '3:4 Tablet', icon: Monitor },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setAspectRatio(item.id as AspectRatio)}
                        disabled={isExporting}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          aspectRatio === item.id
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format & Framerate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Video Codec & Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    disabled={isExporting}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="webm">WebM (Universal VP9/VP8 - Fast & Efficient)</option>
                    <option value="mp4">MP4 (H.264/AAC - Supported platforms)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Framerate (FPS)</label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    disabled={isExporting}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={30}>30 FPS (Standard)</option>
                    <option value={60}>60 FPS (Ultra Smooth)</option>
                  </select>
                </div>
              </div>

              {/* Progress Bar during render */}
              {isExporting && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-300 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      <span>{statusMessage}</span>
                    </span>
                    <span className="font-mono font-bold text-white text-sm">{progress}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 transition-all duration-300 rounded-full"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Rendering all video tracks, text overlays, color grading, and audio synchronization...
                  </p>
                </div>
              )}

              {/* Error display */}
              {exportError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{exportError}</span>
                </div>
              )}
            </>
          ) : (
            /* EXPORT COMPLETED SCREEN */
            <div className="space-y-5 text-center py-2 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Video Render Complete!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your project has been rendered at {resolution} with zero watermarks.
                </p>
              </div>

              {/* Video Player Preview of the rendered file */}
              <div className="w-full max-h-56 rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-lg mx-auto">
                <video
                  src={renderedResult.url}
                  controls
                  className="w-full h-full max-h-56 object-contain"
                />
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">FILE SIZE</span>
                  <span className="text-slate-200 font-bold">
                    {(renderedResult.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DURATION</span>
                  <span className="text-slate-200 font-bold">{renderedResult.durationSeconds.toFixed(1)}s</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">FORMAT</span>
                  <span className="text-slate-200 font-bold uppercase">{format}</span>
                </div>
              </div>

              {/* Download Action Button */}
              <button
                onClick={handleDownloadFile}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-98 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Video File ({renderedResult.filename})</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#070913] flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {renderedResult ? 'Close' : 'Cancel'}
          </button>

          {!renderedResult ? (
            <div className="flex items-center gap-2">
              {isExporting ? (
                <button
                  onClick={handleCancelExport}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-400 text-xs font-bold border border-rose-500/30 transition-colors"
                >
                  Cancel Export
                </button>
              ) : (
                <button
                  onClick={handleStartExport}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs hover:opacity-95 shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Start Free Render</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setRenderedResult(null);
                setProgress(0);
              }}
              className="text-xs text-purple-400 hover:underline font-semibold"
            >
              Export with Different Settings
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
