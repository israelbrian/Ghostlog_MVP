'use client';

import React from 'react';
import Image from 'next/image';

interface GhostBustProps {
  speakerName: string;
  isTalking?: boolean;
}

/**
 * GhostBust: Componente de Avatar 2D
 * Renderiza a arte do personagem com animações CSS de flutuação,
 * brilho ectoplásmico e backdrop-blur para simular uma entidade espiritual.
 */
export const GhostBust: React.FC<GhostBustProps> = ({ speakerName, isTalking = false }) => {
  const isSystem = speakerName.includes('Analista') || speakerName.includes('Alfredo');
  const isMonitor = speakerName.includes('Monitor');
  
  // Define os atributos baseados em quem está falando
  let imageSrc = '/sprites/valdemar.jpg?v=2';
  let glowColor = 'bg-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.6)]';
  let borderColor = 'border-emerald-500/30';

  if (isSystem) {
    imageSrc = '/sprites/professor.jpg?v=2';
    glowColor = 'bg-blue-500/35 shadow-[0_0_60px_rgba(59,130,246,0.6)]';
    borderColor = 'border-blue-500/30';
  } else if (isMonitor) {
    imageSrc = '/sprites/monitor.jpg?v=2';
    glowColor = 'bg-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.5)]';
    borderColor = 'border-amber-500/30';
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none mb-4">
      {/* Halo de Brilho */}
      <div 
        className={`absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full blur-3xl transition-all duration-700 ${glowColor} ${isTalking ? 'scale-110 opacity-90' : 'scale-100 opacity-60'}`}
      />

      {/* Avatar Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center p-2 rounded-3xl border ${borderColor} bg-slate-950/40 backdrop-blur-md shadow-2xl transition-transform duration-300 ${
        isTalking ? 'animate-bounce-gentle' : 'animate-float'
      }`}>
        {/* Arte da Entidade */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden transform hover:scale-105 transition-transform">
          <Image 
            src={imageSrc} 
            alt={speakerName}
            fill
            unoptimized={true}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
