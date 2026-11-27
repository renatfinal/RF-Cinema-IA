'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudioEditor from '@/components/StudioEditor';
import StoryboardView from '@/components/StoryboardView';
import DirectorPlayer from '@/components/DirectorPlayer';
import ShortsAnimator from '@/components/ShortsAnimator';
import AiCopilot from '@/components/AiCopilot';
import ProjectsView from '@/components/ProjectsView';
import { Scene, CinemaProject } from '@/types/cinema';
import confetti from 'canvas-confetti';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'editor' | 'storyboard' | 'player' | 'shorts' | 'copilot' | 'projects'>('editor');
  
  const initialProject = (() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('rfCinemaIAProject') : null;
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  })();

  const [title, setTitle] = useState(initialProject?.title || 'Uma história para lembrar');
  const [style, setStyle] = useState(initialProject?.style || 'Filme bíblico / histórico épico');
  const [duration, setDuration] = useState(initialProject?.duration || '4 minutos');
  const [format, setFormat] = useState(initialProject?.format || 'YouTube (Horizontal 16:9)');
  const [language, setLanguage] = useState(initialProject?.language || 'Português brasileiro');
  const [script, setScript] = useState(initialProject?.script || '');
  const [scenes, setScenes] = useState<Scene[]>(initialProject?.scenes || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Pronto para começar. Escreva ou cole um roteiro.');

  const loadExample = () => {
    setTitle('O conselho do avô');
    setStyle('Filme bíblico / histórico épico');
    setDuration('4 minutos');
    setFormat('YouTube (Horizontal 16:9)');
    setLanguage('Português brasileiro');
    setScript(
      'Um menino visita o avô no quintal ao entardecer. O menino pergunta por que deve obedecer aos pais. O avô explica com carinho que a obediência, o respeito e o amor ajudam a família a viver em paz. Ele cita: “Honra teu pai e tua mãe” (Êxodo 20:12). O menino conta que às vezes fica impaciente, e o avô ensina que todos podem aprender a ouvir e conversar. No final, o menino abraça o avô e promete tentar agir com mais respeito. A família se reúne para o jantar, feliz.'
    );
    setStatusMessage('Exemplo carregado. Clique em “Transformar em cenas com IA”.');
  };

  const handleBreakdown = async () => {
    if (!script.trim()) {
      setStatusMessage('Escreva ou cole um roteiro antes de gerar as cenas.');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Analisando roteiro e estruturando cenas com IA (Gemini 2.5)...');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'breakdown',
          script,
          style,
          duration,
          format,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar cenas.');

      if (data.scenes && Array.isArray(data.scenes)) {
        setScenes(data.scenes);
        setStatusMessage(`Storyboard criado com sucesso: ${data.scenes.length} cenas geradas.`);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        setActiveTab('storyboard');
      } else {
        throw new Error('Formato de resposta inválido.');
      }
    } catch (err: any) {
      setStatusMessage('Erro ao gerar cenas: ' + (err.message || 'Tente novamente.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = () => {
    try {
      const projectData = {
        title,
        style,
        duration,
        format,
        language,
        script,
        scenes,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('rfCinemaIAProject', JSON.stringify(projectData));
      setStatusMessage('Projeto salvo com sucesso no navegador!');
      setTimeout(() => setStatusMessage('Pronto.'), 3000);
    } catch (e) {
      setStatusMessage('Não foi possível salvar localmente.');
    }
  };

  const exportStoryboard = () => {
    if (scenes.length === 0) {
      setStatusMessage('Gere as cenas antes de exportar o storyboard.');
      return;
    }
    const text = `${title}\nRF Cinema IA — Storyboard Profissional\nDuração: ${duration}\nFormato: ${format}\nEstilo: ${style}\n\nROTEIRO ORIGINAL\n${script}\n\n${scenes
      .map(
        (s) =>
          `CENA ${s.number}: ${s.title} (${s.duration}s)\nVISUAL: ${s.visual}\nAÇÃO: ${s.action}\nDIÁLOGO: ${
            s.dialogue || 'N/A'
          }\n`
      )
      .join('\n')}`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-storyboard.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (proj: CinemaProject) => {
    setTitle(proj.title);
    setStyle(proj.style);
    setDuration(proj.duration);
    setFormat(proj.format || 'YouTube (Horizontal 16:9)');
    setLanguage(proj.language);
    setScript(proj.script);
    setScenes(proj.scenes);
    setActiveTab('storyboard');
  };

  const handleNewProject = () => {
    setTitle('Novo curta-metragem');
    setStyle('Filme realista cinematográfico');
    setDuration('4 minutos');
    setFormat('YouTube (Horizontal 16:9)');
    setLanguage('Português brasileiro');
    setScript('');
    setScenes([]);
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen bg-[#0b0b18] text-[#f5f5ff] flex flex-col selection:bg-[#36e4ff] selection:text-[#070718]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sceneCount={scenes.length}
        onExport={exportStoryboard}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {activeTab === 'editor' && (
          <StudioEditor
            title={title}
            setTitle={setTitle}
            style={style}
            setStyle={setStyle}
            duration={duration}
            setDuration={setDuration}
            format={format}
            setFormat={setFormat}
            language={language}
            setLanguage={setLanguage}
            script={script}
            setScript={setScript}
            onBreakdown={handleBreakdown}
            isGenerating={isGenerating}
            statusMessage={statusMessage}
            onSave={saveProject}
            onLoadExample={loadExample}
            scenes={scenes}
            goToStoryboard={() => setActiveTab('storyboard')}
          />
        )}

        {activeTab === 'storyboard' && (
          <StoryboardView
            scenes={scenes}
            setScenes={setScenes}
            title={title}
            style={style}
            goToPlayer={() => setActiveTab('player')}
          />
        )}

        {activeTab === 'player' && (
          <DirectorPlayer scenes={scenes} title={title} style={style} goToShorts={() => setActiveTab('shorts')} />
        )}

        {activeTab === 'shorts' && <ShortsAnimator goToCopilot={() => setActiveTab('copilot')} />}

        {activeTab === 'copilot' && <AiCopilot goToProjects={() => setActiveTab('projects')} />}

        {activeTab === 'projects' && (
          <ProjectsView
            onLoadProject={handleLoadProject}
            currentProject={{ title, style, duration, format, language, script, scenes }}
            onNewProject={handleNewProject}
          />
        )}
      </main>

      <footer className="text-center text-[#777794] text-xs py-6 border-t border-[#30304d]">
        RF Cinema IA · Estúdio Profissional de Curtas · Desenvolvido com Google Gemini AI
      </footer>
    </div>
  );
}
