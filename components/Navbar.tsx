'use client';

import { Film, Clapperboard, Play, Bot, FolderOpen, Sparkles, Download } from 'lucide-react';

interface NavbarProps {
  activeTab: 'editor' | 'storyboard' | 'player' | 'copilot' | 'projects';
  setActiveTab: (tab: 'editor' | 'storyboard' | 'player' | 'copilot' | 'projects') => void;
  sceneCount: number;
  onExport: () => void;
}

export default function Navbar({ activeTab, setActiveTab, sceneCount, onExport }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0b18]/90 backdrop-blur-md border-b border-[#30304d] px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#36e4ff] to-[#a855f7] flex items-center justify-center text-[#090918] font-black text-xl shadow-[0_0_25px_rgba(139,92,246,0.3)]">
          RF
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            RF Cinema IA
            <span className="text-[10px] bg-[#36e4ff]/15 text-[#36e4ff] border border-[#36e4ff]/30 px-2 py-0.5 rounded-full font-semibold">
              PRO v2.5
            </span>
          </h1>
          <p className="text-xs text-[#aaaac7]">Estúdio Profissional de Curtas com Inteligência Artificial</p>
        </div>
      </div>

      <nav className="flex items-center gap-1.5 bg-[#15152a] p-1.5 rounded-2xl border border-[#30304d]">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'editor'
              ? 'bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] shadow-md'
              : 'text-[#aaaac7] hover:text-white hover:bg-[#1c1c35]'
          }`}
        >
          <Clapperboard className="w-4 h-4" />
          <span>Roteiro & Estúdio</span>
        </button>

        <button
          onClick={() => setActiveTab('storyboard')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
            activeTab === 'storyboard'
              ? 'bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] shadow-md'
              : 'text-[#aaaac7] hover:text-white hover:bg-[#1c1c35]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Storyboard</span>
          {sceneCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'storyboard' ? 'bg-[#070718] text-[#36e4ff]' : 'bg-[#36e4ff]/20 text-[#36e4ff]'}`}>
              {sceneCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('player')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'player'
              ? 'bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] shadow-md'
              : 'text-[#aaaac7] hover:text-white hover:bg-[#1c1c35]'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Director&apos;s Cut</span>
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'copilot'
              ? 'bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] shadow-md'
              : 'text-[#aaaac7] hover:text-white hover:bg-[#1c1c35]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Assistente IA</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'projects'
              ? 'bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] shadow-md'
              : 'text-[#aaaac7] hover:text-white hover:bg-[#1c1c35]'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Meus Projetos</span>
        </button>
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#252542] hover:bg-[#32325c] border border-[#444466] text-[#eee] transition-colors"
          title="Exportar Storyboard ou Projeto"
        >
          <Download className="w-3.5 h-3.5 text-[#36e4ff]" />
          <span>Exportar</span>
        </button>
      </div>
    </header>
  );
}
