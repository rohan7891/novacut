import React, { useState, useEffect } from 'react';
import { Project, Template, User } from './types';
import { Navbar } from './components/brand/Navbar';
import { Footer } from './components/brand/Footer';
import { LandingPage } from './pages/LandingPage';
import { VideoEditor } from './components/editor/VideoEditor';
import { DashboardPage } from './pages/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AIToolsPage } from './pages/AIToolsPage';
import { PricingPage } from './pages/PricingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { AdminPage } from './pages/AdminPage';
import { AuthModal } from './pages/AuthModal';
import { LegalModal } from './pages/LegalModal';
import { 
  getAllProjects, 
  getCurrentProjectId, 
  getProjectById, 
  getStoredUser, 
  saveProject, 
  saveStoredUser,
  deleteProject,
  duplicateProject
} from './utils/storage';
import { createDefaultProject } from './utils/sampleData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [user, setUser] = useState<User>(() => getStoredUser());
  const [projects, setProjects] = useState<Project[]>(() => getAllProjects());
  
  // Active Project for VideoEditor
  const [activeProject, setActiveProject] = useState<Project>(() => {
    const id = getCurrentProjectId();
    if (id) {
      const found = getProjectById(id);
      if (found) return found;
    }
    const all = getAllProjects();
    return all[0] || createDefaultProject();
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean; type: 'terms' | 'privacy' }>({
    open: false,
    type: 'terms',
  });

  // Keep stored user updated
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  const handleLogout = () => {
    const defaultGuest: User = {
      id: 'usr_guest',
      email: 'creator@novacut.app',
      name: 'NovaCut Creator',
      role: 'user',
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    setUser(defaultGuest);
    saveStoredUser(defaultGuest);
  };

  const handleOpenProject = (projectId: string) => {
    const proj = getProjectById(projectId);
    if (proj) {
      setActiveProject(proj);
      setCurrentTab('editor');
    }
  };

  const handleCreateNewProject = (aspectRatio: '16:9' | '9:16' | '1:1') => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: `Untitled Video Project`,
      aspectRatio,
      duration: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: [
        { id: 'track-text', name: 'Text & Titles', type: 'text' },
        { id: 'track-subtitles', name: 'Subtitles & Captions', type: 'subtitle' },
        { id: 'track-video', name: 'Video 1', type: 'video' },
        { id: 'track-audio', name: 'Audio & Music', type: 'audio' },
      ],
      clips: [
        {
          id: `clip-${Date.now()}`,
          trackId: 'track-video',
          type: 'video',
          name: 'Cyberpunk Scene',
          start: 0,
          duration: 10,
          trimStart: 0,
          trimEnd: 0,
          opacity: 1,
          volume: 0.8,
        },
        {
          id: `text-${Date.now()}`,
          trackId: 'track-text',
          type: 'text',
          name: 'Title Card',
          start: 0.5,
          duration: 4,
          trimStart: 0,
          trimEnd: 0,
          text: 'NEW STORY',
          fontSize: 40,
          fontFamily: 'Plus Jakarta Sans',
          textColor: '#FFFFFF',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          textAlignment: 'center',
          animation: 'pop',
        }
      ],
      subtitles: [
        { id: 'sub-1', start: 0.8, end: 4.0, text: 'Create beyond limits with NovaCut.' }
      ]
    };

    saveProject(newProj);
    setProjects(getAllProjects());
    setActiveProject(newProj);
    setCurrentTab('editor');
  };

  const handleUseTemplate = (template: Template) => {
    const tmplProj = createDefaultProject(template.title);
    tmplProj.aspectRatio = template.aspectRatio;
    tmplProj.duration = template.duration;

    saveProject(tmplProj);
    setProjects(getAllProjects());
    setActiveProject(tmplProj);
    setCurrentTab('editor');
  };

  const handleDuplicate = (projectId: string) => {
    duplicateProject(projectId);
    setProjects(getAllProjects());
  };

  const handleDelete = (projectId: string) => {
    const updated = deleteProject(projectId);
    setProjects(updated);
    if (activeProject.id === projectId) {
      if (updated.length > 0) {
        setActiveProject(updated[0]);
      } else {
        const fresh = createDefaultProject();
        saveProject(fresh);
        setActiveProject(fresh);
        setProjects([fresh]);
      }
    }
  };

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'home' && (
          <LandingPage
            onStartEditing={() => setCurrentTab('editor')}
            onNavigate={setCurrentTab}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'editor' && (
          <VideoEditor
            key={activeProject.id}
            initialProject={activeProject}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'projects' && (
          <DashboardPage
            projects={projects}
            onOpenProject={handleOpenProject}
            onCreateNewProject={handleCreateNewProject}
            onDuplicateProject={handleDuplicate}
            onDeleteProject={handleDelete}
            user={user}
          />
        )}

        {currentTab === 'templates' && (
          <TemplatesPage onUseTemplate={handleUseTemplate} />
        )}

        {currentTab === 'ai-tools' && (
          <AIToolsPage />
        )}

        {currentTab === 'pricing' && (
          <PricingPage onStartEditing={() => setCurrentTab('editor')} />
        )}

        {currentTab === 'profile' && (
          <ProfilePage user={user} onUpdateUser={handleUpdateUser} />
        )}

        {currentTab === 'support' && (
          <SupportPage />
        )}

        {currentTab === 'admin' && (
          <AdminPage user={user} onNavigateHome={() => setCurrentTab('home')} />
        )}
      </main>

      {/* Global Brand Footer (Except inside the focused Editor) */}
      {currentTab !== 'editor' && (
        <Footer
          onNavigate={setCurrentTab}
          onOpenLegal={(type) => setLegalModal({ open: true, type })}
        />
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleUpdateUser}
      />

      <LegalModal
        isOpen={legalModal.open}
        type={legalModal.type}
        onClose={() => setLegalModal({ ...legalModal, open: false })}
      />

    </div>
  );
}
