import { Project, User } from '../types';
import { CURRENT_DEMO_USER, createDefaultProject } from './sampleData';

const PROJECTS_KEY = 'novacut_projects_v1';
const CURRENT_PROJECT_ID_KEY = 'novacut_current_project_id';
const USER_KEY = 'novacut_user_profile';
const EXPORT_HISTORY_KEY = 'novacut_export_history';

export interface ExportHistoryRecord {
  id: string;
  projectId: string;
  projectName: string;
  resolution: string;
  format: string;
  duration: number;
  timestamp: string;
  fileSizeBytes: number;
}

export function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed reading user from storage', e);
  }
  return CURRENT_DEMO_USER;
}

export function saveStoredUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed saving user to storage', e);
  }
}

export function getAllProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed reading projects', e);
  }
  
  // Seed with initial default project
  const initial = [createDefaultProject('Neon Cyberpunk Intro')];
  saveAllProjects(initial);
  return initial;
}

export function saveAllProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('Failed saving projects', e);
  }
}

export function getProjectById(id: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find(p => p.id === id);
}

export function saveProject(project: Project): void {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === project.id);
  const updated = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    projects[index] = updated;
  } else {
    projects.unshift(updated);
  }

  saveAllProjects(projects);
  setCurrentProjectId(project.id);
}

export function deleteProject(id: string): Project[] {
  const projects = getAllProjects().filter(p => p.id !== id);
  saveAllProjects(projects);
  return projects;
}

export function duplicateProject(id: string): Project | null {
  const orig = getProjectById(id);
  if (!orig) return null;

  const clone: Project = {
    ...orig,
    id: `proj-${Date.now()}`,
    title: `${orig.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const projects = getAllProjects();
  projects.unshift(clone);
  saveAllProjects(projects);
  return clone;
}

export function getCurrentProjectId(): string {
  return localStorage.getItem(CURRENT_PROJECT_ID_KEY) || '';
}

export function setCurrentProjectId(id: string): void {
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, id);
}

export function getExportHistory(): ExportHistoryRecord[] {
  try {
    const raw = localStorage.getItem(EXPORT_HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed reading export history', e);
  }
  return [];
}

export function logExportHistory(record: Omit<ExportHistoryRecord, 'id' | 'timestamp'>): void {
  const history = getExportHistory();
  const newRecord: ExportHistoryRecord = {
    ...record,
    id: `exp-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  history.unshift(newRecord);
  try {
    localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.warn('Failed saving export record', e);
  }
}
