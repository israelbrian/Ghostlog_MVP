'use client';

import React, { useState, useEffect } from 'react';
import valdemarData from '@/content/valdemar.json';
import pythonData from '@/content/professor_python.json';
import dbaData from '@/content/dba_fantasma.json';
import { DialogNode, ActId } from '@/types/game';
import { DialogueSystem } from '@/components/DialogueSystem';
import { OuijaTerminal } from '@/components/OuijaTerminal';
import { Necronomicon } from '@/components/Necronomicon';
import { GameHeader } from '@/components/GameHeader';
import { audioEngine } from '@/services/audio';

// Mapeamento de Atos para seus respectivos dados JSON
const ACT_DATA_MAP: Record<ActId, DialogNode[]> = {
  act1: valdemarData as DialogNode[],
  act2: pythonData as DialogNode[],
  act3: dbaData as DialogNode[],
};

// Configuração dos Atos
const ACT_CONFIG: Record<ActId, { 
  title: string; 
  ghostName: string; 
  theme: 'html' | 'python' | 'sql';
  startNodeId: string;
}> = {
  act1: { 
    title: 'ATO 1/3 — HTML', 
    ghostName: 'Prof. Valdemar', 
    theme: 'html',
    startNodeId: 'onboarding_intro'
  },
  act2: { 
    title: 'ATO 2/3 — PYTHON', 
    ghostName: 'Prof. Pythonicus', 
    theme: 'python',
    startNodeId: 'ACT_2_START'
  },
  act3: { 
    title: 'ATO 3/3 — SQL', 
    ghostName: 'DBA Fantasma', 
    theme: 'sql',
    startNodeId: 'ACT_3_START'
  },
};

const ACT_ORDER: ActId[] = ['act1', 'act2', 'act3'];

export default function GameEnginePage() {
  // Estado Global do Jogo
  const [currentActId, setCurrentActId] = useState<ActId>('act1');
  const [currentNodeId, setCurrentNodeId] = useState<string>('onboarding_intro');
  const [unlockedSpellIds, setUnlockedSpellIds] = useState<string[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [completedActs, setCompletedActs] = useState<ActId[]>([]);

  // Estados de Interação do Puzzle e Dicas
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [tauntMessage, setTauntMessage] = useState<string | null>(null);

  // Evita erro de hidratação - só renderiza após mount no client
  const [mounted, setMounted] = useState(false);

  // Nós do ato atual
  const currentActNodes = ACT_DATA_MAP[currentActId];
  const currentNode = currentActNodes.find((node) => node.id === currentNodeId) || currentActNodes[0];
  const isPuzzleActive = currentNode.puzzleType !== 'none';
  const actConfig = ACT_CONFIG[currentActId];

  // Sincronização com LocalStorage (Persistência de Estado)
  useEffect(() => {
    setMounted(true);
    const savedAct = localStorage.getItem('ghostlog_act') as ActId | null;
    const savedNode = localStorage.getItem('ghostlog_node');
    const savedSpells = localStorage.getItem('ghostlog_spells');
    const savedInventory = localStorage.getItem('ghostlog_inventory');
    const savedCompleted = localStorage.getItem('ghostlog_completed');

    if (savedAct && ACT_DATA_MAP[savedAct]) {
      setCurrentActId(savedAct);
      setCurrentNodeId(savedNode || ACT_CONFIG[savedAct].startNodeId);
    }
    if (savedSpells) {
      setUnlockedSpellIds(JSON.parse(savedSpells));
    }
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
    if (savedCompleted) {
      setCompletedActs(JSON.parse(savedCompleted));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ghostlog_act', currentActId);
    localStorage.setItem('ghostlog_node', currentNodeId);
  }, [currentActId, currentNodeId]);

  useEffect(() => {
    localStorage.setItem('ghostlog_spells', JSON.stringify(unlockedSpellIds));
    localStorage.setItem('ghostlog_inventory', JSON.stringify(inventory));
    localStorage.setItem('ghostlog_completed', JSON.stringify(completedActs));
  }, [unlockedSpellIds, inventory, completedActs]);

  /**
   * Avança para o próximo nó após a leitura do texto (quando não há enigma pendente)
   */
  const handleAdvanceDialogue = () => {
    if (currentNode.nextNodeOnSuccess) {
      const nextNodeId = currentNode.nextNodeOnSuccess;
      
      // Verifica se o próximo nó é uma transição para outro ato
      if (nextNodeId === 'transition_to_python') {
        transitionToAct('act2');
      } else if (nextNodeId === 'transition_to_sql') {
        transitionToAct('act3');
      } else if (nextNodeId === 'victory') {
        // Jogo completado
        setCurrentNodeId(nextNodeId);
        setHintsUsed(0);
        setTauntMessage(null);
        checkAndUnlockSpell(nextNodeId);
      } else {
        setCurrentNodeId(nextNodeId);
        setHintsUsed(0);
        setTauntMessage(null);
        checkAndUnlockSpell(nextNodeId);
      }
    }
  };

  /**
   * Transiciona para o próximo ato
   */
  const transitionToAct = (nextActId: ActId) => {
    const nextActConfig = ACT_CONFIG[nextActId];
    setCurrentActId(nextActId);
    setCurrentNodeId(nextActConfig.startNodeId);
    setHintsUsed(0);
    setTauntMessage(null);
    setCompletedActs(prev => [...prev, currentActId]);
    checkAndUnlockSpell(nextActConfig.startNodeId);
  };

  /**
   * Handler chamado quando o jogador resolve com sucesso o enigma no OuijaTerminal
   */
  const handlePuzzleSolve = () => {
    setHintsUsed(0);
    setTauntMessage(null);

    if (currentNode.nextNodeOnSuccess) {
      const nextNodeId = currentNode.nextNodeOnSuccess;
      
      if (nextNodeId === 'transition_to_python') {
        transitionToAct('act2');
      } else if (nextNodeId === 'transition_to_sql') {
        transitionToAct('act3');
      } else if (nextNodeId === 'victory') {
        setCurrentNodeId(nextNodeId);
        checkAndUnlockSpell(nextNodeId);
      } else {
        setCurrentNodeId(nextNodeId);
        checkAndUnlockSpell(nextNodeId);
      }
    }
  };

  /**
   * Handler chamado quando o jogador erra o enigma no OuijaTerminal
   */
  const handlePuzzleFail = () => {
    if (currentNode.tauntOnFail) {
      setTauntMessage(currentNode.tauntOnFail);
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
    if (nodeId.includes('html') || nodeId === 'puzzle_html' || nodeId === 'epilogo_valdemar') {
      unlockSpell('spell_html');
    }
    if (nodeId.includes('python') || nodeId === 'puzzle_python' || nodeId === 'epilogo_python') {
      unlockSpell('spell_python');
    }
    if (nodeId.includes('sql') || nodeId === 'puzzle_sql' || nodeId === 'epilogo_sql' || nodeId === 'victory') {
      unlockSpell('spell_sql');
    }
    
    if (nodeId === 'victory') {
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
    setCurrentActId('act1');
    setCurrentNodeId('onboarding_intro');
    setUnlockedSpellIds([]);
    setInventory([]);
    setCompletedActs([]);
    setHintsUsed(0);
    setTauntMessage(null);
    localStorage.removeItem('ghostlog_act');
    localStorage.removeItem('ghostlog_node');
    localStorage.removeItem('ghostlog_spells');
    localStorage.removeItem('ghostlog_inventory');
    localStorage.removeItem('ghostlog_completed');
  };

  // Calcula a fase atual para o indicador de progresso no HUD
  const getCurrentPhase = (): string => {
    const actIndex = ACT_ORDER.indexOf(currentActId);
    const completedCount = completedActs.length;
    
    if (currentNodeId === 'victory') return 'CONCLUÍDO ✅';
    return `ATO ${actIndex + 1}/3 — ${actConfig.theme.toUpperCase()}`;
  };

  // Indicador visual do fantasma atual no HUD
  const getGhostIndicator = () => {
    const indicators: Record<string, string> = {
      act1: '👻 Valdemar',
      act2: '🐍 Pythonicus',
      act3: '💾 DBA Fantasma',
    };
    return indicators[currentActId] || '👻';
  };

  return (
    !mounted ? (
      <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/20 to-black select-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl animate-pulse">👻</span>
            <p className="mt-4 text-lg font-mono text-emerald-400">CARREGANDO GHOST.LOG...</p>
          </div>
        </div>
      </main>
    ) : (
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
        currentGhost={getGhostIndicator()}
        completedActs={completedActs}
        totalActs={ACT_ORDER.length}
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
              {currentNode.nextNodeOnSuccess && !currentNode.nextNodeOnSuccess.includes('victory') && (
                <button 
                  onClick={handleAdvanceDialogue}
                  className="w-full py-3 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 font-mono font-bold rounded transition-colors active:scale-95"
                >
                  {currentNode.nextNodeOnSuccess.includes('ACT_') || currentNode.nextNodeOnSuccess.includes('transition') 
                    ? '⚡ PRÓXIMO SETOR' 
                    : 'CONTINUAR'}
                </button>
              )}
              {currentNode.nextNodeOnSuccess && currentNode.nextNodeOnSuccess.includes('victory') && (
                <div className="w-full py-3 bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 font-mono font-bold rounded text-center">
                  🎉 PARABÉNS! FIM DO JOGO
                </div>
              )}
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
        <span>Ghost.log MVP • Suporte de TI da Faculdade • {actConfig.ghostName}</span>
      </footer>
    </main>
    )
  );
}