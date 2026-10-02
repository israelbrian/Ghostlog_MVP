# Plano de Melhorias Futuras (Aprendizagem e Didática)

Este documento detalha o plano de ação para lapidar a experiência de aprendizado do MVP do Ghost.log, transformando-o de um simples jogo de "perguntas e respostas com cópia" para uma ferramenta educacional interativa.

---

## 1. Melhoria do Roteiro (JSON Data-Driven)

**Problema Atual:** Quando o jogador erra um enigma, o "Monitor Falecido" dá a resposta exata. Isso gera um ciclo de memorização rasa (tentativa -> erro -> recebe resposta -> copia -> avança).

**Ação Proposta:**
- **Sistema de Dicas Socráticas:** Alterar a estrutura do `valdemar.json` para suportar múltiplas tentativas com dicas graduais.
  - *Erro 1 (Dica Conceitual):* "Qual é o objetivo deste comando? O que você está tentando buscar?"
  - *Erro 2 (Dica Estrutural):* "Lembre-se que em SQL, para filtrar linhas, usamos uma palavra-chave específica antes da condição..."
  - *Erro 3 (Dica Prática):* "Consulte a seção sobre Filtros no seu Necronomicon."

---

## 2. Puzzles Contextuais e Interpretativos

**Problema Atual:** O terminal pede para o jogador digitar conceitos inteiros a partir do zero de forma livre.

**Ação Proposta:**
- **Preenchimento de Lacunas (Fill-in-the-blanks):** Em vez de digitar um loop `while` inteiro, mostrar na tela (no terminal) um código quebrado e pedir para o jogador digitar apenas a instrução faltante.
- **Análise de Erro:** Mostrar um erro "impresso" no terminal (ex: `SyntaxError: unexpected token`) e pedir para o jogador submeter a versão corrigida da linha.

---

## 3. Um Necronomicon Dinâmico e Prévio

**Problema Atual:** O jogador ganha o "Feitiço" no Necronomicon apenas *depois* que resolve o puzzle (como recompensa).

**Ação Proposta:**
- O Necronomicon deve funcionar como o "StackOverflow" do jogo.
- O jogador precisa destravar "Páginas Rasgadas" antes de enfrentar o puzzle.
- Quando ele chegar no desafio, o fantasma não dará dicas; o jogador será forçado a abrir o Necronomicon, ler a teoria, entender a sintaxe, e então aplicar no Terminal Ouija.

---

## 4. Feedback de Sintaxe Granular (`sanitizer.ts`)

**Problema Atual:** O terminal diz apenas "Certo" ou "Errado".

**Ação Proposta:**
- Expandir o `validateAnswer` no `sanitizer.ts` para capturar erros comuns.
- **Exemplo:** Se a resposta correta de SQL precisa de `WHERE`, e o jogador escreve o `SELECT` perfeitamente, mas esquece o filtro, o terminal acusa: *"Entidade detectada, mas você esqueceu de filtrar! Não faça um table scan no além!"* em vez de apenas falhar genericamente.

---

## 5. Substituição dos Emojis por Arte (Avatar 2D)

**Componente Alvo:** `src/components/GhostBust.tsx`

**Ação Proposta:**
- Abandonar o uso de `👻` e `💀`.
- Atualizar o componente para utilizar o `<Image />` nativo do Next.js.
- O nome do fantasma (via props) determinará qual arquivo `.png` de `public/sprites/` será renderizado (ex: `valdemar-idle.png`, `monitor-angry.png`).
- Manter as animações de CSS atuais (flutuação e pulsar), aplicando-as ao componente de imagem para preservar a estética fantasmagórica sem esforço adicional de desenvolvimento.
