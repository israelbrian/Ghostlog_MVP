/**
 * Contrato de Tipos para o Jogo Ghost.log (MVP - Fantasma Valdemar)
 * 
 * Este arquivo define as interfaces TypeScript estritas utilizadas pela engine do jogo,
 * garantindo tipagem forte e prevenindo erros de compilação.
 */

export type PuzzleType = 'html' | 'python' | 'sql' | 'none';

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
 * Entrada do Necronomicon (Grimório de TI contendo os feitiços/dicas aprendidos).
 */
export interface NecronomiconEntry {
  id: string;
  title: string;
  category: 'html' | 'python' | 'sql';
  description: string;
  codeSnippet: string;
  unlockedAtNode: string;
}

/**
 * Estado Global do Jogo (GameEngine State).
 */
export interface GameState {
  currentNodeId: string;
  unlockedSpellIds: string[];
  inventory: string[];
  soundEnabled: boolean;
  crtEffectEnabled: boolean;
  isGameCompleted: boolean;
  attemptsCount: number;
}
