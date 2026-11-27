'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Scene } from '@/types/cinema';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Film, RotateCcw, Sparkles } from 'lucide-react';

interface DirectorPlayerProps {
  scenes: Scene[];
  title: string;
  style: string;
  goToShorts: () => void;
}

export default function DirectorPlayer({ scenes, title, style, goToShorts }: DirectorPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const currentScene = scenes[currentIndex] || null;
  const [secondsLeft, setSecondsLeft] = useState<number>(() => currentScene?.duration || 15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Speech synthesis for dialogue
  const speakDialogue = useCallback(
    (text: string) => {
      if (isMuted || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  useEffect(() => {
    if (isPlaying && currentScene) {
      if (!isMuted && currentScene.dialogue) {
        speakDialogue(currentScene.dialogue);
      }

      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (currentIndex < scenes.length - 1) {
              const nextIdx = currentIndex + 1;
              setCurrentIndex(nextIdx);
              return scenes[nextIdx]?.duration || 15;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, scenes, isMuted, currentScene, speakDialogue]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (currentScene?.dialogue && !isMuted) {
        speakDialogue(currentScene.dialogue);
      }
    } else {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentIndex(0);
    setSecondsLeft(scenes[0]?.duration || 15);
  };

  const goToScene = (index: number) => {
    setCurrentIndex(index);
    setSecondsLeft(scenes[index]?.duration || 15);
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  if (scenes.length === 0) {
    return (
      <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#22224a] text-[#36e4ff] flex items-center justify-center mx-auto shadow-inner">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Nenhuma cena para reproduzir</h3>
        <p className="text-sm text-[#aaaac7] max-w-md mx-auto">
          Gere as cenas no estúdio de roteiro para testar a experiência do Director&apos;s Cut.
        </p>
      </div>
    );
  }

  const durationSec = currentScene?.duration || 15;
  const progressPercentage = ((durationSec - secondsLeft) / durationSec) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Player Stage */}
      <div className="bg-[#0b0b18] border border-[#30304d] rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex flex-col justify-between p-8">
        {/* Background ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#15152a]/80 via-transparent to-[#a855f7]/15 pointer-events-none" />

        {/* Top bar on stage */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-[#15152a]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#30304d]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {title || 'Curta-metragem'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#15152a]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#30304d]">
            <span className="text-xs font-bold text-[#36e4ff]">
              Cena {currentIndex + 1} de {scenes.length}
            </span>
            <span className="text-xs text-[#aaaac7]">({durationSec}s)</span>
          </div>
        </div>

        {/* Center stage visual info */}
        <div className="relative z-10 text-center my-auto space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36e4ff]/10 text-[#36e4ff] text-xs font-semibold border border-[#36e4ff]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentScene?.title}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            &ldquo;{currentScene?.visual}&rdquo;
          </h3>
          {currentScene?.dialogue && (
            <p className="text-sm sm:text-base text-[#d8b4fe] italic bg-[#15152a]/70 backdrop-blur-md py-2.5 px-5 rounded-2xl border border-[#30304d] inline-block">
              &ldquo;{currentScene.dialogue}&rdquo;
            </p>
          )}
        </div>

        {/* Bottom stage control bar */}
        <div className="relative z-10 space-y-3">
          {/* Progress bar */}
          <div className="w-full bg-[#22224a] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#36e4ff] to-[#a855f7] h-full transition-all duration-1000"
              style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="p-2.5 rounded-xl bg-[#15152a] hover:bg-[#252542] border border-[#30304d] text-[#aaaac7] hover:text-white transition-all"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (currentIndex > 0) goToScene(currentIndex - 1);
                }}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-xl bg-[#15152a] hover:bg-[#252542] border border-[#30304d] text-[#aaaac7] hover:text-white transition-all disabled:opacity-40"
                title="Cena Anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] flex items-center justify-center font-black shadow-lg hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  if (currentIndex < scenes.length - 1) goToScene(currentIndex + 1);
                }}
                disabled={currentIndex === scenes.length - 1}
                className="p-2.5 rounded-xl bg-[#15152a] hover:bg-[#252542] border border-[#30304d] text-[#aaaac7] hover:text-white transition-all disabled:opacity-40"
                title="Próxima Cena"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-xl bg-[#15152a] hover:bg-[#252542] border border-[#30304d] text-[#aaaac7] hover:text-white transition-all"
                title={isMuted ? 'Ativar Narração' : 'Silenciar Narração'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#36e4ff]" />}
              </button>
              <div className="bg-[#15152a] border border-[#30304d] px-4 py-2 rounded-xl text-xs font-mono text-[#36e4ff]">
                00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene thumbnail queue */}
      <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-4 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#aaaac7] mb-3">Fila de Cenas</h4>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {scenes.map((s, i) => (
            <button
              key={i}
              onClick={() => goToScene(i)}
              className={`shrink-0 w-36 p-3 rounded-xl border text-left transition-all ${
                currentIndex === i
                  ? 'bg-[#22224a] border-[#36e4ff] shadow-[0_0_15px_rgba(54,228,255,0.2)]'
                  : 'bg-[#0e0e20] border-[#30304d] hover:border-[#444466]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-[#36e4ff]">Cena {s.number}</span>
                <span className="text-[10px] text-[#aaaac7]">{s.duration}s</span>
              </div>
              <p className="text-xs text-white font-medium line-clamp-2">{s.title}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl flex items-center justify-between mt-6">
        <div>
          <span className="text-xs text-[#36e4ff] font-bold uppercase tracking-wider">Próximo Passo do Projeto</span>
          <h4 className="text-sm font-bold text-white">Criar Vídeos Curtos (10s - 15s) com Legendas &amp; Narração</h4>
        </div>
        <button
          onClick={goToShorts}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-black text-xs hover:opacity-95 transition-all shadow-lg flex items-center gap-2 shrink-0"
        >
          <span>Ir para Vídeos Curtos (10-15s)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
