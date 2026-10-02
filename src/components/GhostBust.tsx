'use client';

import React from 'react';

interface GhostBustProps {
  speakerName: string;
  isTalking?: boolean;
}

/**
 * GhostBust: Componente de Avatar Provisório (Grayboxing conforme Passo 2)
 * Renderiza um fantasma verde-neon (👻) com animações CSS de flutuação,
 * brilho ectoplásmico e backdrop-blur para simular uma entidade espiritual.
 */
export const GhostBust: React.FC<GhostBustProps> = ({ speakerName, isTalking = false }) => {
  const isValdemar = speakerName.includes('Valdemar');
  const isMonitor = speakerName.includes('Monitor');

  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none mb-4">
      {/* Halo de Brilho Ectoplásmico (Neon Glow) */}
      <div 
        className={`absolute w-44 h-44 rounded-full blur-2xl transition-all duration-700 ${
          isMonitor 
            ? 'bg-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.5)]' 
            : 'bg-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.6)]'
        } ${isTalking ? 'scale-110 opacity-90' : 'scale-100 opacity-60'}`}
      />

      {/* Avatar Container com Flutuação e Backdrop Blur */}
      <div className={`relative z-10 flex flex-col items-center justify-center p-6 rounded-3xl border border-emerald-500/30 bg-slate-950/40 backdrop-blur-md shadow-2xl transition-transform duration-300 ${
        isTalking ? 'animate-bounce-gentle' : 'animate-float'
      }`}>
        {/* Emoji da Entidade Espiritual */}
        <div className="text-7xl sm:text-8xl filter drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] transform hover:scale-105 transition-transform">
          {isMonitor ? '💀' : '👻'}
        </div>

        {/* Insígnia de Aura Espiritual */}
        <div className="mt-2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {isMonitor ? 'Monitor Falecido' : 'Espectro Acadêmico'}
        </div>
      </div>
    </div>
  );
};
