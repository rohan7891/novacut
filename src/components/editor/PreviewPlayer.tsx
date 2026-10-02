import React, { useEffect, useRef } from 'react';
import { AspectRatio, Clip, Project, SubtitleItem } from '../../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Repeat } from 'lucide-react';

interface PreviewPlayerProps {
  project: Project;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  project,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isLooping, setIsLooping] = React.useState(true);

  // Aspect ratio classes for preview container
  const aspectClass = {
    '16:9': 'aspect-video max-w-4xl',
    '9:16': 'aspect-[9/16] max-h-[500px]',
    '1:1': 'aspect-square max-h-[500px]',
    '4:5': 'aspect-[4/5] max-h-[500px]',
    '3:4': 'aspect-[3/4] max-h-[500px]',
  }[project.aspectRatio] || 'aspect-video max-w-4xl';

  // Format seconds to MM:SS.S
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  // Keyboard shortcut listener for spacebar play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onSeek(Math.max(0, currentTime - 1));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onSeek(Math.min(project.duration, currentTime + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, isPlaying, onTogglePlay, onSeek, project.duration]);

  // Real-time canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use high resolution for crisp rendering
    const w = 1280;
    const h = project.aspectRatio === '9:16' ? (1280 * 16) / 9 :
              project.aspectRatio === '1:1' ? 1280 :
              project.aspectRatio === '4:5' ? (1280 * 5) / 4 : (1280 * 9) / 16;
    
    if (canvas.width !== w || canvas.height !== Math.round(h)) {
      canvas.width = w;
      canvas.height = Math.round(h);
    }

    const cw = canvas.width;
    const ch = canvas.height;

    // Clear background
    ctx.fillStyle = '#070913';
    ctx.fillRect(0, 0, cw, ch);

    // Draw ambient studio background
    const grad = ctx.createLinearGradient(0, 0, cw, ch);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(0.5, '#1E1B4B');
    grad.addColorStop(1, '#090D16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // Draw active clips
    for (const clip of project.clips) {
      const clipEnd = clip.start + clip.duration;
      if (currentTime >= clip.start && currentTime <= clipEnd) {
        const clipTime = currentTime - clip.start;
        drawPreviewClip(ctx, clip, clipTime, cw, ch);
      }
    }

    // Draw active subtitles
    const activeSub = project.subtitles?.find(s => currentTime >= s.start && currentTime <= s.end);
    if (activeSub) {
      drawPreviewSubtitle(ctx, activeSub, cw, ch);
    }

    // Watermark indicator
    ctx.save();
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'right';
    ctx.fillText('⚡ NovaCut Studio', cw - 20, 30);
    ctx.restore();

  }, [currentTime, project]);

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => console.error(err));
      } else {
        document.exitFullscreen().catch((err) => console.error(err));
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#070913] items-center justify-center p-3 relative overflow-hidden select-none">
      
      {/* Aspect-Ratio Video Screen Container */}
      <div 
        ref={containerRef}
        className={`w-full ${aspectClass} relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-slate-800/90 bg-black flex items-center justify-center group`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain cursor-pointer"
          onClick={onTogglePlay}
        />

        {/* Center Play Overlay Icon when paused */}
        {!isPlaying && (
          <button
            onClick={onTogglePlay}
            className="absolute w-16 h-16 rounded-full bg-purple-600/80 hover:bg-purple-600 backdrop-blur-md text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transition-transform active:scale-90"
            title="Play (Space)"
          >
            <Play className="w-7 h-7 fill-current ml-1" />
          </button>
        )}

        {/* Aspect Ratio Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
          {project.aspectRatio}
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="w-full max-w-3xl mt-3 px-4 py-2 rounded-xl bg-[#0B0F19] border border-slate-800/80 flex items-center justify-between gap-4 shadow-lg shadow-black/40">
        
        {/* Left: Step back / Play / Step forward */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Step Back 1s (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 text-white flex items-center justify-center shadow-sm shadow-purple-500/20 active:scale-95 transition-all"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => onSeek(Math.min(project.duration, currentTime + 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Step Forward 1s (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Timecode */}
          <div className="ml-2 font-mono text-xs font-semibold text-slate-300">
            <span className="text-purple-400">{formatTime(currentTime)}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className="text-slate-500">{formatTime(project.duration)}</span>
          </div>
        </div>

        {/* Right: Loop, Volume & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLooping ? 'text-purple-400 bg-purple-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Loop Playback"
          >
            <Repeat className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fullscreen Preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

// Render clip item on canvas
function drawPreviewClip(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  clipTime: number,
  canvasW: number,
  canvasH: number
) {
  ctx.save();

  // Opacity & Filters
  ctx.globalAlpha = clip.opacity !== undefined ? clip.opacity : 1.0;
  const brightness = clip.filter?.brightness ?? 100;
  const contrast = clip.filter?.contrast ?? 100;
  const saturation = clip.filter?.saturation ?? 100;
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  // Transform
  const offsetX = ((clip.x || 0) / 100) * canvasW;
  const offsetY = ((clip.y || 0) / 100) * canvasH;
  const scale = clip.scale || 1.0;
  const rotation = ((clip.rotation || 0) * Math.PI) / 180;

  ctx.translate(canvasW / 2 + offsetX, canvasH / 2 + offsetY);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  if (clip.type === 'video' || clip.type === 'image') {
    const cardW = canvasW * 0.85;
    const cardH = canvasH * 0.75;
    const x = -cardW / 2;
    const y = -cardH / 2;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, cardW, cardH, 20);
    ctx.clip();

    // Scene gradient
    const grad = ctx.createLinearGradient(x, y, x + cardW, y + cardH);
    if (clip.name.includes('Cyberpunk')) {
      grad.addColorStop(0, '#1E1B4B');
      grad.addColorStop(0.5, '#4C1D95');
      grad.addColorStop(1, '#083344');
    } else {
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E293B');
      grad.addColorStop(1, '#0369A1');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, cardW, cardH);

    // Perspective grid
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
    ctx.lineWidth = 2;
    const horizon = y + cardH * 0.55;

    for (let gy = horizon; gy < y + cardH; gy += 25) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + cardW, gy);
      ctx.stroke();
    }
    for (let gx = x; gx <= x + cardW; gx += 50) {
      ctx.beginPath();
      ctx.moveTo(x + cardW / 2, horizon);
      ctx.lineTo(gx, y + cardH);
      ctx.stroke();
    }

    // Glowing sun
    const sunPulse = 1 + Math.sin(clipTime * 3) * 0.08;
    const sunGrad = ctx.createRadialGradient(0, horizon - 70, 10, 0, horizon - 70, 100 * sunPulse);
    sunGrad.addColorStop(0, '#F43F5E');
    sunGrad.addColorStop(0.6, '#EC4899');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(0, horizon - 70, 90 * sunPulse, 0, Math.PI * 2);
    ctx.fill();

    // Scene label
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x + 24, y + 24, 250, 42, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`SCENE: ${clip.name.toUpperCase()}`, x + 40, y + 45);

    ctx.restore();
  } else if (clip.type === 'text') {
    const text = clip.text || 'TITLE';
    const fontSize = (clip.fontSize || 36) * (canvasW / 1280);
    ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;

    let animScale = 1;
    let animAlpha = 1;
    if (clip.animation === 'pop') {
      const progress = Math.min(1, clipTime / 0.4);
      animScale = 0.7 + Math.sin(progress * Math.PI * 0.5) * 0.3;
    } else if (clip.animation === 'slide-up') {
      const slideOffset = Math.max(0, (1 - clipTime / 0.5) * 30);
      ctx.translate(0, slideOffset);
    }

    ctx.scale(animScale, animScale);
    ctx.globalAlpha *= animAlpha;

    const metrics = ctx.measureText(text);
    const paddingX = 24 * (canvasW / 1280);
    const paddingY = 12 * (canvasW / 1280);
    const boxW = metrics.width + paddingX * 2;
    const boxH = fontSize * 1.3 + paddingY * 2;

    if (clip.backgroundColor && clip.backgroundColor !== 'transparent') {
      ctx.fillStyle = clip.backgroundColor;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 12);
      ctx.fill();
    }

    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = clip.textColor || '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
  }

  ctx.restore();
}

function drawPreviewSubtitle(
  ctx: CanvasRenderingContext2D,
  sub: SubtitleItem,
  canvasW: number,
  canvasH: number
) {
  ctx.save();
  const fontSize = Math.max(22, Math.round(canvasH * 0.038));
  ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", sans-serif`;

  const text = sub.text;
  const metrics = ctx.measureText(text);
  const boxPaddingX = 24;
  const boxPaddingY = 12;
  const boxW = Math.min(canvasW * 0.9, metrics.width + boxPaddingX * 2);
  const boxH = fontSize * 1.5 + boxPaddingY * 2;
  const posX = canvasW / 2;
  const posY = canvasH - boxH / 2 - canvasH * 0.08;

  ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
  ctx.beginPath();
  ctx.roundRect(posX - boxW / 2, posY - boxH / 2, boxW, boxH, 14);
  ctx.fill();

  ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#FACC15'; // Glowing subtitle yellow
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 8;

  if (metrics.width > canvasW * 0.85) {
    ctx.font = `700 ${fontSize * 0.8}px "Plus Jakarta Sans", sans-serif`;
  }
  ctx.fillText(text, posX, posY);

  ctx.restore();
}
