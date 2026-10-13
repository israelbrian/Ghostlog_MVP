/**
 * Contrato de Tipos para o Jogo Ghost.log (MVP - 3 Fantasmas / 3 Atos)
 * 
 * Este arquivo define as interfaces TypeScript estritas utilizadas pela engine do jogo,
 * garantindo tipagem forte e prevenindo erros de compilação.
 */

export type PuzzleType = 'html' | 'python' | 'sql' | 'none';
export type ActId = 'act1' | 'act2' | 'act3';
export type GhostId = 'valdemar' | 'pythonicus' | 'dba';

/**
 * Representa um nó da árvore de diálogo lido do arquivo JSON.
 */
export interface DialogNode {
  id: string;
  speaker: string;
  text: string;
  puzzleType: PuzzleType;
  expectedAnswer?: string[]; // Array de respostas sanitizadas aceitas
  nextNodeOnSuccess?: string;
  nextNodeOnFail?: string; // (Será desencorajado em favor de tentar de novo na mesma tela)
  hints?: string[]; // Array de dicas socráticas progressivas
  tauntOnFail?: string; // Frase provocativa do fantasma ao errar
  isContextModal?: boolean; // Se true, exibe um modal de contextualização antes do puzzle
}

/**
 * Configuração de um Ato/Fantasma
 */
export interface ActConfig {
  id: ActId;
  ghostId: GhostId;
  title: string;
  ghostName: string;
  ghostSprite: string;
  theme: 'html' | 'python' | 'sql';
  jsonFile: string; // Caminho do arquivo JSON
  startNodeId: string;
}

/**
 * Entrada do Necronomicon (Grimório de TI contendo os feitiços/dicas aprendidos).
 */
export interface NecronomiconEntry {
  id: string;
  title: string;
  category: 'html' | 'python' | 'sql';
  description: string;
  codeSnippet: string;
  unlockedAtNode: string;
  actId: ActId; // Em qual ato esse feitiço é desbloqueado
}

/**
 * Estado Global do Jogo (GameEngine State).
 */
export interface GameState {
  currentActId: ActId;
  currentNodeId: string;
  unlockedSpellIds: string[];
  inventory: string[];
  soundEnabled: boolean;
  crtEffectEnabled: boolean;
  isGameCompleted: boolean;
  attemptsCount: number;
  completedActs: ActId[];
}
