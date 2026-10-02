import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Volume2, 
  Languages, 
  Scissors, 
  FileText, 
  Play, 
  Download, 
  Check, 
  Loader2, 
  Copy,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AIToolsPageProps {
  onOpenEditorWithScript?: (scriptTitle: string) => void;
}

export const AIToolsPage: React.FC<AIToolsPageProps> = ({ onOpenEditorWithScript }) => {
  const [activeTool, setActiveTool] = useState<'script' | 'subtitles' | 'tts' | 'metadata' | 'silence'>('script');

  // Script tool state
  const [topic, setTopic] = useState('How to build a personal brand on YouTube in 2026');
  const [platform, setPlatform] = useState('YouTube Shorts & Reels');
  const [tone, setTone] = useState('High Energy & Engaging');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptResult, setScriptResult] = useState<any>(null);

  // Subtitle state
  const [subLanguage, setSubLanguage] = useState<'English' | 'Bengali'>('English');
  const [subPrompt, setSubPrompt] = useState('A tech reviewer discussing the latest mirrorless camera gear');
  const [isGeneratingSubs, setIsGeneratingSubs] = useState(false);
  const [subResult, setSubResult] = useState<any[]>([]);

  // TTS state
  const [ttsText, setTtsText] = useState('Stop scrolling! If you want to master cinematic video editing in 60 seconds, watch this.');
  const [ttsVoice, setTtsVoice] = useState('Kore');
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);

  // Metadata state
  const [metaQuery, setMetaQuery] = useState('Cinematic color grading tutorial for beginners');
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [metaResult, setMetaResult] = useState<any>(null);

  // Silence cut state
  const [silenceDuration, setSilenceDuration] = useState(45);
  const [isDetectingSilence, setIsDetectingSilence] = useState(false);
  const [silenceResult, setSilenceResult] = useState<any>(null);

  // Generate Script
  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, durationSeconds: 60 }),
      });
      const data = await res.json();
      setScriptResult(data.script);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Generate Subtitles
  const handleGenerateSubs = async () => {
    setIsGeneratingSubs(true);
    try {
      const res = await fetch('/api/ai/subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: subLanguage, audioDescriptionOrTranscript: subPrompt, videoDuration: 20 }),
      });
      const data = await res.json();
      setSubResult(data.subtitles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSubs(false);
    }
  };

  // Generate TTS
  const handleGenerateTTS = async () => {
    setIsGeneratingTTS(true);
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText, voiceName: ttsVoice }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        setTtsAudioUrl(`data:${data.mimeType};base64,${data.audioBase64}`);
      } else {
        alert(data.error || 'TTS requires GEMINI_API_KEY secret on the server.');
      }
    } catch (err: any) {
      alert(err.message || 'TTS generation failed.');
    } finally {
      setIsGeneratingTTS(false);
    }
  };

  // Generate Metadata
  const handleGenerateMeta = async () => {
    setIsGeneratingMeta(true);
    try {
      const res = await fetch('/api/ai/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: metaQuery, platform: 'YouTube & TikTok' }),
      });
      const data = await res.json();
      setMetaResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  // Detect Silence
  const handleDetectSilence = async () => {
    setIsDetectingSilence(true);
    try {
      const res = await fetch('/api/ai/detect-silence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalDuration: silenceDuration, thresholdDb: -35 }),
      });
      const data = await res.json();
      setSilenceResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetectingSilence(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] text-slate-100 p-4 sm:p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Server-Side Gemini AI Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">NovaCut AI Video Studio</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Supercharge your video production with intelligent scriptwriting, Bengali and English auto-subtitles, realistic AI voiceover, viral SEO tags, and silence detection.
        </p>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'script', label: 'Script Assistant', icon: Wand2 },
          { id: 'subtitles', label: 'Bengali & English Captions', icon: Languages },
          { id: 'tts', label: 'AI Voiceover TTS', icon: Volume2 },
          { id: 'metadata', label: 'Viral Titles & Tags', icon: FileText },
          { id: 'silence', label: 'Silence Gap Auto-Cut', icon: Scissors },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: SCRIPT ASSISTANT */}
      {activeTool === 'script' && (
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090D16] border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              <span>AI Video Script & Retention Hook Generator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Creates high-retention 3-second hooks, visual scene breakdowns, narration voiceover lines, and calls to action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Video Topic or Angle</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="High Energy & Engaging">High Energy & Engaging</option>
                <option value="Authoritative & Informative">Authoritative & Informative</option>
                <option value="Humorous & Entertaining">Humorous & Entertaining</option>
                <option value="Cinematic & Dramatic">Cinematic & Dramatic</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGeneratingScript}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all"
          >
            {isGeneratingScript ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Video Script</span>
          </button>

          {scriptResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">Recommended Hook</span>
                <p className="text-sm font-bold text-cyan-300">"{scriptResult.hook}"</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scene Breakdown</h4>
                <div className="space-y-2">
                  {scriptResult.sections?.map((sec: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-purple-400 font-mono text-[11px] font-bold">
                        <span>Scene {idx + 1}</span>
                        <span>{sec.timestamp}</span>
                      </div>
                      <p className="text-slate-300 font-semibold">Visual: {sec.visual}</p>
                      <p className="text-slate-400 italic">Voiceover: "{sec.narration}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <strong className="text-amber-400">Call to Action: </strong>
                <span>{scriptResult.callToAction}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: BENGALI & ENGLISH SUBTITLES */}
      {activeTool === 'subtitles' && (
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090D16] border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Languages className="w-5 h-5 text-cyan-400" />
              <span>Bengali & English Auto-Subtitle Generator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Aligned word timestamps in Bengali and English. Export directly to .SRT format.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800 max-w-sm">
            <button
              onClick={() => setSubLanguage('English')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                subLanguage === 'English' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English Subtitles
            </button>
            <button
              onClick={() => setSubLanguage('Bengali')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                subLanguage === 'Bengali' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা Subtitles
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Speech or Video Context</label>
            <input
              type="text"
              value={subPrompt}
              onChange={(e) => setSubPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleGenerateSubs}
            disabled={isGeneratingSubs}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
          >
            {isGeneratingSubs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            <span>Generate {subLanguage} Subtitles</span>
          </button>

          {subResult.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Generated Segments ({subResult.length})</span>
                <span className="text-emerald-400 font-semibold">✓ Aligned with 1-decimal precision</span>
              </div>
              <div className="space-y-2">
                {subResult.map((sub, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400 mr-3">
                      [{sub.start.toFixed(1)}s - {sub.end.toFixed(1)}s]
                    </span>
                    <span className="text-slate-200 font-medium flex-1">{sub.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: AI TTS VOICEOVER */}
      {activeTool === 'tts' && (
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090D16] border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <span>AI Text-to-Speech (TTS) Voiceover Studio</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Natural speech synthesis powered by Gemini 3.8 Flash Lite TTS. Returns crystal-clear studio audio.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Narration Script</label>
            <textarea
              rows={3}
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Voice Character</label>
              <select
                value={ttsVoice}
                onChange={(e) => setTtsVoice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Kore">Kore (Warm, Professional, Natural)</option>
                <option value="Puck">Puck (Energetic, Fast-Paced, Youthful)</option>
                <option value="Charon">Charon (Deep Cinematic Baritone)</option>
                <option value="Fenrir">Fenrir (Authoritative & Compelling)</option>
                <option value="Zephyr">Zephyr (Bright, Friendly, Casual)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateTTS}
                disabled={isGeneratingTTS}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
              >
                {isGeneratingTTS ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                <span>Synthesize Audio</span>
              </button>
            </div>
          </div>

          {ttsAudioUrl && (
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300">Voiceover Preview ({ttsVoice})</span>
              <audio src={ttsAudioUrl} controls className="w-full h-10" />
            </div>
          )}
        </div>
      )}

      {/* TOOL 4: VIRAL TITLES & TAGS */}
      {activeTool === 'metadata' && (
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090D16] border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Viral Video Titles, SEO Description & Hashtags</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Maximize YouTube & TikTok CTR with high-curiosity headlines and search-optimized descriptions.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Video Topic or Angle</label>
            <input
              type="text"
              value={metaQuery}
              onChange={(e) => setMetaQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleGenerateMeta}
            disabled={isGeneratingMeta}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all"
          >
            {isGeneratingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Suggest Viral Titles & Tags</span>
          </button>

          {metaResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Top Title Variations</h4>
                <div className="space-y-1.5">
                  {metaResult.titles?.map((t: string, i: number) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-semibold flex items-center justify-between">
                      <span>{t}</span>
                      <span className="text-[10px] text-amber-400 font-mono">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trending Hashtags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {metaResult.hashtags?.map((tag: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 5: SILENCE GAP DETECTOR */}
      {activeTool === 'silence' && (
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090D16] border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-rose-400" />
              <span>AI Silence Detector & Jump-Cut Analyzer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Find pauses, hesitations, and dead air across audio tracks to tighten your edit for maximum viewer retention.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Timeline Duration (Seconds): {silenceDuration}s</label>
            <input
              type="range"
              min="10"
              max="180"
              value={silenceDuration}
              onChange={(e) => setSilenceDuration(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded accent-rose-500"
            />
          </div>

          <button
            onClick={handleDetectSilence}
            disabled={isDetectingSilence}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 transition-all"
          >
            {isDetectingSilence ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
            <span>Analyze Silence Intervals</span>
          </button>

          {silenceResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Detected {silenceResult.gapsDetected} Silent Gaps</span>
                  <span className="text-slate-400">Total dead air saved: {silenceResult.totalSilenceSeconds?.toFixed(1)} seconds</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-bold font-mono">
                  -{(silenceResult.totalSilenceSeconds || 0).toFixed(1)}s
                </span>
              </div>

              <div className="space-y-1.5">
                {silenceResult.gaps?.map((gap: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-rose-400">[{gap.start}s - {gap.end}s]</span>
                    <span className="text-slate-300">{gap.reason}</span>
                    <span className="text-slate-500 font-mono">{gap.duration}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
