import React, { useState, useRef } from 'react';
import { Clip, Project, SubtitleItem } from '../../types';
import { STOCK_AUDIO, SOUND_EFFECTS } from '../../utils/sampleData';
import { 
  FolderOpen, 
  Upload, 
  Type, 
  Music, 
  Sparkles, 
  Sliders, 
  Palette, 
  Mic, 
  Play, 
  Plus, 
  FileText, 
  Languages, 
  Download, 
  Scissors, 
  Wand2,
  Volume2,
  Check,
  Loader2
} from 'lucide-react';

interface MediaSidebarProps {
  project: Project;
  onAddClip: (clip: Clip) => void;
  onUpdateSubtitles: (subtitles: SubtitleItem[]) => void;
  currentTime: number;
}

export const MediaSidebar: React.FC<MediaSidebarProps> = ({
  project,
  onAddClip,
  onUpdateSubtitles,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'text' | 'audio' | 'subtitles' | 'ai' | 'filters' | 'brand'>('media');
  
  // Local file uploads
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const srtInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; type: 'video' | 'audio' | 'image'; duration: number; sizeMb?: number }>>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<any>(null);

  // Subtitle generator state
  const [subtitleLang, setSubtitleLang] = useState<'English' | 'Bengali'>('English');
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);

  // AI Script Assistant state
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Energetic');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any>(null);

  // AI TTS state
  const [ttsText, setTtsText] = useState('Welcome to NovaCut. Create beyond limits with our AI video editor.');
  const [ttsVoice, setTtsVoice] = useState('Kore');
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);

  // AI Metadata state
  const [metaTopic, setMetaTopic] = useState('');
  const [generatedMetadata, setGeneratedMetadata] = useState<any>(null);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);

  // Process uploaded files with duration detection and size validation
  const processFiles = (fileList: FileList | File[]) => {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeMb = Math.round((file.size / (1024 * 1024)) * 10) / 10;
      if (sizeMb > 500) {
        alert(`File ${file.name} is ${sizeMb}MB. Large files over 500MB may take longer to process in the browser.`);
      }

      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      const isAudio = file.type.startsWith('audio');
      const isImage = file.type.startsWith('image');
      const type: Clip['type'] = isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : 'video';

      if (isVideo) {
        const vid = document.createElement('video');
        vid.preload = 'metadata';
        vid.src = url;
        vid.onloadedmetadata = () => {
          const duration = Math.max(1, Math.round(vid.duration * 10) / 10);
          setUploadedFiles(prev => [...prev, { name: file.name, url, type, duration, sizeMb }]);
        };
      } else if (isAudio) {
        const aud = document.createElement('audio');
        aud.preload = 'metadata';
        aud.src = url;
        aud.onloadedmetadata = () => {
          const duration = Math.max(1, Math.round(aud.duration * 10) / 10);
          setUploadedFiles(prev => [...prev, { name: file.name, url, type, duration, sizeMb }]);
        };
      } else {
        setUploadedFiles(prev => [...prev, { name: file.name, url, type, duration: 5, sizeMb }]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // SRT file import parser
  const handleSRTImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const parseSrtTime = (timeStr: string): number => {
        const parts = timeStr.trim().split(':');
        if (parts.length < 3) return 0;
        const hours = parseFloat(parts[0]);
        const minutes = parseFloat(parts[1]);
        const secParts = parts[2].split(',');
        const seconds = parseFloat(secParts[0]);
        const ms = secParts[1] ? parseFloat(secParts[1]) / 1000 : 0;
        return hours * 3600 + minutes * 60 + seconds + ms;
      };

      const blocks = content.replace(/\r\n/g, '\n').split('\n\n');
      const parsedSubs: SubtitleItem[] = [];

      for (const block of blocks) {
        const lines = block.trim().split('\n');
        if (lines.length >= 2) {
          const timeLineIndex = lines[0].includes('-->') ? 0 : 1;
          const timeLine = lines[timeLineIndex];
          if (timeLine && timeLine.includes('-->')) {
            const [startStr, endStr] = timeLine.split('-->');
            const textLines = lines.slice(timeLineIndex + 1).join(' ');
            if (startStr && endStr && textLines) {
              parsedSubs.push({
                id: `sub-${Date.now()}-${parsedSubs.length}`,
                start: Math.round(parseSrtTime(startStr) * 10) / 10,
                end: Math.round(parseSrtTime(endStr) * 10) / 10,
                text: textLines.trim(),
              });
            }
          }
        }
      }

      if (parsedSubs.length > 0) {
        onUpdateSubtitles(parsedSubs);
        alert(`Successfully imported ${parsedSubs.length} subtitles from ${file.name}`);
      } else {
        alert('Could not parse subtitles from the selected SRT file. Please check format.');
      }
    };
    reader.readAsText(file);
  };

  // Add uploaded or stock media to timeline
  const addMediaToTimeline = (name: string, url?: string, type: Clip['type'] = 'video', duration = 6) => {
    const targetTrack = project.tracks.find(t => t.type === type) || project.tracks[0];
    const newClip: Clip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      trackId: targetTrack.id,
      type,
      name,
      src: url,
      start: currentTime,
      duration,
      trimStart: 0,
      trimEnd: 0,
      opacity: 1,
      volume: type === 'audio' || type === 'video' ? 0.8 : undefined,
    };
    onAddClip(newClip);
  };

  // Add text element to timeline
  const addTextToTimeline = (preset: 'title' | 'lowerthird' | 'subtitle') => {
    const textTrack = project.tracks.find(t => t.type === 'text') || project.tracks[0];
    const newClip: Clip = {
      id: `text-${Date.now()}`,
      trackId: textTrack.id,
      type: 'text',
      name: preset === 'title' ? 'Big Headline' : preset === 'lowerthird' ? 'Lower Third' : 'Caption Box',
      start: currentTime,
      duration: 5,
      trimStart: 0,
      trimEnd: 0,
      text: preset === 'title' ? 'CREATE BEYOND LIMITS' : preset === 'lowerthird' ? 'NovaCut Creator • Episode 01' : 'Add your caption here',
      fontSize: preset === 'title' ? 42 : 24,
      fontFamily: 'Plus Jakarta Sans',
      textColor: '#FFFFFF',
      backgroundColor: preset === 'title' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(0, 0, 0, 0.75)',
      textAlignment: 'center',
      x: 0,
      y: preset === 'lowerthird' ? 35 : preset === 'title' ? -10 : 25,
      animation: preset === 'title' ? 'pop' : 'slide-up',
    };
    onAddClip(newClip);
  };

  // Microphone Voiceover Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = Math.max(2, recordingSeconds);

        addMediaToTimeline(`Voiceover (${duration}s)`, audioUrl, 'audio', duration);
        setIsRecording(false);
        setRecordingSeconds(0);
        clearInterval(recordingTimerRef.current);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access was denied or not supported in this browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Auto Subtitles generation via Server API
  const generateSubtitles = async () => {
    setIsGeneratingSubtitles(true);
    try {
      const res = await fetch('/api/ai/subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: subtitleLang,
          videoDuration: project.duration,
          audioDescriptionOrTranscript: project.title,
        }),
      });
      const data = await res.json();
      if (data.subtitles && Array.isArray(data.subtitles)) {
        onUpdateSubtitles(data.subtitles);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSubtitles(false);
    }
  };

  // Export SRT
  const exportSRT = () => {
    if (!project.subtitles || project.subtitles.length === 0) {
      alert('No subtitles in project to export.');
      return;
    }

    const srtText = project.subtitles.map((sub, idx) => {
      const formatSrtTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        const ms = Math.floor((s % 1) * 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
      };
      return `${idx + 1}\n${formatSrtTime(sub.start)} --> ${formatSrtTime(sub.end)}\n${sub.text}\n`;
    }).join('\n');

    const blob = new Blob([srtText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_subtitles.srt`;
    a.click();
  };

  // AI Script Assistant
  const generateAIScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic || 'Top video editing tricks for viral retention',
          tone: aiTone,
          platform: 'Shorts/YouTube',
          durationSeconds: project.duration || 30,
        }),
      });
      const data = await res.json();
      setGeneratedScript(data.script);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // AI TTS Generation
  const generateTTS = async () => {
    if (!ttsText) return;
    setIsGeneratingTTS(true);
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsText,
          voiceName: ttsVoice,
        }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        const audioUrl = `data:${data.mimeType};base64,${data.audioBase64}`;
        addMediaToTimeline(`AI Voiceover (${ttsVoice})`, audioUrl, 'audio', 8);
      } else {
        alert(data.error || 'TTS requires GEMINI_API_KEY on the server. Added fallback voice track.');
        addMediaToTimeline(`TTS Voice: ${ttsVoice}`, undefined, 'audio', 8);
      }
    } catch (err: any) {
      alert(err.message || 'TTS generation failed. Please ensure GEMINI_API_KEY is configured.');
    } finally {
      setIsGeneratingTTS(false);
    }
  };

  // AI Metadata Generation
  const generateMetadata = async () => {
    setIsGeneratingMeta(true);
    try {
      const res = await fetch('/api/ai/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: metaTopic || project.title,
          platform: 'YouTube & Shorts',
        }),
      });
      const data = await res.json();
      setGeneratedMetadata(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  const navTabs = [
    { id: 'media', label: 'Media', icon: FolderOpen },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'subtitles', label: 'Captions', icon: Languages },
    { id: 'ai', label: 'AI Suite', icon: Sparkles, badge: 'AI' },
    { id: 'filters', label: 'Filters', icon: Sliders },
    { id: 'brand', label: 'Brand Kit', icon: Palette },
  ];

  return (
    <div className="w-80 sm:w-96 h-full bg-[#090D16] border-r border-slate-800 flex select-none">
      
      {/* Icon Navigation Bar */}
      <div className="w-16 border-r border-slate-800/80 bg-[#070913] flex flex-col items-center py-3 gap-2">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive
                  ? 'bg-purple-900/50 text-cyan-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              {tab.badge && (
                <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-[8px] font-bold text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Panel Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 bg-[#090D16]">
        
        {/* TAB 1: MEDIA */}
        {activeTab === 'media' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Media Assets</h3>
              <p className="text-xs text-slate-400">Upload video, audio, or images to drop into the timeline.</p>
            </div>

            {/* Upload Box with Drag & Drop */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="video/*,audio/*,image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  processFiles(e.dataTransfer.files);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center ${
                isDraggingOver
                  ? 'border-cyan-400 bg-cyan-950/40 scale-[1.02]'
                  : 'border-slate-700 hover:border-purple-500/70 bg-slate-900/40 hover:bg-slate-900/80 group'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-purple-950/60 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200">
                {isDraggingOver ? 'Drop Files Here' : 'Click or Drag & Drop Media'}
              </span>
              <span className="text-[10px] text-slate-500">MP4, WebM, MOV, MP3, WAV, PNG, JPG (up to 500MB)</span>
            </div>

            {/* Uploaded User Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Uploads</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="truncate max-w-[170px] text-slate-200">{file.name}</span>
                      <button
                        onClick={() => addMediaToTimeline(file.name, file.url, file.type, file.duration)}
                        className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Footage Presets */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Stock Scenes</h4>
              <div className="grid grid-cols-2 gap-2">
                <div 
                  onClick={() => addMediaToTimeline('Cyberpunk Neon City', undefined, 'video', 8)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all flex flex-col gap-1.5"
                >
                  <div className="w-full h-16 rounded-lg bg-gradient-to-tr from-purple-900 to-cyan-900 flex items-center justify-center text-xs font-bold text-white">
                    Cyberpunk
                  </div>
                  <span className="text-xs font-medium text-slate-300 truncate">Cyberpunk Scene</span>
                  <span className="text-[10px] text-purple-400 font-mono">8.0s • 4K</span>
                </div>

                <div 
                  onClick={() => addMediaToTimeline('Neon Tech Workspace', undefined, 'video', 8)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all flex flex-col gap-1.5"
                >
                  <div className="w-full h-16 rounded-lg bg-gradient-to-tr from-blue-900 to-slate-900 flex items-center justify-center text-xs font-bold text-white">
                    Tech Setup
                  </div>
                  <span className="text-xs font-medium text-slate-300 truncate">Tech Workspace</span>
                  <span className="text-[10px] text-purple-400 font-mono">8.0s • 1080p</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEXT */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Text & Titles</h3>
              <p className="text-xs text-slate-400">Click any preset to insert an animated title card on the timeline.</p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => addTextToTimeline('title')}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-left flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">
                    BIG HEADLINE
                  </h4>
                  <p className="text-[11px] text-slate-400">Animated pop zoom typography</p>
                </div>
                <Plus className="w-4 h-4 text-purple-400" />
              </button>

              <button
                onClick={() => addTextToTimeline('lowerthird')}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-left flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                    Lower Third Sub-Title
                  </h4>
                  <p className="text-[11px] text-slate-400">Slide-up modern speaker card</p>
                </div>
                <Plus className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => addTextToTimeline('subtitle')}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-left flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-amber-300">
                    High-Contrast Caption Box
                  </h4>
                  <p className="text-[11px] text-slate-400">Yellow vibrant text with dark rounded box</p>
                </div>
                <Plus className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIO */}
        {activeTab === 'audio' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Audio & Voiceover</h3>
              <p className="text-xs text-slate-400">Stock music tracks, SFX, and live microphone voice recording.</p>
            </div>

            {/* Live Microphone Voice-over Recorder */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">Voice-over Mic Recording</span>
                {isRecording && (
                  <span className="text-xs font-mono font-bold text-rose-400 animate-pulse">
                    REC: {recordingSeconds}s
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Record narration straight into your project timeline.</p>
              
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Start Recording Voice</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/50"
                >
                  <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 animate-pulse" />
                  <span>Stop & Insert to Timeline</span>
                </button>
              )}
            </div>

            {/* Royalty-Free Background Music */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Royalty-Free Tracks</h4>
              <div className="space-y-1.5">
                {STOCK_AUDIO.map((track) => (
                  <div key={track.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{track.name}</p>
                      <p className="text-[10px] text-slate-400">{track.category} • {track.duration}s • {track.bpm} BPM</p>
                    </div>
                    <button
                      onClick={() => addMediaToTimeline(track.name, undefined, 'audio', track.duration)}
                      className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sound Effects */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sound Effects (SFX)</h4>
              <div className="grid grid-cols-2 gap-2">
                {SOUND_EFFECTS.map((sfx) => (
                  <button
                    key={sfx.id}
                    onClick={() => addMediaToTimeline(sfx.name, undefined, 'audio', sfx.duration)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left text-xs flex items-center justify-between"
                  >
                    <span className="truncate text-slate-300">{sfx.name}</span>
                    <Plus className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUBTITLES & CAPTIONS */}
        {activeTab === 'subtitles' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Bengali & English Captions</h3>
              <p className="text-xs text-slate-400">Generate auto-synchronized subtitles or import and export SRT files.</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSubtitleLang('English')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  subtitleLang === 'English' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setSubtitleLang('Bengali')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  subtitleLang === 'Bengali' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা (Bengali)
              </button>
            </div>

            {/* Auto-generate button */}
            <button
              onClick={generateSubtitles}
              disabled={isGeneratingSubtitles}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isGeneratingSubtitles ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Aligning Speech Timestamps...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Auto-Generate {subtitleLang} Captions</span>
                </>
              )}
            </button>

            {/* SRT Import / Export */}
            <input
              type="file"
              ref={srtInputRef}
              onChange={handleSRTImport}
              accept=".srt,text/plain"
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => srtInputRef.current?.click()}
                className="flex-1 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                title="Import existing .SRT subtitle file"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Import SRT</span>
              </button>

              <button
                onClick={exportSRT}
                className="flex-1 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                title="Download subtitles as .SRT file"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export SRT</span>
              </button>
            </div>

            {/* Subtitle list editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Subtitles ({project.subtitles?.length || 0})</span>
                <button
                  onClick={() => {
                    const newSub: SubtitleItem = {
                      id: `sub-${Date.now()}`,
                      start: currentTime,
                      end: currentTime + 3,
                      text: subtitleLang === 'Bengali' ? 'নতুন ক্যাপশন যোগ করুন' : 'New caption text',
                    };
                    onUpdateSubtitles([...(project.subtitles || []), newSub]);
                  }}
                  className="text-purple-400 hover:underline font-bold text-[11px]"
                >
                  + Add Line
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {project.subtitles?.map((sub, index) => (
                  <div key={sub.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-purple-400">
                      <span>#{index + 1}</span>
                      <span>{sub.start.toFixed(1)}s - {sub.end.toFixed(1)}s</span>
                    </div>
                    <input
                      type="text"
                      value={sub.text}
                      onChange={(e) => {
                        const updated = project.subtitles.map(s => s.id === sub.id ? { ...s, text: e.target.value } : s);
                        onUpdateSubtitles(updated);
                      }}
                      className="w-full bg-[#070913] border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI SUITE */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">NovaCut AI Suite</h3>
              <p className="text-xs text-slate-400">Powered by server-side Gemini models with zero paywall.</p>
            </div>

            {/* Feature 1: AI Video Script Assistant */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Script & Hook Assistant</span>
              </div>
              <input
                type="text"
                placeholder="Topic: e.g. How to edit like a pro in 60s"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full bg-[#070913] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={generateAIScript}
                disabled={isGeneratingScript}
                className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {isGeneratingScript ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>Generate Video Script</span>
              </button>

              {generatedScript && (
                <div className="p-2 rounded bg-[#070913] border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-bold text-cyan-300">{generatedScript.title}</p>
                  <p className="text-slate-400 italic">"{generatedScript.hook}"</p>
                </div>
              )}
            </div>

            {/* Feature 2: AI Text-to-Speech (TTS) */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Volume2 className="w-3.5 h-3.5" />
                <span>AI Text-to-Speech (TTS) Voiceover</span>
              </div>
              <textarea
                rows={2}
                placeholder="Enter text to convert to voice..."
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                className="w-full bg-[#070913] border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
              <div className="flex items-center gap-2">
                <select
                  value={ttsVoice}
                  onChange={(e) => setTtsVoice(e.target.value)}
                  className="bg-[#070913] border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Kore">Voice: Kore (Natural)</option>
                  <option value="Puck">Voice: Puck (Energetic)</option>
                  <option value="Charon">Voice: Charon (Deep)</option>
                  <option value="Fenrir">Voice: Fenrir (Story)</option>
                  <option value="Zephyr">Voice: Zephyr (Friendly)</option>
                </select>
                <button
                  onClick={generateTTS}
                  disabled={isGeneratingTTS}
                  className="flex-1 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  {isGeneratingTTS ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Synthesize Voice</span>}
                </button>
              </div>
            </div>

            {/* Feature 3: Viral Metadata Suggester */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Viral Titles & Hashtags</span>
              </div>
              <input
                type="text"
                placeholder="Video topic or summary..."
                value={metaTopic}
                onChange={(e) => setMetaTopic(e.target.value)}
                className="w-full bg-[#070913] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={generateMetadata}
                disabled={isGeneratingMeta}
                className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                {isGeneratingMeta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Suggest Titles & Tags</span>}
              </button>

              {generatedMetadata && (
                <div className="p-2 rounded bg-[#070913] border border-slate-800 text-[11px] space-y-1">
                  <p className="font-bold text-amber-300">Top Suggested Title:</p>
                  <p className="text-slate-200">{generatedMetadata.titles?.[0]}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: FILTERS & EFFECTS */}
        {activeTab === 'filters' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Color Grading & Filters</h3>
              <p className="text-xs text-slate-400">Select any active clip in the timeline, then click a style to apply.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'Cinematic', desc: 'Teal & Orange', color: 'from-cyan-900 to-amber-900' },
                { name: 'Cyberpunk', desc: 'Neon Violet & Cyan', color: 'from-purple-900 to-cyan-800' },
                { name: 'Vintage', desc: 'Warm 35mm film', color: 'from-amber-900 to-yellow-950' },
                { name: 'Black & White', desc: 'High drama mono', color: 'from-slate-800 to-black' },
              ].map((filter) => (
                <div
                  key={filter.name}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer flex flex-col gap-2 transition-all"
                >
                  <div className={`w-full h-12 rounded-lg bg-gradient-to-r ${filter.color} flex items-center justify-center text-xs font-bold text-white shadow-inner`}>
                    {filter.name}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{filter.name}</p>
                    <p className="text-[10px] text-slate-400">{filter.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Green Screen / Chroma Key card */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-400">Chroma Key / Green Screen</h4>
              <p className="text-[11px] text-slate-400">
                Isolate green background for gaming facecams and studio overlays. Configurable in Clip Properties Inspector.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: BRAND KIT */}
        {activeTab === 'brand' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Creator Brand Kit</h3>
              <p className="text-xs text-slate-400">Maintain visual consistency across all video exports.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Brand Color Palette</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#9333EA] border border-white/20" title="Nova Purple #9333EA" />
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6] border border-white/20" title="Electric Blue #3B82F6" />
                <div className="w-8 h-8 rounded-lg bg-[#06B6D4] border border-white/20" title="Cyan #06B6D4" />
                <div className="w-8 h-8 rounded-lg bg-[#FACC15] border border-white/20" title="Subtitle Yellow #FACC15" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">Studio Watermark Status</span>
              <p className="text-[11px] text-emerald-400 font-semibold">
                ✓ No mandatory watermark. All exports are 100% clean and watermark-free at launch.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
