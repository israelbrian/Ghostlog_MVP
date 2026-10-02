'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GhostBust } from './GhostBust';
import { audioEngine } from '@/services/audio';

interface DialogueSystemProps {
  speaker: string;
  text: string;
  isPuzzleActive: boolean;
  onNextNode?: () => void;
  soundEnabled?: boolean;
}

/**
 * DialogueSystem: Componente de Visual Novel Isolado (Passo 4)
 * 
 * Responsabilidade: Renderizar o avatar da entidade e exibir o diálogo com
 * efeito de máquina de escrever (typewriter) letra a letra via useEffect.
 * Toca voice blips sintéticos de 8-bits e permite acelerar a exibição ao clicar.
 */
export const DialogueSystem: React.FC<DialogueSystemProps> = ({
  speaker,
  text,
  isPuzzleActive,
  onNextNode,
  soundEnabled = true,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const textIndexRef = useRef<number>(0);

  // Efeito Máquina de Escrever (Typewriter)
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    textIndexRef.current = 0;

    if (!text) return;

    const speed = 28; // Milissegundos por caractere
    const interval = setInterval(() => {
      if (textIndexRef.current < text.length) {
        const nextChar = text.charAt(textIndexRef.current);
        setDisplayedText((prev) => prev + nextChar);
        textIndexRef.current += 1;

        // Toca o Voice Blip sintético se não for espaço
        if (soundEnabled && nextChar.trim() !== '') {
          audioEngine.playVoiceBlip();
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, soundEnabled]);

  /**
   * Permite que o jogador clique para completar o texto instantaneamente se ainda estiver digitando,
   * ou avançar o nó de diálogo se o texto já tiver terminado e não houver enigma pendente.
   */
  const handleBoxClick = () => {
    if (isTyping) {
      // Pula a animação de digitação
      setDisplayedText(text);
      setIsTyping(false);
      textIndexRef.current = text.length;
    } else if (!isPuzzleActive && onNextNode) {
      onNextNode();
    }
  };

  return (
    <div key={text} className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 select-none animate-fade-in">
      {/* Avatar Ectoplásmico Provisório */}
      <GhostBust speakerName={speaker} isTalking={isTyping} />

      {/* Caixa de Diálogo Visual Novel com Glassmorphism */}
      <div
        onClick={handleBoxClick}
        className={`w-full relative group cursor-pointer transition-all duration-300 rounded-2xl border ${
          isPuzzleActive
            ? 'border-purple-500/50 bg-slate-950/80 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
            : 'border-emerald-500/40 bg-slate-950/75 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-400'
        } backdrop-blur-xl p-6 sm:p-8 min-h-[160px] flex flex-col justify-between`}
      >
        {/* Cabeçalho com Nome do Orador */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="font-mono text-lg font-bold tracking-wider text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              {speaker}
            </span>
          </div>

          {/* Tag de Estado */}
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-400">
            {isPuzzleActive ? '🔒 ENIGMA ATIVO' : isTyping ? '💬 FALANDO...' : '▼ CLIQUE PARA AVANÇAR'}
          </span>
        </div>

        {/* Corpo do Texto em Máquina de Escrever */}
        <div className="font-sans text-slate-100 text-base sm:text-lg leading-relaxed min-h-[4rem]">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2.5 h-5 ml-1 bg-emerald-400 animate-pulse align-middle" />
          )}
        </div>

        {/* Indicador Inferior para Avançar */}
        {!isTyping && !isPuzzleActive && (
          <div className="self-end mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400/90 animate-bounce">
            <span>Pressione para continuar</span>
            <span className="text-sm">➜</span>
          </div>
        )}
      </div>
    </div>
  );
};
