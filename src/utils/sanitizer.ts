/**
 * Utilitário de Sanitização e Validação de Respostas para o Terminal Ouija
 * 
 * Atende às diretrizes do Passo 4:
 * Sanitização rigorosa aplicando .trim(), .toLowerCase() e remoção de espaços extras entre caracteres.
 */

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
 * Valida a resposta do jogador contra um array de respostas esperadas.
 * 
 * @param userInput Entrada do jogador.
 * @param expectedAnswers Lista de opções aceitas do nó do JSON.
 * @returns boolean indicando se a resposta é válida.
 */
export function validateAnswer(userInput: string, expectedAnswers?: string[]): boolean {
  if (!expectedAnswers || expectedAnswers.length === 0) return false;
  
  const cleanUser = sanitizeInput(userInput);

  return expectedAnswers.some((answer) => {
    const cleanExpected = sanitizeInput(answer);
    return cleanUser === cleanExpected;
  });
}
