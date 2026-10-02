'use client';

import React, { useState, useEffect } from 'react';
import dialogData from '@/content/valdemar.json';
import { DialogNode } from '@/types/game';
import { DialogueSystem } from '@/components/DialogueSystem';
import { OuijaTerminal } from '@/components/OuijaTerminal';
import { Necronomicon } from '@/components/Necronomicon';
import { GameHeader } from '@/components/GameHeader';
import { audioEngine } from '@/services/audio';

/**
 * GameEngine (Controlador Principal - Passo 5)
 * 
 * Responsabilidade:
 * Gerenciar o estado global da partida no Next.js (currentNodeId, feitiços desbloqueados no Necronomicon, inventário).
 * Orquestrar o fluxo entre o DialogueSystem e o OuijaTerminal consumindo o arquivo valdemar.json.
 */
export default function GameEnginePage() {
  const nodes = dialogData as DialogNode[];

  // Estado Global do Jogo
  const [currentNodeId, setCurrentNodeId] = useState<string>('onboarding_intro');
  const [unlockedSpellIds, setUnlockedSpellIds] = useState<string[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

  // Estados de Interação do Puzzle e Dicas
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [tauntMessage, setTauntMessage] = useState<string | null>(null);

  // Sincronização com LocalStorage (Persistência de Estado)
  useEffect(() => {
    const savedNode = localStorage.getItem('ghostlog_node');
    if (savedNode) {
      setCurrentNodeId(savedNode);
      checkAndUnlockSpell(savedNode); // Restaura feitiços baseados no nó salvo
    } else {
      checkAndUnlockSpell('onboarding_intro');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ghostlog_node', currentNodeId);
  }, [currentNodeId]);

  // Busca o nó atual da árvore de diálogo
  const currentNode = nodes.find((node) => node.id === currentNodeId) || nodes[0];

  const isPuzzleActive = currentNode.puzzleType !== 'none';

  // Calcula a fase atual para o indicador de progresso no HUD
  const getCurrentPhase = (): string => {
    const nodeId = currentNodeId;
    if (nodeId === 'victory' || nodeId === 'epilogue') return 'CONCLUÍDO ✅';
    if (nodeId.includes('sql') || nodeId === 'intro_sql') return 'ATO 3/3 — SQL';
    if (nodeId.includes('python') || nodeId === 'intro_python') return 'ATO 2/3 — PYTHON';
    if (nodeId.includes('html') || nodeId === 'post_html_success') return 'ATO 1/3 — HTML';
    return 'PRÓLOGO';
  };

  /**
   * Avança para o próximo nó após a leitura do texto (quando não há enigma pendente)
   */
  const handleAdvanceDialogue = () => {
    if (currentNode.nextNodeOnSuccess) {
      setCurrentNodeId(currentNode.nextNodeOnSuccess);
      setHintsUsed(0);
      setTauntMessage(null);
      // Desbloqueia feitiços quando entra nos nós pós-enigma/contexto
      checkAndUnlockSpell(currentNode.nextNodeOnSuccess);
    }
  };

  /**
   * Handler chamado quando o jogador resolve com sucesso o enigma no OuijaTerminal
   */
  const handlePuzzleSolve = () => {
    // Quando o enigma é resolvido, avançamos direto e resetamos os status temporários
    setHintsUsed(0);
    setTauntMessage(null);

    if (currentNode.nextNodeOnSuccess) {
      setCurrentNodeId(currentNode.nextNodeOnSuccess);
      checkAndUnlockSpell(currentNode.nextNodeOnSuccess);
    }
  };

  /**
   * Handler chamado quando o jogador erra o enigma no OuijaTerminal
   */
  const handlePuzzleFail = () => {
    // No novo fluxo, errar NÃO avança de nó. Exibimos um taunt temporário.
    if (currentNode.tauntOnFail) {
      setTauntMessage(currentNode.tauntOnFail);
      // Apaga a provocação após 4 segundos
      setTimeout(() => setTauntMessage(null), 4000);
    }
  };

  const handleRequestHint = () => {
    if (currentNode.hints && hintsUsed < currentNode.hints.length) {
      setHintsUsed((prev) => prev + 1);
    }
  };

  const unlockSpell = (spellId: string) => {
    setUnlockedSpellIds((prev) => (prev.includes(spellId) ? prev : [...prev, spellId]));
  };

  const checkAndUnlockSpell = (nodeId: string) => {
    // No novo fluxo, o Necronomicon deve ser pré-povoado antes do enigma começar.
    // Então desbloqueamos o feitiço no momento que a fase contextual é carregada ou concluída.
    if (nodeId.includes('html')) unlockSpell('spell_html');
    if (nodeId.includes('python')) unlockSpell('spell_python');
    if (nodeId.includes('sql')) unlockSpell('spell_sql');
    
    if (nodeId === 'epilogue') {
      addInventoryItem('Disquete da Paz');
    }
  };

  const addInventoryItem = (item: string) => {
    setInventory((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    audioEngine.setEnabled(nextState);
  };

  const handleResetGame = () => {
    setCurrentNodeId('onboarding_intro');
    setUnlockedSpellIds([]);
    setInventory([]);
    setHintsUsed(0);
    setTauntMessage(null);
    localStorage.removeItem('ghostlog_node');
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/20 to-black select-none">
      
      {/* Camada CRT de Filtro Retro (Pode ser alternada no HUD) */}
      {crtEnabled && <div className="crt-overlay fixed inset-0 z-20 pointer-events-none" />}

      {/* Cenário Simulado de Laboratório Sombrio (Grayboxing Puramente Tailwind) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Luzes de Servidor piscando no fundo */}
        <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
        <div className="absolute top-1/3 right-16 w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-emerald-400 animate-pulse opacity-40" />

        {/* Gradiente de Luz de Monitor CRT Central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* HUD & Cabeçalho */}
      <GameHeader
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        crtEnabled={crtEnabled}
        onToggleCRT={() => setCrtEnabled(!crtEnabled)}
        onResetGame={handleResetGame}
        currentPhase={getCurrentPhase()}
      />

      {/* Necronomicon de TI (Grimório Lateral) */}
      <Necronomicon unlockedSpellIds={unlockedSpellIds} inventory={inventory} />

      {/* Área Central da Gameplay */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6 px-4">
        
        {currentNode.isContextModal ? (
          /* Modal de Contexto da Fase (ALERTA DE SISTEMA) */
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
            <div className="bg-slate-900/90 border-2 border-red-500/50 rounded-lg p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur-md">
              <h2 className="text-red-400 font-mono font-bold text-xl mb-4 flex items-center gap-2">
                <span className="animate-pulse">⚠️</span> {currentNode.speaker}
              </h2>
              <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
                {currentNode.text}
              </p>
              <button 
                onClick={handleAdvanceDialogue}
                className="w-full py-3 bg-red-950/50 hover:bg-red-900/60 border border-red-500/50 text-red-200 font-mono font-bold rounded transition-colors active:scale-95"
              >
                PROSSEGUIR PARA O TERMINAL &gt;
              </button>
            </div>
          </div>
        ) : (
          /* Sistema de Diálogo Padrão (Visual Novel) */
          <DialogueSystem
            speaker={hintsUsed > 0 ? "Monitor Falecido" : currentNode.speaker}
            text={hintsUsed > 0 && currentNode.hints ? currentNode.hints[hintsUsed - 1] : currentNode.text}
            isPuzzleActive={isPuzzleActive}
            onNextNode={handleAdvanceDialogue}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Ouija Terminal (Input Interativo) */}
        {isPuzzleActive && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center mt-4">
            
            {/* Mensagem de Provocação (Taunt) ao errar */}
            {tauntMessage && (
              <div className="mb-4 text-red-400 font-mono text-sm font-bold bg-red-950/50 px-4 py-2 rounded border border-red-500/50 animate-pulse">
                {tauntMessage}
              </div>
            )}

            <OuijaTerminal
              puzzleType={currentNode.puzzleType}
              expectedAnswers={currentNode.expectedAnswer}
              onSolve={handlePuzzleSolve}
              onFail={handlePuzzleFail}
            />

            {/* Painel de Dicas Socráticas */}
            {currentNode.hints && hintsUsed < currentNode.hints.length && (
              <div className="mt-4 w-full flex flex-col items-end">
                <button 
                  onClick={handleRequestHint}
                  className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-mono text-sm font-bold transition-colors"
                >
                  <span>👨‍🎓</span> Pedir Dica ({currentNode.hints.length - hintsUsed} restantes)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rodapé Informativo */}
      <footer className="relative z-10 py-3 text-center text-xs font-mono text-slate-500 border-t border-slate-900/80 bg-slate-950/80 backdrop-blur-md">
        <span>Ghost.log MVP • Suporte de TI da Faculdade • Caso Prof. Valdemar</span>
      </footer>
    </main>
  );
}
