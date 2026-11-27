'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Trash2, Save, Clapperboard, Film, Play, HelpCircle, Loader2 } from 'lucide-react';
import { Scene } from '@/types/cinema';

interface StudioEditorProps {
  title: string;
  setTitle: (t: string) => void;
  style: string;
  setStyle: (s: string) => void;
  duration: string;
  setDuration: (d: string) => void;
  format: string;
  setFormat: (f: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  script: string;
  setScript: (s: string) => void;
  onBreakdown: () => void;
  isGenerating: boolean;
  statusMessage: string;
  onSave: () => void;
  onLoadExample: () => void;
  scenes: Scene[];
  goToStoryboard: () => void;
}

export default function StudioEditor({
  title,
  setTitle,
  style,
  setStyle,
  duration,
  setDuration,
  format,
  setFormat,
  language,
  setLanguage,
  script,
  setScript,
  onBreakdown,
  isGenerating,
  statusMessage,
  onSave,
  onLoadExample,
  scenes,
  goToStoryboard,
}: StudioEditorProps) {
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptGenError, setScriptGenError] = useState('');

  const handleGenerateScript = async () => {
    if (!ideaPrompt.trim()) {
      setScriptGenError('Digite uma ideia ou sinopse para o roteiro.');
      return;
    }
    setScriptGenError('');
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateScript',
          prompt: ideaPrompt,
          style,
          duration,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar roteiro.');
      setScript(data.result);
      if (!title || title === 'Uma história para lembrar') {
        setTitle(ideaPrompt.slice(0, 40) + '...');
      }
    } catch (err: any) {
      setScriptGenError(err.message || 'Erro ao conectar com a IA.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Hero & Configuration */}
      <div className="lg:col-span-7 space-y-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[#19192f]/90 to-[#111122]/90 border border-[#30304d] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#36e4ff]/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-[#36e4ff] font-extrabold text-xs tracking-widest uppercase">
            ESTÚDIO DE CURTAS COM INTELIGÊNCIA ARTIFICIAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3 leading-tight">
            Transforme ideias em histórias que ganham vida.
          </h2>
          <p className="text-[#aaaac7] text-sm leading-relaxed mb-6">
            Roteirize, divida em cenas cinematográficas, planeje ângulos e prepare sua produção com o poder do Gemini.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('roteiro-textarea');
                el?.focus();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-extrabold text-sm hover:opacity-95 transition-all shadow-lg flex items-center gap-2"
            >
              <span>Começar Roteiro</span>
              <span>↓</span>
            </button>
            <button
              onClick={onLoadExample}
              className="px-5 py-2.5 rounded-xl bg-[#252542] border border-[#444466] text-[#eee] font-bold text-sm hover:bg-[#32325c] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#36e4ff]" />
              <span>Carregar Exemplo</span>
            </button>
          </div>
        </div>

        {/* AI Script Co-writer */}
        <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#36e4ff]" />
              <span>Gerador de Roteiro com IA (Opcional)</span>
            </h3>
            <span className="text-xs text-[#36e4ff] bg-[#36e4ff]/10 px-2.5 py-1 rounded-full font-semibold">Gemini 2.5 Flash</span>
          </div>
          <p className="text-xs text-[#aaaac7]">
            Tem apenas uma premissa? Descreva sua ideia abaixo e deixe a IA redigir um roteiro cinematográfico completo para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={ideaPrompt}
              onChange={(e) => setIdeaPrompt(e.target.value)}
              placeholder="Ex: Um astronauta descobre uma antiga livraria..."
              className="flex-1 bg-[#0e0e20] border border-[#383853] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#6b6b8c] focus:outline-none focus:border-[#36e4ff] transition-all"
            />
            <button
              onClick={handleGenerateScript}
              disabled={isGeneratingScript}
              className="px-4 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
            >
              {isGeneratingScript ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Escrevendo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>CRIAR</span>
                </>
              )}
            </button>
          </div>
          {scriptGenError && <p className="text-xs text-rose-400">{scriptGenError}</p>}
        </div>

        {/* Configuration & Script Form */}
        <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-[#36e4ff]" />
              <span>1. Configurar Produção do Curta</span>
            </h3>
            <span className="text-xs font-bold text-[#36e4ff]">ROTEIRO</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Título do Filme</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do curta"
              className="w-full bg-[#0e0e20] border border-[#383853] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#36e4ff] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Estilo Visual</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-[#0e0e20] border border-[#383853] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#36e4ff] transition-all"
              >
                <option value="Escolher automaticamente">Escolher automaticamente</option>
                <option value="Filme realista cinematográfico">Filme realista cinematográfico</option>
                <option value="Desenho animado 3D (Pixar/Disney)">Desenho animado 3D (Pixar/Disney)</option>
                <option value="Animação 2D clássica">Animação 2D clássica</option>
                <option value="Estilo anime japonês">Estilo anime japonês</option>
                <option value="Filme bíblico / histórico épico">Filme bíblico / histórico épico</option>
                <option value="Fantasia cinematográfica">Fantasia cinematográfica</option>
                <option value="Ficção científica Cyberpunk">Ficção científica Cyberpunk</option>
                <option value="Documentário investigativo">Documentário investigativo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Duração Desejada</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#0e0e20] border border-[#383853] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#36e4ff] transition-all"
              >
                <option value="10 segundos">10 segundos</option>
                <option value="15 segundos">15 segundos</option>
                <option value="30 segundos">30 segundos</option>
                <option value="1 minuto (Teaser)">1 minuto (Teaser)</option>
                <option value="3 minutos">3 minutos</option>
                <option value="4 minutos">4 minutos</option>
                <option value="5 minutos">5 minutos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Formato / Plataforma de Destino</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-[#0e0e20] border border-[#383853] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#36e4ff] transition-all"
            >
              <option value="YouTube (Horizontal 16:9)">YouTube (Horizontal 16:9)</option>
              <option value="TikTok / Instagram Reels / Shorts (Vertical 9:16)">TikTok / Instagram Reels / Shorts (Vertical 9:16)</option>
              <option value="Instagram / Facebook (Quadrado 1:1)">Instagram / Facebook (Quadrado 1:1)</option>
              <option value="Cinema Widescreen (2.39:1)">Cinema Widescreen (2.39:1)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Idioma das Falas e Narração</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#0e0e20] border border-[#383853] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#36e4ff] transition-all"
            >
              <option value="Português brasileiro">Português brasileiro</option>
              <option value="Inglês">Inglês</option>
              <option value="Espanhol">Espanhol</option>
              <option value="Sem diálogos (narração visual pura)">Sem diálogos (narração visual pura)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Roteiro da História</label>
            <textarea
              id="roteiro-textarea"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Escreva ou cole a sua história, descreva os personagens, as falas e o enredo..."
              rows={8}
              className="w-full bg-[#0e0e20] border border-[#383853] rounded-xl p-4 text-sm text-white placeholder-[#6b6b8c] focus:outline-none focus:border-[#36e4ff] transition-all resize-y leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onBreakdown}
              disabled={isGenerating}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-black text-sm hover:opacity-95 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gerando Cenas com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>✨ Transformar em Cenas com IA</span>
                </>
              )}
            </button>
            <button
              onClick={onSave}
              className="px-5 py-3.5 rounded-xl bg-[#252542] hover:bg-[#32325c] border border-[#444466] text-[#eee] font-bold text-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#36e4ff]" />
              <span>Salvar Projeto</span>
            </button>
            <button
              onClick={() => setScript('')}
              className="px-4 py-3.5 rounded-xl bg-[#252542] hover:bg-rose-500/20 border border-[#444466] hover:border-rose-500/50 text-[#aaaac7] hover:text-rose-300 font-bold text-sm transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          </div>

          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-[#101025] border border-[#30304d] text-sm text-[#c7c7e7] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#36e4ff] animate-pulse" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Quick Status & Summary */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl space-y-6 sticky top-24">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-[#36e4ff]" />
              <span>Status da Produção</span>
            </h3>
            <span className="text-xs font-extrabold text-[#36e4ff] bg-[#36e4ff]/10 px-2.5 py-1 rounded-full">
              {scenes.length} CENAS PLANEJADAS
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#101025] border border-[#30304d] space-y-2">
              <div className="flex justify-between text-xs text-[#aaaac7]">
                <span>Progresso do Storyboard</span>
                <span className="text-[#36e4ff] font-bold">{scenes.length > 0 ? '100% Pronto' : '0%'}</span>
              </div>
              <div className="w-full bg-[#292942] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#36e4ff] to-[#a855f7] h-full transition-all duration-500"
                  style={{ width: scenes.length > 0 ? '100% ' : '0%' }}
                />
              </div>
              <p className="text-xs text-[#8f8fac]">
                {scenes.length > 0
                  ? 'Storyboard gerado e pronto para revisão e reprodução.'
                  : 'Insira um roteiro e clique em "Transformar em Cenas" para iniciar.'}
              </p>
            </div>

            {scenes.length > 0 && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={goToStoryboard}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-extrabold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Film className="w-4 h-4" />
                  <span>Ver Storyboard Completo ({scenes.length} Cenas)</span>
                </button>
              </div>
            )}

            <div className="border-t border-[#30304d] pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#aaaac7]">Arquitetura de Produção RF</h4>
              <p className="text-xs text-[#8f8fac] leading-relaxed">
                Este estúdio conecta sua história diretamente a modelos de IA para estruturar planos cinematográficos, descrições visuais para prompts de vídeo e áudio.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#aaaac7]">
                <div className="bg-[#101025] p-2.5 rounded-xl border border-[#30304d]">
                  <strong className="text-white block mb-0.5">Roteiro IA</strong>
                  Gemini 2.5 Flash
                </div>
                <div className="bg-[#101025] p-2.5 rounded-xl border border-[#30304d]">
                  <strong className="text-white block mb-0.5">Visual</strong>
                  Prompts Cinematográficos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
