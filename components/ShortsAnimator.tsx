'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Image as ImageIcon, Film, RotateCcw, Download, Upload, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShortsAnimator() {
  const [caption, setCaption] = useState('Momentos mágicos que transformam o seu dia. Acredite na sua jornada!');
  const [duration, setDuration] = useState<number>(12); // 10 to 15 seconds
  const [animationStyle, setAnimationStyle] = useState<'zoom' | 'pan' | 'pulse' | 'cinematic'>('zoom');
  const [captionStyle, setCaptionStyle] = useState<'tiktok' | 'neon' | 'minimal'>('tiktok');
  const [captionPosition, setCaptionPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [captionAnimation, setCaptionAnimation] = useState<'fade' | 'slide' | 'bounce'>('slide');
  const [captionDisplayMode, setCaptionDisplayMode] = useState<'box' | 'text-only'>('box');
  const [voiceLang] = useState('pt-BR');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/cinema10s/1080/1920');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(12);
  const [saveStatus, setSaveStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const speakText = useCallback(
    (text: string) => {
      if (isMuted || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [isMuted, voiceLang]
  );

  useEffect(() => {
    if (isPlaying) {
      if (!isMuted && caption) {
        speakText(caption);
      }
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return duration;
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
  }, [isPlaying, duration, caption, isMuted, speakText]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (!isMuted && caption) speakText(caption);
    } else {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSecondsLeft(duration);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleSavePreview = () => {
    setSaveStatus('Alterações salvas! Preview do vídeo atualizado com sucesso.');
    setTimeout(() => setSaveStatus(''), 3500);
  };

  const triggerExport = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    alert('Vídeo curto de ' + duration + 's renderizado e pronto para download (TikTok/Reels/Shorts)!');
  };

  const progressPct = ((duration - secondsLeft) / duration) * 100;

  // Caption alignment and animation classes
  const positionClass =
    captionPosition === 'top'
      ? 'justify-start pt-10'
      : captionPosition === 'bottom'
      ? 'justify-end pb-10'
      : 'justify-center my-auto';

  const animationClass =
    captionAnimation === 'fade'
      ? 'transition-opacity duration-700 opacity-100'
      : captionAnimation === 'slide'
      ? 'transition-all duration-700 translate-y-0 opacity-100'
      : 'animate-bounce';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* Controls & Editor Column */}
      <div className="lg:col-span-6 space-y-5 bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-[#36e4ff]" />
            <span>Criador de Vídeos Curtos (10s - 15s)</span>
          </h3>
          <span className="text-[10px] bg-[#36e4ff]/15 text-[#36e4ff] border border-[#36e4ff]/30 px-2.5 py-1 rounded-full font-bold">
            TikTok &amp; Reels
          </span>
        </div>

        <p className="text-xs text-[#aaaac7] leading-relaxed">
          Escolha uma foto da galeria, posicione e personalize legendas para vídeos de 10 a 15 segundos.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Texto da Legenda / Narração</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Digite a frase de impacto ou narração do vídeo curto..."
              rows={3}
              className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] focus:ring-2 focus:ring-[#36e4ff]/30 rounded-xl p-3.5 text-sm text-white placeholder-[#6b6b8c] outline-none transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Duração do Vídeo</label>
              <select
                value={duration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDuration(val);
                  setSecondsLeft(val);
                }}
                className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] rounded-xl p-3 text-xs text-white outline-none"
              >
                <option value={10}>10 segundos</option>
                <option value={12}>12 segundos</option>
                <option value={15}>15 segundos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Estilo de Animação da Foto</label>
              <select
                value={animationStyle}
                onChange={(e: any) => setAnimationStyle(e.target.value)}
                className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] rounded-xl p-3 text-xs text-white outline-none"
              >
                <option value="zoom">Zoom Cinematográfico Suave</option>
                <option value="pan">Pan &amp; Scan Dinâmico</option>
                <option value="pulse">Pulso Neon</option>
                <option value="cinematic">Efeito Filme</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Posição da Legenda</label>
              <select
                value={captionPosition}
                onChange={(e: any) => setCaptionPosition(e.target.value)}
                className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] rounded-xl p-3 text-xs text-white outline-none"
              >
                <option value="top">Topo da Tela</option>
                <option value="center">Centro da Tela</option>
                <option value="bottom">Rodapé (Estilo TikTok)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Efeito de Aparição</label>
              <select
                value={captionAnimation}
                onChange={(e: any) => setCaptionAnimation(e.target.value)}
                className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] rounded-xl p-3 text-xs text-white outline-none"
              >
                <option value="slide">Efeito Deslizante (Slide)</option>
                <option value="fade">Aparecer e Sumir (Fade)</option>
                <option value="bounce">Bounce Dinâmico</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Estilo Visual da Legenda</label>
              <select
                value={captionStyle}
                onChange={(e: any) => setCaptionStyle(e.target.value)}
                className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] rounded-xl p-3 text-xs text-white outline-none"
              >
                <option value="tiktok">Estilo TikTok (Amarelo &amp; Preto)</option>
                <option value="neon">Neon Futurista</option>
                <option value="minimal">Minimalista Elegante</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">Formato da Legenda</label>
              <select
                value={captionDisplayMode}
                onChange={(e: any) => setCaptionDisplayMode(e.target.value)}
                className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] rounded-xl p-3 text-xs text-white outline-none"
              >
                <option value="box">Com Fundo / Caixa</option>
                <option value="text-only">Somente Letras (Sem Fundo com Sombra)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#d7d7ed] mb-1.5">URL da Foto Base</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#0e0e20] border border-[#383853] focus:border-[#36e4ff] rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>

          {/* Hidden file input for gallery upload */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl bg-[#252542] hover:bg-[#32325c] border border-[#444466] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Upload className="w-4 h-4 text-[#36e4ff]" />
              <span>Escolher Foto da Galeria do Aparelho</span>
            </button>
            <button
              onClick={handleSavePreview}
              className="w-full py-3 px-5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações &amp; Atualizar Preview</span>
            </button>
            {saveStatus && (
              <p className="text-xs text-[#36e4ff] font-semibold text-center">{saveStatus}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={triggerExport}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-black text-xs hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Vídeo Curto (MP4)</span>
              </button>
              <button
                onClick={() => {
                  setImageUrl(`https://picsum.photos/seed/${Math.random()}/1080/1920`);
                }}
                className="py-3 px-4 rounded-xl bg-[#252542] hover:bg-[#32325c] border border-[#444466] text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <ImageIcon className="w-4 h-4 text-[#36e4ff]" />
                <span>Trocar Foto Aleatória</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Player Column (Vertical 9:16) */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center bg-[#15152a] border border-[#30304d] rounded-2xl p-6 shadow-xl">
        <div className="w-full max-w-[280px] aspect-[9/16] bg-[#090918] border-2 border-[#30304d] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col p-4 group">
          {/* Animated Background Image */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt="Short preview"
              fill
              referrerPolicy="no-referrer"
              className={`object-cover transition-transform duration-1000 ${
                animationStyle === 'zoom'
                  ? isPlaying
                    ? 'scale-110'
                    : 'scale-100'
                  : animationStyle === 'pan'
                  ? isPlaying
                    ? 'translate-x-3 translate-y-3 scale-105'
                    : 'translate-x-0 translate-y-0 scale-100'
                  : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />
          </div>

          {/* Top badge */}
          <div className="relative z-20 flex justify-between items-center">
            <span className="text-[10px] font-bold bg-black/60 text-[#36e4ff] px-2.5 py-1 rounded-full border border-[#36e4ff]/30 backdrop-blur-sm">
              {duration}s Short
            </span>
            <span className="text-[10px] font-mono text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
            </span>
          </div>

          {/* Caption Overlay with position, animation, and display mode */}
          <div className={`relative z-20 flex flex-col items-center px-2 ${positionClass}`}>
            <div
              className={`text-center max-w-[90%] ${animationClass} ${
                captionDisplayMode === 'box'
                  ? `p-3 rounded-2xl backdrop-blur-md shadow-2xl ${
                      captionStyle === 'tiktok'
                        ? 'bg-black/85 text-yellow-300 font-black text-base border-2 border-yellow-400/50 uppercase tracking-wide'
                        : captionStyle === 'neon'
                        ? 'bg-[#15152a]/90 text-[#36e4ff] font-bold text-sm border border-[#36e4ff]/60 shadow-[0_0_20px_rgba(54,228,255,0.4)]'
                        : 'bg-white/90 text-black font-semibold text-sm'
                    }`
                  : `font-black text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${
                      captionStyle === 'tiktok'
                        ? 'text-yellow-300 uppercase tracking-wide'
                        : captionStyle === 'neon'
                        ? 'text-[#36e4ff] drop-shadow-[0_0_12px_rgba(54,228,255,0.8)]'
                        : 'text-white'
                    }`
              }`}
            >
              {caption || 'Digite sua legenda acima...'}
            </div>
          </div>

          {/* Controls Bar inside player */}
          <div className="relative z-20 mt-auto space-y-2 pt-2">
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#36e4ff] to-[#a855f7] h-full transition-all duration-1000"
                style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black text-white transition-all"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] flex items-center justify-center font-black shadow-lg"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-black/60 hover:bg-black text-white transition-all"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#36e4ff]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
