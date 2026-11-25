'use client';

import { useState } from 'react';
import { CinemaProject, Scene } from '@/types/cinema';
import { FolderOpen, Plus, Trash2, Download, Film, Clock, Check } from 'lucide-react';

interface ProjectsViewProps {
  onLoadProject: (proj: CinemaProject) => void;
  currentProject: {
    title: string;
    style: string;
    duration: string;
    format?: string;
    language: string;
    script: string;
    scenes: Scene[];
  };
  onNewProject: () => void;
}

export default function ProjectsView({ onLoadProject, currentProject, onNewProject }: ProjectsViewProps) {
  const [savedProjects, setSavedProjects] = useState<CinemaProject[]>(() => {
    try {
      const stored = localStorage.getItem('rfCinemaIA_projects');
      if (stored) {
        return JSON.parse(stored);
      } else {
        const legacy = localStorage.getItem('rfCinemaIAProject');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          const proj: CinemaProject = {
            id: 'proj_legacy_1',
            title: parsed.title || 'Meu Curta',
            style: parsed.style || 'Filme realista',
            duration: parsed.duration || '4 minutos',
            language: parsed.language || 'Português brasileiro',
            script: parsed.script || '',
            scenes: parsed.scenes || [],
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem('rfCinemaIA_projects', JSON.stringify([proj]));
          return [proj];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [statusMsg, setStatusMsg] = useState('');

  const saveCurrentToLocal = () => {
    try {
      const newProj: CinemaProject = {
        id: 'proj_' + Date.now(),
        title: currentProject.title || 'Curta sem título',
        style: currentProject.style,
        duration: currentProject.duration,
        format: currentProject.format,
        language: currentProject.language,
        script: currentProject.script,
        scenes: currentProject.scenes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newProj, ...savedProjects.filter((p) => p.title !== newProj.title)];
      setSavedProjects(updated);
      localStorage.setItem('rfCinemaIA_projects', JSON.stringify(updated));
      setStatusMsg('Projeto salvo com sucesso na sua biblioteca local!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (e) {
      setStatusMsg('Erro ao salvar projeto.');
    }
  };

  const handleDelete = (id: string) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('rfCinemaIA_projects', JSON.stringify(updated));
  };

  const exportProjectJson = (proj: CinemaProject) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proj, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${proj.title.toLowerCase().replace(/\s+/g, '-')}-rf-cinema.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#36e4ff] uppercase tracking-widest">GERENCIAMENTO DE PROJETOS</span>
          <h2 className="text-2xl font-black text-white mt-1">Biblioteca de Curtas</h2>
          <p className="text-xs text-[#aaaac7] mt-1">Salve, carregue e gerencie seus roteiros e storyboards criados no RF Cinema IA.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveCurrentToLocal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-extrabold text-xs hover:opacity-95 transition-all shadow-md flex items-center gap-1.5"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Salvar Curta Atual na Biblioteca</span>
          </button>
          <button
            onClick={onNewProject}
            className="px-4 py-2.5 rounded-xl bg-[#252542] hover:bg-[#32325c] border border-[#444466] text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#36e4ff]" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-[#101025] border border-[#36e4ff]/30 text-sm text-[#36e4ff] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {savedProjects.length === 0 ? (
        <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#22224a] text-[#36e4ff] flex items-center justify-center mx-auto shadow-inner">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhum projeto salvo na biblioteca</h3>
          <p className="text-sm text-[#aaaac7] max-w-md mx-auto">
            Clique em &ldquo;Salvar Curta Atual na Biblioteca&rdquo; para guardar suas criações neste navegador.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#15152a] border border-[#30304d] hover:border-[#36e4ff]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white group-hover:text-[#36e4ff] transition-colors">
                    {proj.title}
                  </h4>
                  <span className="text-[10px] font-semibold bg-[#252542] text-[#d8b4fe] border border-[#444466] px-2 py-0.5 rounded-full">
                    {proj.scenes?.length || 0} Cenas
                  </span>
                </div>
                <p className="text-xs text-[#aaaac7] line-clamp-2">{proj.script || 'Sem roteiro inserido.'}</p>
                <div className="flex items-center gap-4 text-[11px] text-[#8f8fac]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#36e4ff]" />
                    {proj.duration}
                  </span>
                  <span>Estilo: {proj.style}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#30304d] flex items-center justify-between">
                <button
                  onClick={() => onLoadProject(proj)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-bold text-xs hover:opacity-95 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Carregar Roteiro</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => exportProjectJson(proj)}
                    className="p-2 rounded-xl bg-[#252542] hover:bg-[#32325c] text-[#aaaac7] hover:text-white transition-colors"
                    title="Baixar JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 rounded-xl bg-[#252542] hover:bg-rose-500/20 text-[#aaaac7] hover:text-rose-300 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
