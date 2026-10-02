import React, { useState } from 'react';
import { Template } from '../types';
import { TEMPLATES } from '../utils/sampleData';
import { 
  LayoutTemplate, 
  Search, 
  Play, 
  Sparkles, 
  Film, 
  Clock, 
  Monitor, 
  Smartphone, 
  Heart,
  ChevronRight
} from 'lucide-react';

interface TemplatesPageProps {
  onUseTemplate: (template: Template) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onUseTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'social', label: 'Viral Shorts & Reels' },
    { id: 'vlog', label: 'Tech & Vlogs' },
    { id: 'product', label: 'Product & Business' },
    { id: 'education', label: 'Podcasts & Education' },
    { id: 'gaming', label: 'Gaming Highlights' },
    { id: 'intro', label: 'Cinematic Intros' },
  ];

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] text-slate-100 p-4 sm:p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Royalty-Free Creator Templates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Video Template Library</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Jumpstart your next viral video with pre-assembled multi-track timelines, typography, color grades, and audio tracks. All 100% free.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl bg-[#090D16] border border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col group shadow-lg"
          >
            {/* Template Cover Image / Preview */}
            <div 
              onClick={() => onUseTemplate(template)}
              className="w-full h-48 relative overflow-hidden bg-black cursor-pointer"
            >
              <img
                src={template.previewUrl}
                alt={template.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent" />

              {/* Aspect Ratio Badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-cyan-300">
                {template.aspectRatio}
              </div>

              {/* Duration Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{template.duration}s</span>
              </div>

              {/* Heart favorite button */}
              <button
                onClick={(e) => toggleFavorite(template.id, e)}
                className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${favorites[template.id] ? 'text-rose-500 fill-current' : ''}`} />
              </button>
            </div>

            {/* Template Info Content */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
                  {template.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {template.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {template.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onUseTemplate(template)}
                className="w-full py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 active:scale-98 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Use Template in Studio</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
