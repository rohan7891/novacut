export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '3:4';
export type Resolution = '480p' | '720p' | '1080p' | '4k';
export type ExportFormat = 'webm' | 'mp4';

export type ClipType = 'video' | 'audio' | 'image' | 'text' | 'subtitle';

export interface VideoFilter {
  brightness: number; // 0 - 200 (100 is normal)
  contrast: number;   // 0 - 200 (100 is normal)
  saturation: number; // 0 - 200 (100 is normal)
  preset?: 'none' | 'cinematic' | 'cyberpunk' | 'vintage' | 'bw' | 'warm';
  chromaKey?: boolean;
  chromaKeyColor?: string; // hex
  chromaKeyTolerance?: number; // 0 - 100
}

export interface Clip {
  id: string;
  trackId: string;
  type: ClipType;
  name: string;
  src?: string; // Blob URL, object URL, or data URI
  duration: number; // in seconds
  start: number;    // start time on timeline (seconds)
  trimStart: number;// trim from source beginning
  trimEnd: number;  // trim from source end
  
  // Audio properties
  volume?: number;  // 0 - 1 (1 is normal)
  playbackRate?: number; // 0.5 - 2.0
  fadeIn?: number;  // seconds
  fadeOut?: number; // seconds
  
  // Visual properties
  x?: number;       // offset X percentage (-50 to +50)
  y?: number;       // offset Y percentage (-50 to +50)
  scale?: number;   // scale factor (0.1 - 3.0)
  rotation?: number;// degrees
  opacity?: number; // 0 - 1
  filter?: VideoFilter;

  // Text / Subtitle specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  backgroundColor?: string;
  textAlignment?: 'left' | 'center' | 'right';
  animation?: 'none' | 'fade' | 'pop' | 'slide-up' | 'typewriter';
}

export interface Track {
  id: string;
  name: string;
  type: ClipType;
  muted?: boolean;
  locked?: boolean;
  hidden?: boolean;
}

export interface SubtitleItem {
  id: string;
  start: number; // seconds
  end: number;   // seconds
  text: string;
}

export interface Project {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  duration: number; // calculated total duration
  tracks: Track[];
  clips: Clip[];
  subtitles: SubtitleItem[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  plan: 'free' | 'pro' | 'team';
  createdAt: string;
}

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  active: boolean;
  features: string[];
  maxExportsPerMonth: number | 'unlimited';
  maxResolution: Resolution;
  cloudStorageMb: number;
  aiCreditsPerMonth: number;
  trialDays: number;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'vlog' | 'education' | 'gaming' | 'business' | 'product' | 'social' | 'intro';
  aspectRatio: AspectRatio;
  duration: number;
  previewUrl: string;
  tags: string[];
  published: boolean;
  projectData: Partial<Project>;
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  date: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}
