/**
 * Utilitário de Sanitização e Validação de Respostas para o Terminal Espectral
 * 
 * Sanitização rigorosa aplicando .trim(), .toLowerCase() e remoção de espaços extras.
 * Inclui feedback educativo para entradas próximas ou vazias.
 */

export type FeedbackType = 'empty' | 'close' | 'wrong' | 'correct';

export interface ValidationResult {
  isCorrect: boolean;
  feedbackType: FeedbackType;
  message: string;
}

/**
 * Sanitiza uma string de entrada removendo espaços nas pontas,
 * convertendo para minúsculas e reduzindo múltiplos espaços internos para apenas um.
 * 
 * @param input String bruta digitada pelo jogador.
 * @returns String higienizada e padronizada.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Calcula a distância de Levenshtein simplificada para detectar entradas próximas.
 * Retorna true se a entrada do usuário for muito parecida com uma resposta esperada.
 */
function isCloseMatch(userInput: string, expected: string, threshold = 0.7): boolean {
  if (userInput === expected) return true;
  if (userInput.length === 0 || expected.length === 0) return false;
  
  // Verifica se uma string contém a outra (substring match)
  if (expected.includes(userInput) || userInput.includes(expected)) return true;
  
  // Verifica similaridade por caracteres comuns
  const longer = userInput.length > expected.length ? userInput : expected;
  const shorter = userInput.length > expected.length ? expected : userInput;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length >= threshold;
}

/**
 * Valida a resposta do jogador contra um array de respostas esperadas
 * e retorna resultado detalhado com feedback educativo.
 * 
 * @param userInput Entrada do jogador.
 * @param expectedAnswers Lista de opções aceitas do nó do JSON.
 * @returns ValidationResult com isCorrect, feedbackType e mensagem educativa.
 */
export function validateAnswer(userInput: string, expectedAnswers?: string[]): ValidationResult {
  if (!expectedAnswers || expectedAnswers.length === 0) {
    return { isCorrect: false, feedbackType: 'wrong', message: 'Nenhuma resposta esperada configurada.' };
  }

  const cleanUser = sanitizeInput(userInput);

  // Input vazio
  if (!cleanUser) {
    return { 
      isCorrect: false, 
      feedbackType: 'empty', 
      message: 'Digite algo no terminal! A lacuna _____ espera uma palavra-chave.' 
    };
  }

  // Verifica correspondência exata
  for (const answer of expectedAnswers) {
    const cleanExpected = sanitizeInput(answer);
    if (cleanUser === cleanExpected) {
      return { isCorrect: true, feedbackType: 'correct', message: '' };
    }
  }

  // Verifica correspondência próxima (feedback educativo)
  for (const answer of expectedAnswers) {
    const cleanExpected = sanitizeInput(answer);
    if (isCloseMatch(cleanUser, cleanExpected)) {
      return { 
        isCorrect: false, 
        feedbackType: 'close', 
        message: `Quase! Você digitou "${cleanUser}". A resposta esperada é parecida com "${cleanExpected}". Verifique a ortografia.` 
      };
    }
  }

  // Totalmente errado
  return { 
    isCorrect: false, 
    feedbackType: 'wrong', 
    message: `Comando não reconhecido: "${cleanUser}". Consulte o Compêndio ou peça dica ao Monitor (👨‍🎓).` 
  };
}

/**
 * Validação simples (boolean) para compatibilidade com código existente.
 */
export function validateAnswerSimple(userInput: string, expectedAnswers?: string[]): boolean {
  return validateAnswer(userInput, expectedAnswers).isCorrect;
}