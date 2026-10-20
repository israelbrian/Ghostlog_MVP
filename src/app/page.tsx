'use client';

import React, { useState, useEffect } from 'react';
import campaignData from '@/content/campaign.json';
import { DialogNode, PhaseId, LegacyCompendiumEntry } from '@/types/game';
import { DialogueSystem } from '@/components/DialogueSystem';
import { SpectralTerminal } from '@/components/SpectralTerminal';
import { LegacyCompendium } from '@/components/LegacyCompendium';
import { GameHeader } from '@/components/GameHeader';
import { audioEngine } from '@/services/audio';

// Mapeamento de Fases
const PHASE_ORDER: PhaseId[] = [1, 2, 3];

// Configuração das Fases
const PHASE_CONFIG: Record<PhaseId, { 
  title: string;
  sectorName: string;
  ghostName: string;
  ghostSprite: string;
  theme: 'html' | 'logic' | 'python' | 'sql' | 'infra';
  startNodeId: string;
}> = {
  1: { 
    title: 'FASE 1/3', 
    sectorName: 'Setor 1: Laboratório de Desenvolvimento',
    ghostName: 'Profª. Helena Vilar',
    ghostSprite: '/sprites/helena.jpg',
    theme: 'html',
    startNodeId: 'onboarding_intro'
  },
  2: { 
    title: 'FASE 2/3', 
    sectorName: 'Setor 2: Cofre de Dados Acadêmicos',
    ghostName: 'Prof. Valdemar',
    ghostSprite: '/sprites/valdemar.jpg',
    theme: 'sql',
    startNodeId: 'phase2_intro'
  },
  3: { 
    title: 'FASE 3/3', 
    sectorName: 'Setor 3: Subsolo de Suporte e Infraestrutura',
    ghostName: 'Téc. Cleiton',
    ghostSprite: '/sprites/cleiton.jpg',
    theme: 'infra',
    startNodeId: 'phase3_intro'
  },
};

// Base de dados do Compêndio (importada do componente para evitar duplicação)
const LEGACY_COMPENDIUM_DATABASE: LegacyCompendiumEntry[] = [
  // FASE 1
  {
    id: 'entry_html_close',
    title: 'HTML: Fechamento de Tags',
    category: 'html',
    analogyTitle: '💡 Analogia do Sanduíche',
    analogyText: 'Pense no HTML como um sanduíche: o pão de baixo abre <body>, o recheio fica no meio, e o pão de cima </body> fecha tudo. Se faltar o pão de cima, o recheio cai e a estrutura desmorona.',
    description: 'Toda tag de abertura <tag> exige uma tag de fechamento </tag>. O navegador monta a árvore DOM corretamente apenas quando a estrutura está balanceada.',
    codeSnippet: '<!-- Estrutura Básica -->\n<body>\n  <h1>Título</h1>\n  <p>Conteúdo</p>\n</body>',
    unlockedAtNode: 'puzzle_1_1_html',
    phaseId: 1,
  },
  {
    id: 'entry_logic_assign',
    title: 'Lógica: Atribuição de Variáveis',
    category: 'logic',
    analogyTitle: '💡 Analogia da Caixa Etiquetada',
    analogyText: 'Variáveis são caixas com etiquetas. Você escreve o nome na etiqueta (energia_ativa), coloca o valor dentro (True), e usa o sinal = para guardar. Depois o sistema olha a caixa e sabe o que tem dentro.',
    description: 'O operador de atribuição (=) armazena um valor numa variável. Em Python: variavel = valor. O lado esquerdo recebe o resultado do lado direito.',
    codeSnippet: '# Atribuição em Python\nenergia_ativa = True\ncontador = 0\nnome = "Servidor"',
    unlockedAtNode: 'puzzle_1_2_logic',
    phaseId: 1,
  },
  {
    id: 'entry_python_for',
    title: 'Python: Laço de Repetição for',
    category: 'python',
    analogyTitle: '💡 Analogia da Chamada Escolar',
    analogyText: 'O laço "for" é como a chamada do professor: ele passa nome por nome na lista (for cada aluno in turma) e executa a mesma ação para cada um. Não precisa escrever 30 vezes — escreve uma vez e o laço repete.',
    description: 'Itera sobre sequências (listas, tuplas, ranges). Sintaxe: for item in colecao: bloco. A variável "item" recebe cada elemento por vez.',
    codeSnippet: '# Laço for em Python\nfor gerador in geradores:\n    print("Energizando", gerador)\n    gerador.ativar()',
    unlockedAtNode: 'puzzle_1_3_python',
    phaseId: 1,
  },
  // FASE 2
  {
    id: 'entry_sql_select',
    title: 'SQL: Consulta SELECT',
    category: 'sql',
    analogyTitle: '💡 Analogia do Cardápio',
    analogyText: 'O SELECT é como pedir ao garçom: "Quero ver apenas o item X do cardápio". Você não pede a cozinha inteira — especifica exatamente qual coluna quer que apareça na sua mesa.',
    description: 'Seleciona colunas específicas de uma tabela. SELECT coluna FROM tabela. Use * para todas as colunas, mas evite em produção.',
    codeSnippet: '-- Consulta básica\nSELECT nome, email\nFROM alunos\nWHERE ativo = true;',
    unlockedAtNode: 'puzzle_2_1_sql_select',
    phaseId: 2,
  },
  {
    id: 'entry_sql_where',
    title: 'SQL: Filtro WHERE',
    category: 'sql',
    analogyTitle: '💡 Analogia da Catraca',
    analogyText: 'O WHERE é a catraca da portaria: barra todo mundo e deixa passar apenas quem tem o crachá certo (aluno = "Roberto"). Sem catraca, a faculdade inteira entra e o caos se instala.',
    description: 'Restringe linhas retornadas pela consulta. WHERE condição. Operadores: =, !=, >, <, LIKE, IN, BETWEEN. SEMPRE use em UPDATE/DELETE.',
    codeSnippet: '-- Filtro seguro\nSELECT nota\nFROM historico\nWHERE aluno = \'Roberto\';',
    unlockedAtNode: 'puzzle_2_2_sql_where',
    phaseId: 2,
  },
  {
    id: 'entry_sql_update',
    title: 'SQL: Atualização UPDATE',
    category: 'sql',
    analogyTitle: '💡 Analogia do Corretivo',
    analogyText: 'UPDATE é passar corretivo numa linha da pauta: você apaga o erro (SET nota = 10) mas SÓ naquela linha (WHERE aluno = "Roberto"). Sem o WHERE, você apaga a pauta inteira.',
    description: 'Modifica dados existentes. UPDATE tabela SET coluna = valor WHERE condição. O WHERE é obrigatório para evitar alteração em massa acidental.',
    codeSnippet: '-- Atualização segura\nUPDATE historico\nSET nota = 10\nWHERE aluno = \'Roberto\';',
    unlockedAtNode: 'puzzle_2_3_sql_update',
    phaseId: 2,
  },
  // FASE 3
  {
    id: 'entry_infra_ping',
    title: 'Infraestrutura: Teste de Conectividade ping',
    category: 'infra',
    analogyTitle: '💡 Analogia do Sonar',
    analogyText: 'O ping é como um sonar no escuro: você envia um "grito" (pacote ICMP) e espera o eco voltar. Se volta, o servidor tá acordado e alcançável. Se não volta, tá desligado ou o cabo caiu.',
    description: 'Testa conectividade IP. ping endereço_ip. Retorna tempo de resposta (latência) ou "Request timed out" se falhar.',
    codeSnippet: '# Teste de conectividade\nping 192.168.0.1\nping google.com',
    unlockedAtNode: 'puzzle_3_1_ping',
    phaseId: 3,
  },
  {
    id: 'entry_infra_cd',
    title: 'Infraestrutura: Navegação cd',
    category: 'infra',
    analogyTitle: '💡 Analogia da Maçaneta',
    analogyText: 'O cd (change directory) é girar a maçaneta e entrar numa sala. Você tá no corredor (pasta atual), digita cd pasta_logs e entra na sala onde o arquivo tá guardado.',
    description: 'Muda o diretório de trabalho atual. cd caminho/para/pasta. Use cd .. para subir um nível. pwd mostra onde você está.',
    codeSnippet: '# Navegação de diretórios\ncd /var/log\ncd pasta_logs\ncd ..  # volta um nível\npwd    # mostra caminho atual',
    unlockedAtNode: 'puzzle_3_2_cd',
    phaseId: 3,
  },
  {
    id: 'entry_infra_kill',
    title: 'Infraestrutura: Encerramento de Processo kill',
    category: 'infra',
    analogyTitle: '💡 Analogia do Disjuntor',
    analogyText: 'O kill é o disjuntor de emergência: você identifica o aparelho que entrou em curto (PID 4040) e desliga SÓ ele (kill 4040). A rede elétrica (servidor) continua viva, só o problema some.',
    description: 'Encerra processos pelo PID. kill PID encerra graciosamente (SIGTERM). kill -9 PID força encerramento imediato (SIGKILL). Use com cautela.',
    codeSnippet: '# Gerenciamento de processos\nps aux | grep node  # acha PID\nkill 4040            # encerra gracioso\nkill -9 4040         # força (último recurso)',
    unlockedAtNode: 'puzzle_3_3_kill',
    phaseId: 3,
  },
];

const nodes = campaignData as DialogNode[];

export default function GameEnginePage() {
  // Estado Global do Jogo
  const [currentPhaseId, setCurrentPhaseId] = useState<PhaseId>(1);
  const [currentNodeId, setCurrentNodeId] = useState<string>('onboarding_intro');
  const [unlockedEntryIds, setUnlockedEntryIds] = useState<string[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [completedPhases, setCompletedPhases] = useState<PhaseId[]>([]);

  // Estados de Interação do Puzzle e Dicas
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [tauntMessage, setTauntMessage] = useState<string | null>(null);

  // Evita erro de hidratação - só renderiza após mount no client
  const [mounted, setMounted] = useState(false);

  // Nós da fase atual
  const currentPhaseNodes = nodes.filter((node) => node.phaseId === currentPhaseId);
  const currentNode = currentPhaseNodes.find((node) => node.id === currentNodeId) || currentPhaseNodes[0];
  const isPuzzleActive = currentNode.puzzleType !== 'none';
  const phaseConfig = PHASE_CONFIG[currentPhaseId];

  // Sincronização com LocalStorage (Persistência de Estado)
  useEffect(() => {
    setMounted(true);
    const savedPhase = localStorage.getItem('ghostlog_phase');
    const savedNode = localStorage.getItem('ghostlog_node');
    const savedEntries = localStorage.getItem('ghostlog_entries');
    const savedInventory = localStorage.getItem('ghostlog_inventory');
    const savedCompleted = localStorage.getItem('ghostlog_completed');

    if (savedPhase) {
      const phase = parseInt(savedPhase, 10) as PhaseId;
      if (PHASE_CONFIG[phase]) {
        setCurrentPhaseId(phase);
        setCurrentNodeId(savedNode || PHASE_CONFIG[phase].startNodeId);
      }
    }
    if (savedEntries) {
      setUnlockedEntryIds(JSON.parse(savedEntries));
    }
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
    if (savedCompleted) {
      setCompletedPhases(JSON.parse(savedCompleted));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ghostlog_phase', String(currentPhaseId));
    localStorage.setItem('ghostlog_node', currentNodeId);
  }, [currentPhaseId, currentNodeId]);

  useEffect(() => {
    localStorage.setItem('ghostlog_entries', JSON.stringify(unlockedEntryIds));
    localStorage.setItem('ghostlog_inventory', JSON.stringify(inventory));
    localStorage.setItem('ghostlog_completed', JSON.stringify(completedPhases));
  }, [unlockedEntryIds, inventory, completedPhases]);

  /**
   * Avança para o próximo nó após a leitura do texto (quando não há enigma pendente)
   */
  const handleAdvanceDialogue = () => {
    if (currentNode.nextNodeOnSuccess) {
      const nextNodeId = currentNode.nextNodeOnSuccess;
      
      // Verifica se o próximo nó é uma transição para outra fase
      if (nextNodeId === 'phase2_intro') {
        transitionToPhase(2);
      } else if (nextNodeId === 'phase3_intro') {
        transitionToPhase(3);
      } else if (nextNodeId === 'victory') {
        // Jogo completado - marca fase 3 como concluída
        setCurrentNodeId(nextNodeId);
        setHintsUsed(0);
        setTauntMessage(null);
        setCompletedPhases(prev => [...prev, 3]);
        checkAndUnlockEntry(nextNodeId);
      } else {
        setCurrentNodeId(nextNodeId);
        setHintsUsed(0);
        setTauntMessage(null);
        checkAndUnlockEntry(nextNodeId);
      }
    }
  };

  /**
   * Transiciona para a próxima fase
   */
  const transitionToPhase = (nextPhaseId: PhaseId) => {
    const nextPhaseConfig = PHASE_CONFIG[nextPhaseId];
    setCurrentPhaseId(nextPhaseId);
    setCurrentNodeId(nextPhaseConfig.startNodeId);
    setHintsUsed(0);
    setTauntMessage(null);
    setCompletedPhases(prev => [...prev, currentPhaseId]);
    checkAndUnlockEntry(nextPhaseConfig.startNodeId);
  };

  /**
   * Handler chamado quando o jogador resolve com sucesso o enigma no Terminal Espectral
   */
  const handlePuzzleSolve = () => {
    setHintsUsed(0);
    setTauntMessage(null);

    if (currentNode.nextNodeOnSuccess) {
      const nextNodeId = currentNode.nextNodeOnSuccess;
      
      if (nextNodeId === 'phase2_intro') {
        transitionToPhase(2);
      } else if (nextNodeId === 'phase3_intro') {
        transitionToPhase(3);
      } else if (nextNodeId === 'victory') {
        setCurrentNodeId(nextNodeId);
        setCompletedPhases(prev => [...prev, 3]);
        checkAndUnlockEntry(nextNodeId);
      } else {
        setCurrentNodeId(nextNodeId);
        checkAndUnlockEntry(nextNodeId);
      }
    }
  };

  /**
   * Handler chamado quando o jogador erra o enigma no Terminal Espectral
   */
  const handlePuzzleFail = () => {
    if (currentNode.tauntOnFail) {
      setTauntMessage(currentNode.tauntOnFail);
      setTimeout(() => setTauntMessage(null), 4000);
    }
  };

  const handleRequestHint = () => {
    if (currentNode.socraticHints && hintsUsed < 3) {
      setHintsUsed((prev) => prev + 1);
    }
  };

  const unlockEntry = (entryId: string) => {
    setUnlockedEntryIds((prev) => (prev.includes(entryId) ? prev : [...prev, entryId]));
  };

  const checkAndUnlockEntry = (nodeId: string) => {
    // Encontra a entrada do compêndio que desbloqueia neste nó
    const entry = LEGACY_COMPENDIUM_DATABASE.find(e => e.unlockedAtNode === nodeId);
    if (entry) {
      unlockEntry(entry.id);
    }
    
    // Itens de inventário por marco
    if (nodeId === 'phase1_outro') {
      addInventoryItem('Chave do Setor 1');
    }
    if (nodeId === 'phase2_outro') {
      addInventoryItem('Crachá de Acesso Nível 2');
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
    setCurrentPhaseId(1);
    setCurrentNodeId('onboarding_intro');
    setUnlockedEntryIds([]);
    setInventory([]);
    setCompletedPhases([]);
    setHintsUsed(0);
    setTauntMessage(null);
    localStorage.removeItem('ghostlog_phase');
    localStorage.removeItem('ghostlog_node');
    localStorage.removeItem('ghostlog_entries');
    localStorage.removeItem('ghostlog_inventory');
    localStorage.removeItem('ghostlog_completed');
  };

  // Info da fase atual para HUD
  const getCurrentPhaseDisplay = (): string => {
    const phaseIndex = PHASE_ORDER.indexOf(currentPhaseId);
    
    if (currentNodeId === 'victory') return 'CONCLUÍDO ✅';
    return `${phaseConfig.title} — Enigma ${getPuzzleNumberInPhase()}/3`;
  };

  // Calcula qual enigma da fase atual (1-3)
  const getPuzzleNumberInPhase = (): number => {
    const puzzleNodes = currentPhaseNodes.filter(n => n.puzzleType !== 'none');
    const currentIndex = puzzleNodes.findIndex(n => n.id === currentNodeId);
    if (currentIndex >= 0) return currentIndex + 1;
    // Se está em nó de transição/intro, mostra o próximo
    const nextPuzzle = puzzleNodes.find(n => 
      currentPhaseNodes.findIndex(c => c.id === currentNodeId) < currentPhaseNodes.findIndex(c => c.id === n.id)
    );
    if (nextPuzzle) return puzzleNodes.findIndex(n => n.id === nextPuzzle.id) + 1;
    return 1;
  };

  // Info do compêndio para o desafio atual
  const getCurrentCompendiumInfo = () => {
    if (!isPuzzleActive) return {};
    const entry = LEGACY_COMPENDIUM_DATABASE.find(e => e.unlockedAtNode === currentNodeId);
    if (entry) {
      return {
        analogyTitle: entry.analogyTitle,
        analogyText: entry.analogyText,
        description: entry.description,
        codeSnippet: entry.codeSnippet,
      };
    }
    return {};
  };

  return (
    !mounted ? (
      <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/10 to-black select-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl animate-pulse">👻</span>
            <p className="mt-4 text-lg font-mono text-emerald-400">CARREGANDO GHOST.LOG...</p>
          </div>
        </div>
      </main>
    ) : (
      <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/10 to-black select-none">
      
      {/* Camada CRT de Filtro Retro */}
      {crtEnabled && <div className="crt-overlay fixed inset-0 z-20 pointer-events-none" />}

      {/* Cenário Simulado de Laboratório Sombrio */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
        <div className="absolute top-1/3 right-16 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-emerald-400 animate-pulse opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* HUD & Cabeçalho */}
      <GameHeader
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        crtEnabled={crtEnabled}
        onToggleCRT={() => setCrtEnabled(!crtEnabled)}
        onResetGame={handleResetGame}
        currentPhase={getCurrentPhaseDisplay()}
        currentGhost={phaseConfig.ghostName}
        currentSector={phaseConfig.sectorName}
        completedPhases={completedPhases}
        totalPhases={PHASE_ORDER.length}
      />

      {/* Compêndio do Código Legado */}
      <LegacyCompendium
        unlockedEntryIds={unlockedEntryIds}
        inventory={inventory}
        {...getCurrentCompendiumInfo()}
      />

      {/* Área Central da Gameplay */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6 px-4">
        
        {currentNode.isContextModal ? (
          /* Modal de Contexto da Fase (ALERTA DE SISTEMA) */
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
            <div className="bg-slate-900/90 border-2 border-red-500/50 rounded-lg p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur-md">
              <h2 className="text-red-400 font-mono font-bold text-xl mb-4 flex items-center gap-2">
                <span className="animate-pulse">⚠️</span> {currentNode.speaker}
              </h2>
              
              {/* Analogia no modal de contexto */}
              {currentNode.analogyTitle && currentNode.analogyText && (
                <div className="mb-4 p-4 rounded-lg bg-amber-950/30 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💡</span>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Analogia de Bolso
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-amber-200 mb-1">{currentNode.analogyTitle}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{currentNode.analogyText}</p>
                </div>
              )}
              
              <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
                {currentNode.text}
              </p>
              {currentNode.nextNodeOnSuccess && !currentNode.nextNodeOnSuccess.includes('victory') && (
                <button 
                  onClick={handleAdvanceDialogue}
                  className="w-full py-3 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 font-mono font-bold rounded transition-colors active:scale-95"
                >
                  {currentNode.nextNodeOnSuccess.startsWith('phase') && currentNode.nextNodeOnSuccess.includes('intro')
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
            speaker={hintsUsed > 0 ? "Monitor Fantasma" : currentNode.speaker}
            text={hintsUsed > 0 && currentNode.socraticHints ? currentNode.socraticHints[hintsUsed - 1] : currentNode.text}
            isPuzzleActive={isPuzzleActive}
            onNextNode={handleAdvanceDialogue}
            soundEnabled={soundEnabled}
            socraticHints={currentNode.socraticHints}
            hintsUsed={hintsUsed}
            onRequestHint={handleRequestHint}
            hasHintsAvailable={!!currentNode.socraticHints && hintsUsed < 3}
          />
        )}

        {/* Terminal Espectral (Input Interativo) */}
        {isPuzzleActive && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center mt-4">
            
            {/* Mensagem de Provocação (Taunt) ao errar */}
            {tauntMessage && (
              <div className="mb-4 text-red-400 font-mono text-sm font-bold bg-red-950/50 px-4 py-2 rounded border border-red-500/50 animate-pulse">
                {tauntMessage}
              </div>
            )}

            <SpectralTerminal
              puzzleType={currentNode.puzzleType}
              expectedAnswers={currentNode.expectedAnswer}
              codeTemplate={currentNode.codeTemplate}
              onSolve={handlePuzzleSolve}
              onFail={handlePuzzleFail}
            />

          </div>
        )}
      </div>

      {/* Rodapé Informativo */}
      <footer className="relative z-10 py-3 text-center text-xs font-mono text-slate-500 border-t border-slate-900/80 bg-slate-950/80 backdrop-blur-md">
        <span>Ghost.log — Terminal Assombrado • {phaseConfig.sectorName} • {phaseConfig.ghostName}</span>
      </footer>
    </main>
    )
  );
}