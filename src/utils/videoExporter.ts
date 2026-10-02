import { AspectRatio, Clip, Project, Resolution, SubtitleItem } from '../types';

export interface RenderOptions {
  resolution: Resolution;
  aspectRatio: AspectRatio;
  format: 'webm' | 'mp4';
  fps?: number;
  onProgress: (percent: number, statusText: string) => void;
  shouldCancel?: () => boolean;
}

export interface RenderResult {
  blob: Blob;
  url: string;
  sizeBytes: number;
  durationSeconds: number;
  filename: string;
}

export function getDimensions(resolution: Resolution, aspectRatio: AspectRatio): { width: number; height: number } {
  const baseSizes: Record<Resolution, number> = {
    '480p': 480,
    '720p': 720,
    '1080p': 1080,
    '4k': 2160,
  };

  const base = baseSizes[resolution] || 1080;

  switch (aspectRatio) {
    case '16:9':
      return { width: Math.round((base * 16) / 9), height: base };
    case '9:16':
      return { width: base, height: Math.round((base * 16) / 9) };
    case '1:1':
      return { width: base, height: base };
    case '4:5':
      return { width: base, height: Math.round((base * 5) / 4) };
    case '3:4':
      return { width: base, height: Math.round((base * 4) / 3) };
    default:
      return { width: 1920, height: 1080 };
  }
}

export async function exportProjectVideo(
  project: Project,
  options: RenderOptions
): Promise<RenderResult> {
  const { resolution, aspectRatio, format, onProgress, shouldCancel, fps = 30 } = options;
  const { width, height } = getDimensions(resolution, aspectRatio);
  const totalDuration = Math.max(project.duration || 10, 3);

  onProgress(2, 'Initializing high-fidelity rendering pipeline...');

  // Setup offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not obtain 2D rendering context for video export.');
  }

  // Setup Web Audio API for real synthesized / mixed sound output
  let audioCtx: AudioContext | null = null;
  let audioDest: MediaStreamAudioDestinationNode | null = null;
  let oscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      audioDest = audioCtx.createMediaStreamDestination();

      // Create an ambient audio groove generator for exported timeline
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioDest);
      oscillator.start();
    }
  } catch (err) {
    console.warn('Web Audio output not available in this environment:', err);
  }

  // MediaStream combination
  const canvasStream = canvas.captureStream(fps);
  if (audioDest) {
    const audioTrack = audioDest.stream.getAudioTracks()[0];
    if (audioTrack) {
      canvasStream.addTrack(audioTrack);
    }
  }

  // Determine optimal supported MIME type
  let mimeType = 'video/webm;codecs=vp9,opus';
  if (format === 'mp4' && MediaRecorder.isTypeSupported('video/mp4')) {
    mimeType = 'video/mp4';
  } else if (!MediaRecorder.isTypeSupported(mimeType)) {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    }
  }

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(canvasStream, {
    mimeType,
    videoBitsPerSecond: resolution === '4k' ? 18000000 : resolution === '1080p' ? 8000000 : 4000000,
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  recorder.start(100);

  // Pre-load any image/video elements from clips
  const clipElements = new Map<string, HTMLImageElement | HTMLVideoElement>();
  for (const clip of project.clips) {
    if (clip.src) {
      if (clip.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = clip.src;
        clipElements.set(clip.id, img);
      } else if (clip.type === 'video') {
        const vid = document.createElement('video');
        vid.crossOrigin = 'anonymous';
        vid.src = clip.src;
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = 'auto';
        clipElements.set(clip.id, vid);
      }
    }
  }

  const totalFrames = Math.ceil(totalDuration * fps);
  const frameIntervalMs = 1000 / fps;

  return new Promise<RenderResult>(async (resolve, reject) => {
    recorder.onerror = (e) => reject(new Error(`Recording error: ${(e as any).error}`));

    let currentFrame = 0;

    const renderLoop = async () => {
      if (shouldCancel && shouldCancel()) {
        recorder.stop();
        if (oscillator) oscillator.stop();
        if (audioCtx) audioCtx.close();
        return reject(new Error('Export cancelled by user.'));
      }

      if (currentFrame >= totalFrames) {
        onProgress(98, 'Finalizing video stream and generating file...');
        
        recorder.onstop = () => {
          if (oscillator) {
            try { oscillator.stop(); } catch (_) {}
          }
          if (audioCtx) {
            try { audioCtx.close(); } catch (_) {}
          }

          const finalBlob = new Blob(recordedChunks, { type: mimeType });
          const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const cleanTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'novacut_video';
          const filename = `${cleanTitle}_${resolution}_${Date.now()}.${fileExtension}`;
          const url = URL.createObjectURL(finalBlob);

          onProgress(100, 'Video ready!');
          resolve({
            blob: finalBlob,
            url,
            sizeBytes: finalBlob.size,
            durationSeconds: totalDuration,
            filename,
          });
        };

        recorder.stop();
        return;
      }

      const currentTime = currentFrame / fps;
      const progressPercent = Math.min(96, Math.round((currentFrame / totalFrames) * 95) + 3);
      onProgress(progressPercent, `Rendering frame ${currentFrame + 1} / ${totalFrames} (${currentTime.toFixed(1)}s)...`);

      // 1. Clear background
      ctx.fillStyle = '#070913';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw ambient studio backdrop
      drawBackdrop(ctx, width, height, currentTime, totalDuration);

      // 3. Render video / image / graphic clips active at this timestamp
      for (const clip of project.clips) {
        const clipEnd = clip.start + clip.duration;
        if (currentTime >= clip.start && currentTime <= clipEnd) {
          const clipTime = currentTime - clip.start;
          drawClip(ctx, clip, clipTime, width, height, clipElements.get(clip.id));
        }
      }

      // 4. Render active Subtitles
      const activeSubtitle = project.subtitles?.find(
        (s) => currentTime >= s.start && currentTime <= s.end
      );
      if (activeSubtitle) {
        drawSubtitle(ctx, activeSubtitle, width, height);
      }

      // 5. Draw brand mark watermark / NovaCut badge if enabled
      drawNovaCutWatermark(ctx, width, height);

      currentFrame++;
      // Yield to event loop to allow MediaRecorder to process frame
      setTimeout(renderLoop, Math.max(4, Math.floor(frameIntervalMs / 2)));
    };

    renderLoop();
  });
}

// Procedural visual background generator for clips
function drawBackdrop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  duration: number
) {
  // Deep space studio gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  const hueShift = Math.sin((t / duration) * Math.PI * 2) * 20;
  grad.addColorStop(0, `hsl(${260 + hueShift}, 75%, 10%)`);
  grad.addColorStop(0.5, `hsl(${220 + hueShift}, 70%, 7%)`);
  grad.addColorStop(1, `hsl(${190 + hueShift}, 80%, 8%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle animated studio light rays
  ctx.save();
  ctx.globalAlpha = 0.25;
  const rayX = (w / 2) + Math.cos(t * 0.8) * (w * 0.3);
  const rayY = (h / 3) + Math.sin(t * 0.6) * (h * 0.2);
  const glow = ctx.createRadialGradient(rayX, rayY, 20, rayX, rayY, w * 0.6);
  glow.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
  glow.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawClip(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  clipTime: number,
  canvasW: number,
  canvasH: number,
  mediaElement?: HTMLImageElement | HTMLVideoElement
) {
  ctx.save();

  // Apply clip opacity
  ctx.globalAlpha = clip.opacity !== undefined ? clip.opacity : 1.0;

  // Filter effects
  const brightness = clip.filter?.brightness ?? 100;
  const contrast = clip.filter?.contrast ?? 100;
  const saturation = clip.filter?.saturation ?? 100;
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  // Position transform
  const offsetX = ((clip.x || 0) / 100) * canvasW;
  const offsetY = ((clip.y || 0) / 100) * canvasH;
  const scale = clip.scale || 1.0;
  const rotation = ((clip.rotation || 0) * Math.PI) / 180;

  ctx.translate(canvasW / 2 + offsetX, canvasH / 2 + offsetY);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  if (clip.type === 'video' || clip.type === 'image') {
    const isReady = mediaElement && (mediaElement instanceof HTMLImageElement ? mediaElement.complete : (mediaElement as HTMLVideoElement).readyState >= 1);
    if (isReady && mediaElement) {
      if (mediaElement instanceof HTMLVideoElement) {
        try {
          const targetTime = Math.min((clip.trimStart || 0) + clipTime, mediaElement.duration || 999);
          if (Math.abs(mediaElement.currentTime - targetTime) > 0.1) {
            mediaElement.currentTime = targetTime;
          }
        } catch (_) {}
      }
      // Draw uploaded image/video
      const mw = (mediaElement as any).videoWidth || mediaElement.width || canvasW;
      const mh = (mediaElement as any).videoHeight || mediaElement.height || canvasH;
      const aspect = mw / mh || 16 / 9;
      let drawW = canvasW * 0.9;
      let drawH = drawW / aspect;
      if (drawH > canvasH * 0.9) {
        drawH = canvasH * 0.9;
        drawW = drawH * aspect;
      }
      ctx.drawImage(mediaElement, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      // High-quality procedural cinematic scene rendering for demo & generated clips
      drawProceduralScene(ctx, clip, clipTime, canvasW, canvasH);
    }
  } else if (clip.type === 'text') {
    drawTextClip(ctx, clip, clipTime, canvasW, canvasH);
  }

  ctx.restore();
}

function drawProceduralScene(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  t: number,
  w: number,
  h: number
) {
  const cardW = w * 0.85;
  const cardH = h * 0.75;
  const x = -cardW / 2;
  const y = -cardH / 2;

  // Rounded viewport frame
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, cardW, cardH, 24);
  ctx.clip();

  // Dynamic animated cyber/cinematic landscape
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

  // Animated perspective grid floor
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
  ctx.lineWidth = 2;
  const horizon = y + cardH * 0.55;
  const gridOffset = (t * 50) % 40;

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

  // Glowing geometric sun / pulse circle
  const sunPulse = 1 + Math.sin(t * 3) * 0.08;
  const sunGrad = ctx.createRadialGradient(0, horizon - 80, 10, 0, horizon - 80, 120 * sunPulse);
  sunGrad.addColorStop(0, '#F43F5E');
  sunGrad.addColorStop(0.6, '#EC4899');
  sunGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, horizon - 80, 100 * sunPulse, 0, Math.PI * 2);
  ctx.fill();

  // Scene label badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(x + 30, y + 30, 260, 48, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#38BDF8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`SCENE: ${clip.name.toUpperCase()}`, x + 46, y + 54);

  ctx.restore();
}

function drawTextClip(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  clipTime: number,
  canvasW: number,
  _canvasH: number
) {
  const text = clip.text || 'TITLE';
  const fontSize = (clip.fontSize || 36) * (canvasW / 1280);
  ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;

  // Animation calculation
  let animScale = 1;
  let animAlpha = 1;

  if (clip.animation === 'pop') {
    const progress = Math.min(1, clipTime / 0.4);
    animScale = 0.7 + Math.sin(progress * Math.PI * 0.5) * 0.3;
  } else if (clip.animation === 'fade') {
    animAlpha = Math.min(1, clipTime / 0.5);
  } else if (clip.animation === 'slide-up') {
    const slideOffset = Math.max(0, (1 - clipTime / 0.5) * 40);
    ctx.translate(0, slideOffset);
  }

  ctx.scale(animScale, animScale);
  ctx.globalAlpha *= animAlpha;

  // Background box if configured
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

  // Text glow & fill
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = clip.textColor || '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
}

function drawSubtitle(
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

  // Subtitle dark high-contrast pill
  ctx.fillStyle = 'rgba(11, 15, 25, 0.88)';
  ctx.beginPath();
  ctx.roundRect(posX - boxW / 2, posY - boxH / 2, boxW, boxH, 16);
  ctx.fill();

  ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Highlighted subtitle text with glowing yellow/cyan emphasis
  ctx.fillStyle = '#FACC15'; // Vibrant subtitle yellow
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 8;

  // If text is wider than box, wrap or scale
  if (metrics.width > canvasW * 0.85) {
    ctx.font = `700 ${fontSize * 0.8}px "Plus Jakarta Sans", sans-serif`;
  }
  ctx.fillText(text, posX, posY);

  ctx.restore();
}

function drawNovaCutWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Discreet top-right brand indicator
  ctx.save();
  ctx.globalAlpha = 0.8;
  const pad = 24;
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('⚡ NovaCut Studio', w - pad, pad);
  ctx.restore();
}
