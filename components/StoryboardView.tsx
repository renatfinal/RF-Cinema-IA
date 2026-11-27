'use client';

import { useState } from 'react';
import { Scene } from '@/types/cinema';
import { Film, Plus, Trash2, Edit3, Copy, Check, Play, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoryboardViewProps {
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
  title: string;
  style: string;
  goToPlayer: () => void;
}

export default function StoryboardView({ scenes, setScenes, title, style, goToPlayer }: StoryboardViewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Scene | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...scenes[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editForm) {
      const updated = [...scenes];
      updated[editingIndex] = editForm;
      setScenes(updated);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleDeleteScene = (index: number) => {
    const updated = scenes.filter((_, i) => i !== index).map((s, i) => ({ ...s, number: i + 1 }));
    setScenes(updated);
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      number: scenes.length + 1,
      title: 'Nova Cena',
      duration: 15,
      visual: 'Plano cinematográfico mostrando...',
      action: 'Ação da nova cena...',
      dialogue: 'Diálogo ou narração...',
      soundDesign: 'Trilha sonora ambiente',
      style,
    };
    setScenes([...scenes, newScene]);
    setEditingIndex(scenes.length);
    setEditForm(newScene);
  };

  const copyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    goToPlayer();
  };

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 15), 0);
  const mins = Math.floor(totalDuration / 60);
  const secs = totalDuration % 60;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#36e4ff] uppercase tracking-widest">STORYBOARD DO FILME</span>
          <h2 className="text-2xl font-black text-white mt-1">{title || 'Sem Título'}</h2>
          <p className="text-xs text-[#aaaac7] mt-1">
            {scenes.length} Cenas planejadas &middot; Duração total estimada: {mins > 0 ? `${mins}m ` : ''}{secs}s &middot; Estilo: {style}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddScene}
            className="px-4 py-2.5 rounded-xl bg-[#252542] hover:bg-[#32325c] border border-[#444466] text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#36e4ff]" />
            <span>Adicionar Cena</span>
          </button>
          <button
            onClick={triggerCelebration}
            disabled={scenes.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-black text-xs hover:opacity-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar Director&apos;s Cut</span>
          </button>
        </div>
      </div>

      {/* Scenes List */}
      {scenes.length === 0 ? (
        <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#22224a] text-[#36e4ff] flex items-center justify-center mx-auto shadow-inner">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhuma cena gerada ainda</h3>
          <p className="text-sm text-[#aaaac7] max-w-md mx-auto">
            Volte para a aba &ldquo;Roteiro &amp; Estúdio&rdquo; e clique em &ldquo;Transformar em Cenas com IA&rdquo; para estruturar seu curta-metragem.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenes.map((scene, index) => {
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className="bg-[#15152a] border border-[#30304d] hover:border-[#36e4ff]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                {isEditing && editForm ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#36e4ff]">Editando Cena {scene.number}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 bg-[#36e4ff] text-[#070718] rounded-lg text-xs font-bold"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1 bg-[#252542] text-[#aaaac7] rounded-lg text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Título da cena"
                      className="w-full bg-[#0e0e20] border border-[#383853] rounded-lg p-2 text-xs text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={editForm.duration}
                        onChange={(e) => setEditForm({ ...editForm, duration: Number(e.target.value) })}
                        placeholder="Duração (s)"
                        className="w-full bg-[#0e0e20] border border-[#383853] rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={editForm.style || ''}
                        onChange={(e) => setEditForm({ ...editForm, style: e.target.value })}
                        placeholder="Estilo"
                        className="w-full bg-[#0e0e20] border border-[#383853] rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <textarea
                      value={editForm.visual}
                      onChange={(e) => setEditForm({ ...editForm, visual: e.target.value })}
                      placeholder="Descrição visual"
                      rows={2}
                      className="w-full bg-[#0e0e20] border border-[#383853] rounded-lg p-2 text-xs text-white resize-none"
                    />
                    <textarea
                      value={editForm.action}
                      onChange={(e) => setEditForm({ ...editForm, action: e.target.value })}
                      placeholder="Ação"
                      rows={2}
                      className="w-full bg-[#0e0e20] border border-[#383853] rounded-lg p-2 text-xs text-white resize-none"
                    />
                    <textarea
                      value={editForm.dialogue}
                      onChange={(e) => setEditForm({ ...editForm, dialogue: e.target.value })}
                      placeholder="Diálogo"
                      rows={2}
                      className="w-full bg-[#0e0e20] border border-[#383853] rounded-lg p-2 text-xs text-white resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#36e4ff]/15 text-[#36e4ff] font-black text-xs flex items-center justify-center border border-[#36e4ff]/30">
                            {scene.number}
                          </span>
                          <h4 className="text-sm font-bold text-white">{scene.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold bg-[#252542] text-[#d8b4fe] border border-[#444466] px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {scene.duration}s
                          </span>
                          <button
                            onClick={() => handleStartEdit(index)}
                            className="p-1.5 rounded-lg bg-[#252542] hover:bg-[#32325c] text-[#aaaac7] hover:text-white transition-colors"
                            title="Editar Cena"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteScene(index)}
                            className="p-1.5 rounded-lg bg-[#252542] hover:bg-rose-500/20 text-[#aaaac7] hover:text-rose-300 transition-colors"
                            title="Excluir Cena"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Mock cinematic thumbnail placeholder */}
                      <div className="w-full h-32 rounded-xl bg-gradient-to-tr from-[#111122] via-[#1a1a38] to-[#25204d] border border-[#30304d] flex flex-col items-center justify-center relative overflow-hidden group/thumb">
                        <div className="absolute inset-0 bg-radial from-[#36e4ff]/10 to-transparent opacity-50" />
                        <Film className="w-8 h-8 text-[#36e4ff]/60 mb-1 group-hover/thumb:scale-110 transition-transform" />
                        <span className="text-[11px] text-[#aaaac7] font-medium px-4 text-center line-clamp-1">
                          {scene.visual}
                        </span>
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          <button
                            onClick={() => copyPrompt(scene.visual, index)}
                            className="p-1 rounded bg-[#0b0b18]/80 hover:bg-[#0b0b18] text-[#36e4ff] text-[10px] flex items-center gap-1 px-2 border border-[#36e4ff]/30 backdrop-blur-sm"
                            title="Copiar prompt visual para IA"
                          >
                            {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>Prompt</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-[#c6c6df] leading-relaxed">
                          <strong className="text-[#36e4ff]">Visual:</strong> {scene.visual}
                        </p>
                        <p className="text-[#c6c6df] leading-relaxed">
                          <strong className="text-[#a855f7]">Ação:</strong> {scene.action}
                        </p>
                        {scene.dialogue && (
                          <p className="text-[#d7d7ed] italic bg-[#101025] p-2.5 rounded-lg border border-[#30304d]">
                            <strong className="text-white not-italic">Fala/Narração:</strong> &ldquo;{scene.dialogue}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#30304d] flex items-center justify-between text-[11px] text-[#8f8fac]">
                      <span>Estilo: {scene.style || style}</span>
                      <span>Áudio pronto para render</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {scenes.length > 0 && (
        <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl flex items-center justify-between mt-8">
          <div>
            <span className="text-xs text-[#36e4ff] font-bold uppercase tracking-wider">Próximo Passo do Projeto</span>
            <h4 className="text-sm font-bold text-white">Visualizar Direção e Player Cinematográfico (Director&apos;s Cut)</h4>
          </div>
          <button
            onClick={goToPlayer}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-black text-xs hover:opacity-95 transition-all shadow-lg flex items-center gap-2 shrink-0"
          >
            <span>Ir para Player / Director&apos;s Cut</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
