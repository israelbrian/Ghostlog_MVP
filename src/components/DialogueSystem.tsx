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
  // Novos props para dicas socráticas
  socraticHints?: [string, string, string];
  hintsUsed?: number;
  onRequestHint?: () => void;
  hasHintsAvailable?: boolean;
}

/**
 * DialogueSystem: Componente de Visual Novel Isolado
 * Renderiza o avatar da entidade e exibe o diálogo com
 * efeito de máquina de escrever (typewriter) letra a letra via useEffect.
 * Inclui botão do Monitor Fantasma para dicas socráticas progressivas.
 */
export const DialogueSystem: React.FC<DialogueSystemProps> = ({
  speaker,
  text,
  isPuzzleActive,
  onNextNode,
  soundEnabled = true,
  socraticHints,
  hintsUsed = 0,
  onRequestHint,
  hasHintsAvailable = false,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const textIndexRef = useRef<number>(0);
  const soundEnabledRef = useRef(soundEnabled);

  // Atualiza a ref quando soundEnabled muda (sem disparar re-render do efeito)
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

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

        // Toca o Voice Blip sintético se não for espaço (usa ref para não disparar re-run)
        if (soundEnabledRef.current && nextChar.trim() !== '') {
          audioEngine.playVoiceBlip();
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

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

  // Texto a exibir: se há dicas sendo usadas, mostra a dica atual; senão o texto principal
  const currentDisplayText = hintsUsed > 0 && socraticHints 
    ? socraticHints[hintsUsed - 1] 
    : text;

  // Speaker dinâmico: Monitor Fantasma quando mostrando dicas
  const currentSpeaker = hintsUsed > 0 ? 'Monitor Fantasma' : speaker;

  return (
    <div key={currentDisplayText} className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 select-none animate-fade-in">
      {/* Avatar Ectoplásmico Provisório */}
      <GhostBust speakerName={currentSpeaker} isTalking={isTyping} />

      {/* Caixa de Diálogo Visual Novel com Glassmorphism */}
      <div
        onClick={handleBoxClick}
        className={`w-full relative group cursor-pointer transition-all duration-300 rounded-2xl border ${
          isPuzzleActive
            ? 'border-purple-500/50 bg-slate-950/80 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
            : hintsUsed > 0
            ? 'border-amber-500/50 bg-amber-950/30 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
            : 'border-emerald-500/40 bg-slate-950/75 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-400'
        } backdrop-blur-xl p-6 sm:p-8 min-h-[160px] flex flex-col justify-between`}
      >
        {/* Cabeçalho com Nome do Orador */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{hintsUsed > 0 ? '👨‍🎓' : '✨'}</span>
            <span className="font-mono text-lg font-bold tracking-wider text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              {currentSpeaker}
            </span>
          </div>

          {/* Tag de Estado */}
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-400">
            {isPuzzleActive 
              ? '🔒 ENIGMA ATIVO' 
              : hintsUsed > 0 
                ? `💡 DICA ${hintsUsed}/3` 
                : isTyping 
                  ? '💬 FALANDO...' 
                  : '▼ CLIQUE PARA AVANÇAR'}
          </span>
        </div>

        {/* Corpo do Texto em Máquina de Escrever */}
        <div className="font-sans text-slate-100 text-base sm:text-lg leading-relaxed min-h-[4rem] flex-1">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2.5 h-5 ml-1 bg-emerald-400 animate-pulse align-middle" />
          )}
        </div>

        {/* Botão do Monitor Fantasma (Dicas Socráticas) */}
        {hasHintsAvailable && hintsUsed < 3 && socraticHints && onRequestHint && !isPuzzleActive && (
          <div className="mt-4 w-full flex justify-end">
            <button
              onClick={onRequestHint}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)] active:scale-95"
            >
              <span>👨‍🎓</span>
              <span>Pedir Dica ao Monitor ({3 - hintsUsed} restantes)</span>
            </button>
          </div>
        )}

        {/* Indicador Inferior para Avançar */}
        {!isTyping && !isPuzzleActive && hintsUsed === 0 && (
          <div className="self-end mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400/90 animate-bounce">
            <span>Pressione para continuar</span>
            <span className="text-sm">➜</span>
          </div>
        )}
        
        {/* Indicador para próxima dica ou avançar */}
        {!isTyping && !isPuzzleActive && hintsUsed > 0 && (
          <div className="self-end mt-4 flex items-center gap-2 text-xs font-mono text-amber-400/90 animate-bounce">
            <span>Pressione para continuar</span>
            <span className="text-sm">➜</span>
          </div>
        )}
      </div>
    </div>
  );
};