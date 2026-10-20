/**
 * Contrato de Tipos para o Jogo Ghost.log — O Terminal Assombrado
 * 
 * Este arquivo define as interfaces TypeScript estritas utilizadas pela engine do jogo,
 * garantindo tipagem forte e prevenindo erros de compilação.
 * Nomenclatura blindada: sem referências a marcas de terceiros.
 */

export type PuzzleType = 'html' | 'logic' | 'python' | 'sql' | 'infra' | 'none';
export type PhaseId = 1 | 2 | 3;
export type GhostId = 'helena' | 'valdemar' | 'cleiton';

/**
 * Representa um nó da árvore de diálogo lido do arquivo JSON.
 * Estrutura expandida para suportar analogias didáticas, dicas socráticas e templates visuais.
 */
export interface DialogNode {
  id: string;
  phaseId: PhaseId;
  sectorName: string;
  speaker: string;
  text: string;
  puzzleType: PuzzleType;
  analogyTitle?: string;
  analogyText?: string;
  codeTemplate?: string; // Template visual do desafio fill-in-the-blanks
  expectedAnswer?: string[]; // Array de respostas sanitizadas aceitas
  nextNodeOnSuccess?: string;
  nextNodeOnFail?: string;
  socraticHints?: [string, string, string]; // Exatamente 3 dicas: 1.Conceito/Analogia, 2.Estrutura, 3.Sintaxe
  tauntOnFail?: string;
  isContextModal?: boolean;
}

/**
 * Configuração de uma Fase/Setor
 */
export interface PhaseConfig {
  id: PhaseId;
  ghostId: GhostId;
  title: string;
  sectorName: string;
  ghostName: string;
  ghostSprite: string;
  theme: 'html' | 'logic' | 'python' | 'sql' | 'infra';
  jsonFile: string;
  startNodeId: string;
}

/**
 * Entrada do Compêndio do Código Legado (conhecimentos desbloqueados).
 */
export interface LegacyCompendiumEntry {
  id: string;
  title: string;
  category: 'html' | 'logic' | 'python' | 'sql' | 'infra';
  analogyTitle: string;
  analogyText: string;
  description: string;
  codeSnippet: string;
  unlockedAtNode: string;
  phaseId: PhaseId;
}

/**
 * Estado Global do Jogo (GameEngine State).
 */
export interface GameState {
  currentPhaseId: PhaseId;
  currentNodeId: string;
  unlockedEntryIds: string[];
  inventory: string[];
  soundEnabled: boolean;
  crtEffectEnabled: boolean;
  isGameCompleted: boolean;
  attemptsCount: number;
  completedPhases: PhaseId[];
}