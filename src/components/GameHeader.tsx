'use client';

import React from 'react';

interface GameHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCRT: () => void;
  onResetGame: () => void;
  currentPhase: string;
}

/**
 * GameHeader: Barra Superior de Controles e HUD do MVP
 */
export const GameHeader: React.FC<GameHeaderProps> = ({
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCRT,
  onResetGame,
  currentPhase,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between p-4 z-30 select-none">
      {/* Título do Jogo */}
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-pulse">👻</span>
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-mono text-emerald-400 tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]">
            GHOST.LOG
          </h1>
          <p className="text-[10px] font-mono text-slate-400">
            Caso 01: O Fantasma do Prof. Valdemar
          </p>
        </div>
      </div>

      {/* Indicador de Progresso Central */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm">
        <span className="text-xs font-mono text-slate-500">FASE:</span>
        <span className="text-xs font-mono font-bold text-emerald-400 tracking-wide">
          {currentPhase}
        </span>
      </div>

      {/* Opções e Togglers no HUD */}
      <div className="flex items-center gap-2">
        {/* Toggle Áudio */}
        <button
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Desativar áudio' : 'Ativar áudio'}
          className={`p-2 rounded-lg border font-mono text-xs transition-all ${
            soundEnabled
              ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'border-slate-800 bg-slate-950 text-slate-500'
          }`}
          title="Alternar Áudio Sintético"
        >
          {soundEnabled ? '🔊 SOM: ON' : '🔇 SOM: OFF'}
        </button>

        {/* Toggle Filtro CRT */}
        <button
          onClick={onToggleCRT}
          aria-label={crtEnabled ? 'Desativar efeito CRT' : 'Ativar efeito CRT'}
          className={`p-2 rounded-lg border font-mono text-xs transition-all ${
            crtEnabled
              ? 'border-purple-500/50 bg-purple-950/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
              : 'border-slate-800 bg-slate-950 text-slate-500'
          }`}
          title="Alternar Filtro CRT"
        >
          {crtEnabled ? '📺 CRT: ON' : '📺 CRT: OFF'}
        </button>

        {/* Reiniciar MVP */}
        <button
          onClick={onResetGame}
          aria-label="Reiniciar partida"
          className="p-2 rounded-lg border border-slate-700 bg-slate-900 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 font-mono text-xs transition-all active:scale-95"
          title="Reiniciar a Partida"
        >
          🔄 REINICIAR
        </button>
      </div>
    </header>
  );
};
