# Documentação de Arquitetura Técnica — Ghost.log (MVP)

Este documento descreve a arquitetura do MVP de **Ghost.log**, um jogo point-and-click investigativo educacional em React, Next.js (App Router), TypeScript e Tailwind CSS.

O projeto foi construído focando em alta coesão, baixo acoplamento e separação estrita entre conteúdo e lógica.

---

## 1. Visão Geral (Data-Driven Design)

A principal premissa arquitetural é que **a lógica do jogo e os componentes visuais são burros em relação à história**. Todo o roteiro (falas, puzzles, respostas, transições) vive fora do React, em arquivos JSON estáticos.

```
[ src/content/valdemar.json ] (O Roteiro e Material Didático)
             │
             ▼
    [ GameEngine (src/app/page.tsx) ] (O Controlador Principal)
        │            │             │           │
        ▼            ▼             ▼           ▼
[DialogueSystem] [GhostBust] [OuijaTerminal] [Necronomicon]
```

### Princípios da Arquitetura
1. **Componentização Isolada**: Os componentes não se comunicam diretamente. O fluxo de dados é 100% *Top-Down* (GameEngine -> Componente).
2. **Tipagem Estrita**: Proibição total de `any`. Uso de interfaces TypeScript (`src/types/game.ts`).
3. **Imutabilidade Visual**: Se o texto do fantasma precisa mudar, altera-se o JSON, nunca o código TypeScript.

---

## 2. Dicionário de Componentes e Responsabilidades

Para facilitar a manutenção e evolução do aprendizado, aqui está o mapeamento exato de quem faz o quê no código:

### 🧠 GameEngine (`src/app/page.tsx`)
**Responsabilidade:** É o orquestrador do estado global. 
- Ele importa o `valdemar.json` e sabe em qual "nó" (etapa da história) o jogador está (`currentNodeId`).
- Repassa o texto e o nome de quem fala para o `DialogueSystem`.
- Escuta se o jogador acertou (`onSolve`) ou errou (`onFail`) pelo `OuijaTerminal` e avança o ID do nó.

### 📜 Fonte de Dados (`src/content/valdemar.json`)
**Responsabilidade:** Define a "vida" do jogo.
- **Como funciona:** É um array de objetos. Cada objeto (nó) tem um `id`, o `speaker` (Quem fala), o `text` (A fala/pergunta), e pode conter `expectedAnswer` e ponteiros de navegação (`nextNodeOnSuccess`, `nextNodeOnFail`).
- **Aprendizagem:** É aqui que a mágica didática acontece. É possível expandir este JSON para criar fluxos não lineares (ex: se o jogador errar o puzzle 2x, vai para um nó de explicação mais aprofundada em vez de apenas dar a resposta).

### 💬 DialogueSystem (`src/components/DialogueSystem.tsx`)
**Responsabilidade:** Renderização da Visual Novel e Áudio.
- Recebe a string de texto e faz a animação progressiva de "máquina de escrever" (`typewriter`).
- Aciona o motor de áudio sintético (`services/audio.ts`) para tocar os "Voice Blips" enquanto as letras aparecem.

### 👻 GhostBust (`src/components/GhostBust.tsx`)
**Responsabilidade:** Avatar visual da Entidade.
- Renderiza a imagem, emoji, e aros brilhantes ectoplásmicos da entidade atual.
- **Evolução:** Atualmente usa emojis (💀 ou 👻) baseados no nome do falante, mas **é o componente exato que deve ser alterado** para incluir o `<Image>` do Next.js e exibir artes 2D completas dos professores.

### 💻 OuijaTerminal (`src/components/OuijaTerminal.tsx` e `src/utils/sanitizer.ts`)
**Responsabilidade:** Validação de Input e Puzzle.
- Exibe o input verde neon.
- Captura a resposta do usuário, envia para a função `sanitizeInput` (que faz `.trim()`, `.toLowerCase()` e tira espaços duplicados) e a compara com o que o JSON definiu em `expectedAnswers`.
- Toca o som de erro ou acerto e avisa a `GameEngine`.

### 📖 Necronomicon (`src/components/Necronomicon.tsx`)
**Responsabilidade:** Repositório de Conhecimento e Feedback.
- Um "Side-sheet" offcanvas que funciona como inventário e manual do aluno. 
- Guarda os feitiços de TI destravados (Tags HTML, Looping, SQL).

---

## 3. Contratos Principais TypeScript (`src/types/game.ts`)

O ecossistema se baseia nas seguintes interfaces principais:

```typescript
type PuzzleType = 'html' | 'python' | 'sql' | 'none';

interface DialogNode {
  id: string;
  speaker: string;
  text: string;
  puzzleType: PuzzleType;
  expectedAnswer?: string[]; // Arrays com respostas validadas e higienizadas
  nextNodeOnSuccess?: string; // Para onde ir se acertar ou clicar em avançar
  nextNodeOnFail?: string;    // Para onde ir se o terminal acusar erro
}
```

---

## 4. Gerenciamento de Estado (Local vs Global)

- **Estado Efêmero (Local):** Texto digitado no terminal, animação se o fantasma está falando, aba do Necronomicon aberta/fechada. Ficam estritamente dentro dos seus respectivos componentes via `useState`.
- **Estado de Partida (Global):** Fase atual, ID do nó, Itens, Feitiços destravados. Vivem dentro de `page.tsx` para evitar prop-drilling excessivo no MVP. (Nota: Para escalabilidade futura, deve ser migrado para Zustand ou Context API).

