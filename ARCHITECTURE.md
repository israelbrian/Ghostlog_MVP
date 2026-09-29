# Documentação de Arquitetura Técnica — Ghost.log (MVP)

Este documento descreve a arquitetura de alta coesão e baixo acoplamento implementada no MVP de **Ghost.log**, um jogo point-and-click investigativo educacional em React, Next.js (App Router), TypeScript e Tailwind CSS.

---

## 1. Visão Geral da Arquitetura (Data-Driven Design)

O motor do jogo foi construído seguindo o princípio **Data-Driven Design (Design Orientado a Dados)**. Toda a narrativa, diálgo, enigmas e condições de transição residem fora da lógica dos componentes React, em arquivos JSON estruturados.

```
[ src/content/valdemar.json ]
            │
            ▼
   [ GameEngine (src/app/page.tsx) ]
       │            │             │
       ▼            ▼             ▼
[DialogueSystem] [OuijaTerminal] [Necronomicon]
```

### Princípios da Arquitetura
1. **Componentização Isolada**: Nenhum componente conhece a implementação interna dos outros. O `DialogueSystem` apenas renderiza textos, o `OuijaTerminal` apenas lê e valida inputs, e o `Necronomicon` exibe feitiços anotados.
2. **Tipagem Estrita**: Proibição total do uso de `any`. Todos os nós de diálogo e estados utilizam interfaces TypeScript estritas.
3. **Higienização Centralizada**: Todo input do jogador passa pela função `sanitizeInput()`, aplicando `.trim()`, `.toLowerCase()` e remoção de espaços extras duplos.

---

## 2. Contrato de Interfaces TypeScript (`src/types/game.ts`)

### `PuzzleType`
```typescript
type PuzzleType = 'html' | 'python' | 'sql' | 'none';
```

### `DialogNode`
```typescript
interface DialogNode {
  id: string;
  speaker: string;
  text: string;
  puzzleType: PuzzleType;
  expectedAnswer?: string[]; // Array de respostas sanitizadas aceitas
  nextNodeOnSuccess?: string;
  nextNodeOnFail?: string;
}
```

---

## 3. Guia de Criação de Novas Entidades / Fantasmas

Para adicionar um novo fantasma ao jogo (ex: Professora de Algoritmos no Ato 2):

1. **Criar o arquivo JSON da história**:
   Crie `src/content/[nome_fantasma].json` respeitando a interface `DialogNode[]`.
2. **Definir os Enigmas e Respostas**:
   No array `expectedAnswer`, insira as variações possíveis de resposta sanitizadas (o terminal aplicará `.trim().toLowerCase()` e tratará os espaços automaticamente).
3. **Registrar Feitiços no Necronomicon**:
   No arquivo `src/components/Necronomicon.tsx`, adicione a nova entrada no array `NECRONOMICON_DATABASE`.

---

## 4. Guia de Contrato para Novos Enigmas (`OuijaTerminal`)

Todo novo componente de enigma deve respeitar o seguinte contrato de props:

```typescript
interface PuzzleProps {
  puzzleType: PuzzleType;
  expectedAnswers?: string[];
  onSolve: () => void;
  onFail: () => void;
}
```

---

## 5. Dicionário de Flags de Estado (`GameState`)

| Flag / Variável | Tipo | Descrição |
| :--- | :--- | :--- |
| `currentNodeId` | `string` | ID do nó atual do JSON em execução. |
| `unlockedSpellIds` | `string[]` | Lista de IDs dos feitiços desbloqueados no Necronomicon. |
| `inventory` | `string[]` | Itens coletados pelo estagiário (ex: `Disquete da Paz 💾`). |
| `soundEnabled` | `boolean` | Alterna o sintetizador de áudio Web Audio API. |
| `crtEnabled` | `boolean` | Alterna o efeito de linhas de varredura CRT na tela. |

---

## 6. Sistema de Sanitização de Input (`src/utils/sanitizer.ts`)

A função `sanitizeInput(input: string)` garante tratamento uniforme:
1. `.trim()` remove espaços nas extremidades.
2. `.toLowerCase()` converte todos os caracteres para minúsculas.
3. `.replace(/\s+/g, ' ')` reduz múltiplos espaços consecutivos para um único espaço.
