import React, { useRef, useState, useEffect } from 'react';
import { Clip, Project, Track } from '../../types';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  Film, 
  Music, 
  Type, 
  Image as ImageIcon,
  MessageSquare,
  Plus
} from 'lucide-react';

interface TimelineProps {
  project: Project;
  currentTime: number;
  onSeek: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onUpdateClip: (clip: Clip) => void;
  onDeleteClip: (clipId: string) => void;
  zoom: number; // 0.5 to 3.0
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  currentTime,
  onSeek,
  selectedClipId,
  onSelectClip,
  onUpdateClip,
  zoom,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tracksContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [draggingClip, setDraggingClip] = useState<{ id: string; startX: number; originalStart: number } | null>(null);
  const [trimmingClip, setTrimmingClip] = useState<{ id: string; edge: 'left' | 'right'; startX: number; originalStart: number; originalDuration: number } | null>(null);

  const pixelsPerSecond = 50 * zoom;
  const timelineWidth = Math.max(1200, (project.duration + 5) * pixelsPerSecond);

  // Time ruler marker intervals
  const markerInterval = zoom >= 2 ? 0.5 : zoom >= 1 ? 1 : 2;
  const numMarkers = Math.ceil((project.duration + 4) / markerInterval);
  const markers = Array.from({ length: numMarkers }, (_, i) => i * markerInterval);

  // Handle Playhead Scrubbing
  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tracksContainerRef.current) return;
    const rect = tracksContainerRef.current.getBoundingClientRect();
    const scrollLeft = tracksContainerRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const time = Math.max(0, Math.min(project.duration, clickX / pixelsPerSecond));
    onSeek(time);
    setIsDraggingPlayhead(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead && tracksContainerRef.current) {
        const rect = tracksContainerRef.current.getBoundingClientRect();
        const scrollLeft = tracksContainerRef.current.scrollLeft;
        const currentX = e.clientX - rect.left + scrollLeft;
        const time = Math.max(0, Math.min(project.duration, currentX / pixelsPerSecond));
        onSeek(time);
      } else if (draggingClip) {
        const deltaX = e.clientX - draggingClip.startX;
        const deltaTime = deltaX / pixelsPerSecond;
        const clip = project.clips.find(c => c.id === draggingClip.id);
        if (clip) {
          const newStart = Math.max(0, Math.round((draggingClip.originalStart + deltaTime) * 10) / 10);
          onUpdateClip({ ...clip, start: newStart });
        }
      } else if (trimmingClip) {
        const deltaX = e.clientX - trimmingClip.startX;
        const deltaTime = deltaX / pixelsPerSecond;
        const clip = project.clips.find(c => c.id === trimmingClip.id);
        if (clip) {
          if (trimmingClip.edge === 'right') {
            const newDuration = Math.max(0.5, Math.round((trimmingClip.originalDuration + deltaTime) * 10) / 10);
            onUpdateClip({ ...clip, duration: newDuration });
          } else {
            const newStart = Math.max(0, Math.min(trimmingClip.originalStart + trimmingClip.originalDuration - 0.5, trimmingClip.originalStart + deltaTime));
            const newDuration = trimmingClip.originalDuration - (newStart - trimmingClip.originalStart);
            onUpdateClip({ ...clip, start: Math.round(newStart * 10) / 10, duration: Math.max(0.5, Math.round(newDuration * 10) / 10) });
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
      setDraggingClip(null);
      setTrimmingClip(null);
    };

    if (isDraggingPlayhead || draggingClip || trimmingClip) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPlayhead, draggingClip, trimmingClip, pixelsPerSecond, project.duration, project.clips, onSeek, onUpdateClip]);

  const getTrackIcon = (type: Track['type']) => {
    switch (type) {
      case 'video': return Film;
      case 'audio': return Music;
      case 'text': return Type;
      case 'image': return ImageIcon;
      case 'subtitle': return MessageSquare;
      default: return Film;
    }
  };

  const getClipBgColor = (type: Clip['type'], isSelected: boolean) => {
    if (isSelected) return 'bg-purple-600/90 border-cyan-400 ring-2 ring-cyan-400/50';
    switch (type) {
      case 'video': return 'bg-blue-600/80 hover:bg-blue-600 border-blue-400/40';
      case 'audio': return 'bg-emerald-600/80 hover:bg-emerald-600 border-emerald-400/40';
      case 'text': return 'bg-purple-600/80 hover:bg-purple-600 border-purple-400/40';
      case 'image': return 'bg-amber-600/80 hover:bg-amber-600 border-amber-400/40';
      case 'subtitle': return 'bg-cyan-600/80 hover:bg-cyan-600 border-cyan-400/40';
      default: return 'bg-slate-700 hover:bg-slate-600 border-slate-500';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-64 bg-[#090D16] border-t border-slate-800 flex flex-col select-none relative"
    >
      
      {/* Timeline Controls Header */}
      <div className="h-8 border-b border-slate-800/80 bg-[#0B0F19] flex items-center justify-between px-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">Tracks</span>
          <span className="text-[10px] text-slate-500">({project.tracks.length} active)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            Playhead: <span className="text-cyan-300 font-mono font-bold">{currentTime.toFixed(2)}s</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Total: <span className="text-purple-300 font-mono font-bold">{project.duration.toFixed(1)}s</span>
          </span>
        </div>
      </div>

      {/* Main Track Workspace: Left Sidebar + Right Scrollable Tracks */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Track Headers (Left fixed side) */}
        <div className="w-44 sm:w-52 border-r border-slate-800 bg-[#070913] flex flex-col z-20 shadow-md">
          {/* Top ruler spacer */}
          <div className="h-7 border-b border-slate-800/80 bg-[#0A0E18] px-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>TIMECODE</span>
          </div>

          {/* Track Labels */}
          <div className="flex-1 overflow-hidden divide-y divide-slate-800/60">
            {project.tracks.map((track) => {
              const Icon = getTrackIcon(track.type);
              return (
                <div 
                  key={track.id} 
                  className="h-11 px-3 flex items-center justify-between text-xs hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{track.name}</span>
                  </div>
                  
                  {/* Track quick tools */}
                  <div className="flex items-center gap-1 text-slate-500">
                    <button className="p-1 hover:text-slate-200" title="Mute track">
                      {track.type === 'audio' ? <Volume2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button className="p-1 hover:text-slate-200" title="Lock track">
                      <Unlock className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Timeline Lanes + Playhead */}
        <div 
          ref={tracksContainerRef}
          onMouseDown={handleTimelineMouseDown}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#060810] cursor-crosshair"
        >
          <div style={{ width: `${timelineWidth}px` }} className="h-full relative">
            
            {/* Time Ruler (Seconds markers) */}
            <div className="h-7 border-b border-slate-800 bg-[#0A0E18] relative flex items-end">
              {markers.map((time) => {
                const isMajor = time % 5 === 0;
                return (
                  <div
                    key={time}
                    style={{ left: `${time * pixelsPerSecond}px` }}
                    className="absolute bottom-0 flex flex-col items-center pointer-events-none"
                  >
                    {isMajor && (
                      <span className="text-[10px] font-mono text-slate-400 absolute -top-4 -translate-x-1/2">
                        {time}s
                      </span>
                    )}
                    <div 
                      className={`w-[1px] ${
                        isMajor ? 'h-3 bg-slate-500' : 'h-1.5 bg-slate-700'
                      }`} 
                    />
                  </div>
                );
              })}
            </div>

            {/* Track Lanes */}
            <div className="divide-y divide-slate-800/40 relative">
              {project.tracks.map((track) => {
                // Find clips belonging to this track
                const trackClips = project.clips.filter((c) => c.trackId === track.id);
                // Also render subtitles if this is the subtitle track
                const isSubtitleTrack = track.id === 'track-subtitles';

                return (
                  <div 
                    key={track.id} 
                    className="h-11 relative bg-slate-950/20 hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Render clips */}
                    {trackClips.map((clip) => {
                      const isSelected = selectedClipId === clip.id;
                      const leftPx = clip.start * pixelsPerSecond;
                      const widthPx = clip.duration * pixelsPerSecond;
                      const bgClasses = getClipBgColor(clip.type, isSelected);

                      return (
                        <div
                          key={clip.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectClip(clip.id);
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onSelectClip(clip.id);
                            setDraggingClip({
                              id: clip.id,
                              startX: e.clientX,
                              originalStart: clip.start,
                            });
                          }}
                          style={{
                            left: `${leftPx}px`,
                            width: `${Math.max(20, widthPx)}px`,
                          }}
                          className={`absolute top-1 bottom-1 rounded-md border text-white shadow-sm flex items-center px-2 cursor-grab active:cursor-grabbing overflow-hidden group transition-shadow ${bgClasses}`}
                        >
                          {/* Left Trim Handle */}
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setTrimmingClip({
                                id: clip.id,
                                edge: 'left',
                                startX: e.clientX,
                                originalStart: clip.start,
                                originalDuration: clip.duration,
                              });
                            }}
                            className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/30 hover:bg-white/40 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Drag to trim start"
                          />

                          {/* Clip Label */}
                          <span className="text-[11px] font-medium truncate pointer-events-none drop-shadow-sm">
                            {clip.name || clip.text || 'Clip'}
                          </span>

                          {/* Right Trim Handle */}
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setTrimmingClip({
                                id: clip.id,
                                edge: 'right',
                                startX: e.clientX,
                                originalStart: clip.start,
                                originalDuration: clip.duration,
                              });
                            }}
                            className="absolute right-0 top-0 bottom-0 w-2.5 bg-black/30 hover:bg-white/40 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Drag to trim end"
                          />
                        </div>
                      );
                    })}

                    {/* Subtitles track items */}
                    {isSubtitleTrack && project.subtitles?.map((sub) => {
                      const leftPx = sub.start * pixelsPerSecond;
                      const widthPx = (sub.end - sub.start) * pixelsPerSecond;
                      return (
                        <div
                          key={sub.id}
                          style={{
                            left: `${leftPx}px`,
                            width: `${Math.max(20, widthPx)}px`,
                          }}
                          className="absolute top-1 bottom-1 rounded-md bg-amber-600/80 border border-amber-400/40 text-white text-[11px] font-medium px-2 flex items-center truncate shadow-sm"
                        >
                          <span className="truncate">{sub.text}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Playhead Scrubber Line & Handle */}
            <div
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
              className="absolute top-0 bottom-0 w-[2px] bg-rose-500 z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
            >
              {/* Playhead Head Marker */}
              <div className="absolute -top-0 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-b-md flex items-center justify-center shadow-md">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
