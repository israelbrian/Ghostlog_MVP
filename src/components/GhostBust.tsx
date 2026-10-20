'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GhostBustProps {
  speakerName: string;
  isTalking?: boolean;
}

/**
 * GhostBust: Componente de Avatar 2D
 * Renderiza a arte do personagem com animações CSS de flutuação,
 * brilho ectoplásmico e backdrop-blur para simular uma entidade espiritual.
 * Nomenclatura blindada: sem referências a marcas de terceiros.
 * Fallback gracioso para sprites ausentes.
 */
export const GhostBust: React.FC<GhostBustProps> = ({ speakerName, isTalking = false }) => {
  const [imageError, setImageError] = useState<string | null>(null);

  const isSystem = speakerName.includes('Sistema') || speakerName.includes('Suporte') || speakerName.includes('ALERTA');
  const isMonitor = speakerName.includes('Monitor');
  const isHelena = speakerName.includes('Helena');
  const isValdemar = speakerName.includes('Valdemar');
  const isCleiton = speakerName.includes('Cleiton');
  
  // Define os atributos baseados em quem está falando
  // Usa PNGs para Helena e Cleiton, JPGs existentes para os demais
  let imageSrc = '/sprites/valdemar.jpg?v=2';
  let glowColor = 'bg-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.6)]';
  let borderColor = 'border-emerald-500/30';
  let fallbackSrc = '/sprites/valdemar.jpg?v=2';

  if (isSystem) {
    imageSrc = '/sprites/professor.jpg?v=2';
    fallbackSrc = '/sprites/professor.jpg?v=2';
    glowColor = 'bg-blue-500/35 shadow-[0_0_60px_rgba(59,130,246,0.6)]';
    borderColor = 'border-blue-500/30';
  } else if (isMonitor) {
    imageSrc = '/sprites/monitor.jpg?v=2';
    fallbackSrc = '/sprites/monitor.jpg?v=2';
    glowColor = 'bg-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.5)]';
    borderColor = 'border-amber-500/30';
  } else if (isHelena) {
    imageSrc = '/sprites/helena.png?v=2';
    fallbackSrc = '/sprites/professor.jpg?v=2';
    glowColor = 'bg-purple-500/35 shadow-[0_0_60px_rgba(168,85,247,0.6)]';
    borderColor = 'border-purple-500/30';
  } else if (isValdemar) {
    imageSrc = '/sprites/valdemar.jpg?v=2';
    fallbackSrc = '/sprites/valdemar.jpg?v=2';
    glowColor = 'bg-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.6)]';
    borderColor = 'border-emerald-500/30';
  } else if (isCleiton) {
    imageSrc = '/sprites/cleiton.png?v=2';
    fallbackSrc = '/sprites/monitor.jpg?v=2';
    glowColor = 'bg-orange-500/35 shadow-[0_0_60px_rgba(249,115,22,0.6)]';
    borderColor = 'border-orange-500/30';
  }

  const handleImageError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageError(imageSrc);
    }
  };

  const finalSrc = imageError ? fallbackSrc : imageSrc;

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
            src={finalSrc} 
            alt={speakerName}
            fill
            unoptimized={true}
            className="object-cover"
            onError={handleImageError}
          />
        </div>
      </div>
    </div>
  );
};