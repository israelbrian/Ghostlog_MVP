'use client';

import React, { useState } from 'react';
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
  const [currentNodeId, setCurrentNodeId] = useState<string>('intro_1');
  const [unlockedSpellIds, setUnlockedSpellIds] = useState<string[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

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

      // Desbloqueia feitiços quando entra nos nós pós-enigma
      checkAndUnlockSpell(currentNode.nextNodeOnSuccess);
    }
  };

  /**
   * Handler chamado quando o jogador resolve com sucesso o enigma no OuijaTerminal
   */
  const handlePuzzleSolve = () => {
    // Registra vitória e desbloqueia feitiços
    if (currentNode.id === 'puzzle_html') {
      unlockSpell('spell_html');
    } else if (currentNode.id === 'puzzle_python') {
      unlockSpell('spell_python');
    } else if (currentNode.id === 'puzzle_sql') {
      unlockSpell('spell_sql');
      addInventoryItem('Disquete da Paz');
    }

    if (currentNode.nextNodeOnSuccess) {
      setCurrentNodeId(currentNode.nextNodeOnSuccess);
    }
  };

  /**
   * Handler chamado quando o jogador erra o enigma no OuijaTerminal
   */
  const handlePuzzleFail = () => {
    if (currentNode.nextNodeOnFail) {
      setCurrentNodeId(currentNode.nextNodeOnFail);
    }
  };

  const unlockSpell = (spellId: string) => {
    setUnlockedSpellIds((prev) => (prev.includes(spellId) ? prev : [...prev, spellId]));
  };

  const checkAndUnlockSpell = (nodeId: string) => {
    if (nodeId === 'post_html_success') unlockSpell('spell_html');
    if (nodeId === 'post_python_success') unlockSpell('spell_python');
    if (nodeId === 'victory') {
      unlockSpell('spell_sql');
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
    setCurrentNodeId('intro_1');
    setUnlockedSpellIds([]);
    setInventory([]);
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

      {/* Área Central da Gameplay (Visual Novel + Terminal) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6">
        
        {/* Sistema de Diálogo (Typewriter + Avatar Provisório 👻) */}
        <DialogueSystem
          speaker={currentNode.speaker}
          text={currentNode.text}
          isPuzzleActive={isPuzzleActive}
          onNextNode={handleAdvanceDialogue}
          soundEnabled={soundEnabled}
        />

        {/* Ouija Terminal (Input Interativo para Resolução dos Enigmas) */}
        {isPuzzleActive && (
          <OuijaTerminal
            puzzleType={currentNode.puzzleType}
            expectedAnswers={currentNode.expectedAnswer}
            onSolve={handlePuzzleSolve}
            onFail={handlePuzzleFail}
          />
        )}
      </div>

      {/* Rodapé Informativo */}
      <footer className="relative z-10 py-3 text-center text-xs font-mono text-slate-500 border-t border-slate-900/80 bg-slate-950/80 backdrop-blur-md">
        <span>Ghost.log MVP • Suporte de TI da Faculdade • Caso Prof. Valdemar</span>
      </footer>
    </main>
  );
}
