'use client';

import { useState } from 'react';
import { Bot, Send, Sparkles, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function AiCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu Co-Piloto de Direção e Roteiro alimentado por Gemini. Como posso ajudar a aprimorar seu curta-metragem hoje? (Ex: sugestões de reviravoltas, técnicas de iluminação dramática, desenvolvimento de personagens...)',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: userMsg,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao conversar com a IA.');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.result }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua solicitação: ' + (err.message || '') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#15152a] border border-[#30304d] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
      {/* Header */}
      <div className="p-4 border-b border-[#30304d] bg-[#111122] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#36e4ff] to-[#a855f7] flex items-center justify-center text-[#070718]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Co-Piloto de Direção IA
              <span className="text-[10px] bg-[#36e4ff]/20 text-[#36e4ff] px-2 py-0.5 rounded-full font-semibold">Gemini 2.5</span>
            </h3>
            <p className="text-xs text-[#aaaac7]">Especialista em roteiro, storyboard e direção cinematográfica</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-[#a855f7] text-white' : 'bg-[#36e4ff] text-[#070718]'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#a855f7] text-white rounded-tr-none'
                  : 'bg-[#101025] border border-[#30304d] text-[#e0e0f0] rounded-tl-none'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#36e4ff] text-[#070718] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#101025] border border-[#30304d] rounded-2xl p-4 text-sm text-[#aaaac7] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#36e4ff]" />
              <span>Pensando na direção da cena...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-[#30304d] bg-[#111122] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre enredo, iluminação, falas ou enquadramentos..."
          className="flex-1 bg-[#0e0e20] border border-[#383853] rounded-xl px-4 py-3 text-sm text-white placeholder-[#6b6b8c] focus:outline-none focus:border-[#36e4ff]"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#36e4ff] to-[#a855f7] text-[#070718] font-black text-sm hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span>Enviar</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
