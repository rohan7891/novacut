import React, { useState, useEffect, useRef } from 'react';
import { AspectRatio, Clip, Project, SubtitleItem } from '../../types';
import { TopToolbar } from './TopToolbar';
import { MediaSidebar } from './MediaSidebar';
import { PreviewPlayer } from './PreviewPlayer';
import { PropertiesInspector } from './PropertiesInspector';
import { Timeline } from './Timeline';
import { ExportModal } from './ExportModal';
import { saveProject } from '../../utils/storage';

interface VideoEditorProps {
  initialProject: Project;
  onNavigate: (tab: string) => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ initialProject }) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('just now');

  // Undo / Redo History
  const [history, setHistory] = useState<Project[]>([initialProject]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Push new state to undo/redo history
  const pushHistory = (newProject: Project) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newProject);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(next);
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        const nextTime = prev + deltaSec;
        if (nextTime >= project.duration) {
          setIsPlaying(false);
          return 0; // Loop or stop
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, project.duration]);

  // Recalculate duration when clips change
  const recalculateDuration = (clips: Clip[]) => {
    if (clips.length === 0) return 10;
    const maxEnd = Math.max(...clips.map((c) => c.start + c.duration));
    return Math.max(10, Math.ceil(maxEnd));
  };

  // Autosave periodically
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProject(project);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1500);

    return () => clearTimeout(timer);
  }, [project]);

  // Project edits
  const handleUpdateTitle = (title: string) => {
    const updated = { ...project, title };
    setProject(updated);
    pushHistory(updated);
  };

  const handleUpdateAspectRatio = (aspectRatio: AspectRatio) => {
    const updated = { ...project, aspectRatio };
    setProject(updated);
    pushHistory(updated);
  };

  const handleAddClip = (clip: Clip) => {
    const updatedClips = [...project.clips, clip];
    const updatedDuration = recalculateDuration(updatedClips);
    const updated = {
      ...project,
      clips: updatedClips,
      duration: updatedDuration,
    };
    setProject(updated);
    setSelectedClipId(clip.id);
    pushHistory(updated);
  };

  const handleUpdateClip = (updatedClip: Clip) => {
    const updatedClips = project.clips.map((c) => (c.id === updatedClip.id ? updatedClip : c));
    const updatedDuration = recalculateDuration(updatedClips);
    const updated = {
      ...project,
      clips: updatedClips,
      duration: updatedDuration,
    };
    setProject(updated);
  };

  const handleDeleteClip = (clipId?: string) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    const updatedClips = project.clips.filter((c) => c.id !== targetId);
    const updatedDuration = recalculateDuration(updatedClips);
    const updated = {
      ...project,
      clips: updatedClips,
      duration: updatedDuration,
    };
    setProject(updated);
    setSelectedClipId(null);
    pushHistory(updated);
  };

  const handleDuplicateClip = () => {
    if (!selectedClipId) return;
    const orig = project.clips.find((c) => c.id === selectedClipId);
    if (!orig) return;

    const clone: Clip = {
      ...orig,
      id: `clip-${Date.now()}`,
      start: orig.start + orig.duration + 0.5,
    };

    const updatedClips = [...project.clips, clone];
    const updatedDuration = recalculateDuration(updatedClips);
    const updated = {
      ...project,
      clips: updatedClips,
      duration: updatedDuration,
    };
    setProject(updated);
    setSelectedClipId(clone.id);
    pushHistory(updated);
  };

  const handleSplitClip = () => {
    if (!selectedClipId) return;
    const orig = project.clips.find((c) => c.id === selectedClipId);
    if (!orig) return;

    const clipEnd = orig.start + orig.duration;
    if (currentTime <= orig.start + 0.3 || currentTime >= clipEnd - 0.3) {
      alert('Playhead must be inside the clip to split.');
      return;
    }

    const firstDuration = currentTime - orig.start;
    const secondDuration = clipEnd - currentTime;

    const firstHalf: Clip = {
      ...orig,
      duration: Math.round(firstDuration * 10) / 10,
    };

    const secondHalf: Clip = {
      ...orig,
      id: `clip-${Date.now()}`,
      start: Math.round(currentTime * 10) / 10,
      duration: Math.round(secondDuration * 10) / 10,
    };

    const updatedClips = project.clips.map((c) => (c.id === orig.id ? firstHalf : c));
    updatedClips.push(secondHalf);

    const updated = {
      ...project,
      clips: updatedClips,
      duration: recalculateDuration(updatedClips),
    };

    setProject(updated);
    setSelectedClipId(secondHalf.id);
    pushHistory(updated);
  };

  const handleUpdateSubtitles = (subtitles: SubtitleItem[]) => {
    const updated = { ...project, subtitles };
    setProject(updated);
    pushHistory(updated);
  };

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col bg-[#070913] overflow-hidden select-none">
      
      {/* Top Action Toolbar */}
      <TopToolbar
        project={project}
        onUpdateTitle={handleUpdateTitle}
        onUpdateAspectRatio={handleUpdateAspectRatio}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onSplitClip={handleSplitClip}
        onDuplicateClip={handleDuplicateClip}
        onDeleteClip={() => handleDeleteClip()}
        hasSelectedClip={!!selectedClipId}
        zoom={zoom}
        onZoomChange={setZoom}
        onSave={() => {
          saveProject(project);
          setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }}
        lastSavedTime={lastSavedTime}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace (Sidebar + Canvas Preview + Properties Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Media & Tools Sidebar */}
        <MediaSidebar
          project={project}
          onAddClip={handleAddClip}
          onUpdateSubtitles={handleUpdateSubtitles}
          currentTime={currentTime}
        />

        {/* Center: Live HTML5 Canvas Player */}
        <PreviewPlayer
          project={project}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSeek={setCurrentTime}
        />

        {/* Right: Properties Inspector */}
        <PropertiesInspector
          selectedClip={selectedClip}
          onUpdateClip={handleUpdateClip}
          project={project}
        />
      </div>

      {/* Bottom: Multitrack Timeline */}
      <Timeline
        project={project}
        currentTime={currentTime}
        onSeek={setCurrentTime}
        selectedClipId={selectedClipId}
        onSelectClip={setSelectedClipId}
        onUpdateClip={handleUpdateClip}
        onDeleteClip={handleDeleteClip}
        zoom={zoom}
      />

      {/* Real Video Export Modal */}
      <ExportModal
        project={project}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
};
