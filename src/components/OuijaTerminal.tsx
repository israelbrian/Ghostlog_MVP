'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PuzzleType } from '@/types/game';
import { validateAnswer } from '@/utils/sanitizer';
import { audioEngine } from '@/services/audio';

interface OuijaTerminalProps {
  puzzleType: PuzzleType;
  expectedAnswers?: string[];
  onSolve: () => void;
  onFail: () => void;
}

/**
 * OuijaTerminal: Componente de Terminal Obscuro (Passo 4)
 * 
 * Responsabilidade:
 * Renderizar um terminal interativo com <input> com autoFocus automático no rodapé.
 * Executar sanitização estrita (.trim().toLowerCase() e remoção de espaços duplicados).
 * Emitir os eventos de callback onSolve() ou onFail() para o controlador pai (GameEngine).
 */
export const OuijaTerminal: React.FC<OuijaTerminalProps> = ({
  puzzleType,
  expectedAnswers,
  onSolve,
  onFail,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [statusFeedback, setStatusFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Força o foco automático no input sempre que um enigma é montado ou clicado
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [puzzleType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    audioEngine.playTerminalSubmit();

    // Validação estrita sanitizada via utility
    const isCorrect = validateAnswer(inputValue, expectedAnswers);

    if (isCorrect) {
      setStatusFeedback('success');
      setErrorMessage('');
      audioEngine.playSuccessChime();
      setTimeout(() => {
        setInputValue('');
        setStatusFeedback('idle');
        onSolve();
      }, 700);
    } else {
      setStatusFeedback('error');
      setErrorMessage('SINTAXE INCORRETA OU COMANDO INVALIDEZADO PELO ALÉM!');
      audioEngine.playErrorBuzz();
      setTimeout(() => {
        setStatusFeedback('idle');
        onFail();
      }, 1200);
    }
  };

  const getLanguageLabel = () => {
    switch (puzzleType) {
      case 'html': return 'SELANDO PORTAL HTML (ex: </body>)';
      case 'python': return 'LAÇO DE REPETIÇÃO PYTHON (ex: while / for)';
      case 'sql': return 'CONSULTA DE REDENÇÃO SQL (ex: SELECT ... WHERE)';
      default: return 'TERMINAL OUIJA';
    }
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto mt-6 px-4"
      onClick={() => inputRef.current?.focus()}
    >
      <div className={`relative rounded-xl border transition-all duration-300 ${
        statusFeedback === 'error'
          ? 'border-red-500/80 bg-red-950/40 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
          : statusFeedback === 'success'
          ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_35px_rgba(52,211,153,0.5)]'
          : 'border-emerald-600/50 bg-slate-950/90 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:border-emerald-400'
      } p-4 sm:p-5 backdrop-blur-xl font-mono`}>
        
        {/* Barra Superior Estilo Terminal CRT */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60 mb-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold tracking-wide">TABULEIRO OUIJA (MODO EXORCISMO v1.999)</span>
          </div>

          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            {getLanguageLabel()}
          </span>
        </div>

        {/* Form de Input Principal com Foco Automático */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 w-full text-emerald-400 text-base sm:text-lg">
            <span className="text-emerald-500 select-none font-bold">ghost@ouija:~$</span>
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite o feitiço de código aqui..."
              aria-label="Terminal Ouija - Digite o código"
              className="w-full bg-transparent text-emerald-200 placeholder-emerald-800 focus:outline-none font-mono text-base sm:text-lg tracking-wide"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95"
          >
            Invocar
          </button>
        </form>

        {/* Mensagem de Feedback de Erro */}
        {statusFeedback === 'error' && (
          <div className="mt-3 text-xs text-red-400 font-mono flex items-center gap-2 animate-pulse">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
