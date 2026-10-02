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
  const isSystem = speakerName.includes('Sistema');
  const isMonitor = speakerName.includes('Monitor');
  
  // Define os atributos baseados em quem está falando
  let emoji = '👻';
  let glowColor = 'bg-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.6)]';
  let borderColor = 'border-emerald-500/30';

  if (isSystem) {
    emoji = '👨‍🏫';
    glowColor = 'bg-blue-500/35 shadow-[0_0_60px_rgba(59,130,246,0.6)]';
    borderColor = 'border-blue-500/30';
  } else if (isMonitor) {
    emoji = '👨‍🎓';
    glowColor = 'bg-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.5)]';
    borderColor = 'border-amber-500/30';
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none mb-4">
      {/* Halo de Brilho */}
      <div 
        className={`absolute w-44 h-44 rounded-full blur-2xl transition-all duration-700 ${glowColor} ${isTalking ? 'scale-110 opacity-90' : 'scale-100 opacity-60'}`}
      />

      {/* Avatar Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center p-6 rounded-3xl border ${borderColor} bg-slate-950/40 backdrop-blur-md shadow-2xl transition-transform duration-300 ${
        isTalking ? 'animate-bounce-gentle' : 'animate-float'
      }`}>
        {/* Emoji da Entidade */}
        <div className="text-7xl sm:text-8xl transform hover:scale-105 transition-transform">
          {emoji}
        </div>
      </div>
    </div>
  );
};
