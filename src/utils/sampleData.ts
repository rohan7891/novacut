import { Project, Template, User } from '../types';

export const CURRENT_DEMO_USER: User = {
  id: 'usr_skm958731',
  email: 'skm958731@gmail.com',
  name: 'SKM Studio Lead',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'free', // All features free for everyone at launch!
  createdAt: '2026-01-15T10:00:00Z',
};

// Stock background music synthesized or hosted royalty-free
export const STOCK_AUDIO = [
  {
    id: 'audio-1',
    name: 'Cybernetic Pulse (Synthwave)',
    category: 'Electronic',
    duration: 32,
    artist: 'NovaCut Beats',
    bpm: 124,
    // Web Audio generated synth sample or reliable data URI
    previewTone: 440,
  },
  {
    id: 'audio-2',
    name: 'Lo-Fi Chill Sunset',
    category: 'Lo-Fi',
    duration: 45,
    artist: 'NovaCut Chill',
    bpm: 85,
    previewTone: 330,
  },
  {
    id: 'audio-3',
    name: 'Cinematic Trailer Boom',
    category: 'Cinematic',
    duration: 20,
    artist: 'Apex Sound Studio',
    bpm: 90,
    previewTone: 110,
  },
  {
    id: 'audio-4',
    name: 'Corporate Uplifting Vibes',
    category: 'Business',
    duration: 38,
    artist: 'Inspire Media',
    bpm: 115,
    previewTone: 523,
  },
];

// Sound Effects
export const SOUND_EFFECTS = [
  { id: 'sfx-1', name: 'Punch Zoom Whoosh', duration: 0.6, type: 'whoosh' },
  { id: 'sfx-2', name: 'Digital Pop Notification', duration: 0.4, type: 'pop' },
  { id: 'sfx-3', name: 'Success Ding Bell', duration: 1.2, type: 'ding' },
  { id: 'sfx-4', name: 'Sub Bass Drop', duration: 2.1, type: 'bass' },
  { id: 'sfx-5', name: 'Glitch Static', duration: 0.8, type: 'glitch' },
];

// Pre-made professional templates
export const TEMPLATES: Template[] = [
  {
    id: 'tmpl-shorts-hook',
    title: 'Viral 60s Shorts / Reels Hook',
    description: 'High-retention 9:16 vertical layout with punchy colored word-by-word captions, dynamic zoom, and upbeat rhythm.',
    category: 'social',
    aspectRatio: '9:16',
    duration: 15,
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    tags: ['Reels', 'TikTok', 'Shorts', 'Viral'],
    published: true,
    projectData: {
      title: 'Viral Shorts Hook Edit',
      aspectRatio: '9:16',
      duration: 15,
    }
  },
  {
    id: 'tmpl-tech-vlog',
    title: 'Modern Tech & Gear Review',
    description: '16:9 widescreen layout with lower third title card, spec highlights box, and smooth cinematic color grade.',
    category: 'vlog',
    aspectRatio: '16:9',
    duration: 25,
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    tags: ['YouTube', 'Tech', 'Review', 'Cinematic'],
    published: true,
    projectData: {
      title: 'Tech Review Episode',
      aspectRatio: '16:9',
      duration: 25,
    }
  },
  {
    id: 'tmpl-product-promo',
    title: 'SaaS & Product Launch Promo',
    description: 'High-contrast typography, electric cyan gradients, split-screen comparison, and compelling call-to-action button.',
    category: 'product',
    aspectRatio: '16:9',
    duration: 20,
    previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    tags: ['Business', 'SaaS', 'Marketing'],
    published: true,
    projectData: {
      title: 'Product Launch 2026',
      aspectRatio: '16:9',
      duration: 20,
    }
  },
  {
    id: 'tmpl-podcast-clip',
    title: 'Podcast Waveform & Bengali/English Captions',
    description: '1:1 Square & 4:5 social snippet with speaker avatar frame, glowing waveform bar, and dual-language subtitle track.',
    category: 'education',
    aspectRatio: '1:1',
    duration: 30,
    previewUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    tags: ['Podcast', 'Subtitles', 'Bengali', 'Square'],
    published: true,
    projectData: {
      title: 'Podcast Snippet Clip',
      aspectRatio: '1:1',
      duration: 30,
    }
  },
  {
    id: 'tmpl-gaming-montage',
    title: 'High-Energy Gaming Highlights',
    description: 'Fast cuts, screen shake keyframes, bass drop sync markers, and RGB split glitch effects.',
    category: 'gaming',
    aspectRatio: '16:9',
    duration: 18,
    previewUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    tags: ['Gaming', 'Twitch', 'Montage'],
    published: true,
    projectData: {
      title: 'Victory Royale Highlights',
      aspectRatio: '16:9',
      duration: 18,
    }
  },
  {
    id: 'tmpl-cinematic-intro',
    title: 'Nebula Cinematic Logo Stinger',
    description: '5-second high impact opening animation with volumetric light rays and deep sub-rumble.',
    category: 'intro',
    aspectRatio: '16:9',
    duration: 6,
    previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    tags: ['Intro', 'Logo', 'Stinger'],
    published: true,
    projectData: {
      title: 'Cinematic Intro Stinger',
      aspectRatio: '16:9',
      duration: 6,
    }
  }
];

// Helper to create an initial default project with rich multitrack demo clips
export function createDefaultProject(title = 'NovaCut Showcase Project'): Project {
  return {
    id: `proj-${Date.now()}`,
    title,
    aspectRatio: '16:9',
    duration: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [
      { id: 'track-text', name: 'Text & Titles', type: 'text' },
      { id: 'track-subtitles', name: 'Subtitles / Captions', type: 'subtitle' },
      { id: 'track-overlay', name: 'Stickers & Overlays', type: 'image' },
      { id: 'track-video', name: 'Video 1', type: 'video' },
      { id: 'track-audio', name: 'Background Music', type: 'audio' },
    ],
    clips: [
      // Video clip 1
      {
        id: 'clip-vid-1',
        trackId: 'track-video',
        type: 'video',
        name: 'Cyberpunk Skyline Scene',
        start: 0,
        duration: 8,
        trimStart: 0,
        trimEnd: 0,
        opacity: 1,
        volume: 0.8,
        filter: {
          brightness: 105,
          contrast: 110,
          saturation: 120,
          preset: 'cyberpunk',
        },
      },
      // Video clip 2
      {
        id: 'clip-vid-2',
        trackId: 'track-video',
        type: 'video',
        name: 'Neon Tech Workspace',
        start: 8,
        duration: 8,
        trimStart: 0,
        trimEnd: 0,
        opacity: 1,
        volume: 0.8,
        filter: {
          brightness: 100,
          contrast: 105,
          saturation: 110,
          preset: 'cinematic',
        },
      },
      // Text Title clip
      {
        id: 'clip-text-1',
        trackId: 'track-text',
        type: 'text',
        name: 'Opening Title Card',
        start: 0.5,
        duration: 5,
        trimStart: 0,
        trimEnd: 0,
        text: 'CREATE BEYOND LIMITS',
        fontSize: 44,
        fontFamily: 'Plus Jakarta Sans',
        textColor: '#FFFFFF',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        textAlignment: 'center',
        x: 0,
        y: -15,
        scale: 1,
        animation: 'pop',
      },
      // Lower third text
      {
        id: 'clip-text-2',
        trackId: 'track-text',
        type: 'text',
        name: 'Lower Third Info',
        start: 7.5,
        duration: 6,
        trimStart: 0,
        trimEnd: 0,
        text: 'NovaCut AI Studio — 100% Free Export',
        fontSize: 24,
        fontFamily: 'Plus Jakarta Sans',
        textColor: '#38BDF8',
        backgroundColor: 'rgba(7, 9, 19, 0.85)',
        textAlignment: 'center',
        x: 0,
        y: 35,
        scale: 1,
        animation: 'slide-up',
      },
      // Background music track
      {
        id: 'clip-audio-1',
        trackId: 'track-audio',
        type: 'audio',
        name: 'Cybernetic Pulse (Main Theme)',
        start: 0,
        duration: 16,
        trimStart: 0,
        trimEnd: 0,
        volume: 0.75,
        fadeIn: 1.0,
        fadeOut: 1.5,
      },
    ],
    subtitles: [
      { id: 'sub-1', start: 0.8, end: 4.5, text: 'Welcome to NovaCut — the next-generation AI video editor.' },
      { id: 'sub-2', start: 5.0, end: 9.8, text: 'Multi-track timeline, AI captions, audio sync, and instant 4K export.' },
      { id: 'sub-3', start: 10.2, end: 15.5, text: 'Every feature is unlocked free for all creators worldwide!' },
    ]
  };
}
