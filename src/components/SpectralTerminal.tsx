'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PuzzleType } from '@/types/game';
import { validateAnswer, ValidationResult } from '@/utils/sanitizer';
import { audioEngine } from '@/services/audio';

interface SpectralTerminalProps {
  puzzleType: PuzzleType;
  expectedAnswers?: string[];
  codeTemplate?: string;
  onSolve: () => void;
  onFail: () => void;
}

/**
 * SpectralTerminal: Componente de Terminal Espectral
 * Renderiza um terminal interativo com template visual fill-in-the-blanks.
 * Executa sanitização estrita, valida contra whitelist e exibe feedback educativo.
 */
export const SpectralTerminal: React.FC<SpectralTerminalProps> = ({
  puzzleType,
  expectedAnswers,
  codeTemplate,
  onSolve,
  onFail,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [statusFeedback, setStatusFeedback] = useState<'idle' | 'success' | 'error' | 'close'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Força o foco automático no input sempre que um enigma é montado
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [puzzleType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    audioEngine.playTerminalSubmit();

    // Validação com feedback educativo
    const result: ValidationResult = validateAnswer(inputValue, expectedAnswers);

    if (result.isCorrect) {
      setStatusFeedback('success');
      setErrorMessage('');
      audioEngine.playSuccessChime();
      setTimeout(() => {
        setInputValue('');
        setStatusFeedback('idle');
        onSolve();
      }, 700);
    } else {
      setStatusFeedback(result.feedbackType === 'close' ? 'close' : 'error');
      setErrorMessage(result.message);
      audioEngine.playErrorBuzz();
      setTimeout(() => {
        setStatusFeedback('idle');
        onFail();
      }, 1500);
    }
  };

  const getLanguageLabel = () => {
    switch (puzzleType) {
      case 'html': return 'HTML — FECHAMENTO DE TAG';
      case 'logic': return 'LÓGICA — ATRIBUIÇÃO';
      case 'python': return 'PYTHON — LAÇO FOR';
      case 'sql': return 'SQL — CONSULTA / FILTRO / UPDATE';
      case 'infra': return 'INFRA — COMANDO DE TERMINAL';
      default: return 'TERMINAL ESPECTRAL';
    }
  };

  // Renderiza o template com a lacuna destacada
  const renderTemplate = () => {
    if (!codeTemplate) return null;
    
    const parts = codeTemplate.split('_____');
    return (
      <div className="mb-3 p-3 rounded-lg bg-slate-900/50 border border-emerald-500/20 font-mono text-xs sm:text-base text-emerald-300 overflow-x-auto">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="bg-emerald-500/20 border-b-2 border-emerald-400 px-1 mx-1 animate-pulse">
                <span className="invisible">_____</span>{' '}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto mt-6 px-4"
      onClick={() => inputRef.current?.focus()}
    >
      {renderTemplate()}
      
      <div className={`relative rounded-xl border transition-all duration-300 ${
        statusFeedback === 'error'
          ? 'border-red-500/80 bg-red-950/40 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
          : statusFeedback === 'close'
          ? 'border-amber-500/80 bg-amber-950/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
          : statusFeedback === 'success'
          ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_35px_rgba(52,211,153,0.5)]'
          : 'border-emerald-600/50 bg-slate-950/90 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:border-emerald-400'
      } p-4 sm:p-5 backdrop-blur-xl font-mono`}>
        
        {/* Barra Superior Estilo Terminal CRT */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60 mb-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold tracking-wide">TERMINAL ESPECTRAL v1.0</span>
          </div>

          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            {getLanguageLabel()}
          </span>
        </div>

        {/* Form de Input Principal com Foco Automático */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 w-full text-emerald-400 text-base sm:text-lg">
            <span className="text-emerald-500 select-none font-bold">estagiario@ghostlog:~$</span>
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite a palavra-chave que falta..."
              aria-label="Terminal Espectral - Digite a resposta"
              className="w-full bg-transparent text-emerald-200 placeholder-emerald-800 focus:outline-none font-mono text-base sm:text-lg tracking-wide"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95"
          >
            Executar
          </button>
        </form>

        {/* Mensagem de Feedback Educativo */}
        {(statusFeedback === 'error' || statusFeedback === 'close') && (
          <div className={`mt-3 text-xs font-mono flex items-center gap-2 animate-pulse ${
            statusFeedback === 'close' ? 'text-amber-400' : 'text-red-400'
          }`}>
            <span>{statusFeedback === 'close' ? '💡' : '⚠️'}</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};