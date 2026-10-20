# ARCHITECTURE.md — Ghost.log: O Terminal Assombrado

> Documentação técnica interna. Obrigatória para toda nova feature (conforme Regulamento item 6.3).  
> Mantida sincronizada com GDD.md e README.md.

---

## 1. Visão Geral da Arquitetura

**Padrão:** Data-Driven + Component-Based + TypeScript Estrito  
**Princípios:** Alta coesão, baixo acoplamento, responsabilidade única, tipagem como documentação.

```
┌─────────────────────────────────────────────────────────────┐
│                      GameEngine (page.tsx)                  │
│  Estado Global: fase, nó, compêndio, inventário, áudio, CRT │
│  Persistência: localStorage sincronizado via useEffect      │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ DialogueSystem│ │SpectralTerminal│ │LegacyCompendium│
│  (Visual Novel)│ │  (Fill-in-blank)│ │  (Guia Ativo)  │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    GhostBust (Avatar 2D)                    │
│              GameHeader (HUD)           AudioService        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   campaign.json        │
              │   (Fonte da Verdade)   │
              └────────────────────────┘
```

---

## 2. Contratos TypeScript (src/types/game.ts)

### 2.1 Tipos Primitivos
```typescript
type PuzzleType = 'html' | 'logic' | 'python' | 'sql' | 'infra' | 'none';
type PhaseId = 1 | 2 | 3;
type GhostId = 'helena' | 'valdemar' | 'cleiton';
```

### 2.2 DialogNode — Nó da Árvore de Diálogo
```typescript
interface DialogNode {
  id: string;                    // ID único (ex: "puzzle_1_1_html")
  phaseId: PhaseId;              // 1, 2 ou 3
  sectorName: string;            // Nome do setor para HUD
  speaker: string;               // Quem fala
  text: string;                  // Texto principal (ou dica atual)
  puzzleType: PuzzleType;        // Tipo do enigma (ou 'none')
  analogyTitle?: string;         // "💡 Analogia do Sanduíche"
  analogyText?: string;          // Texto da analogia didática
  codeTemplate?: string;         // Template visual: "[ <body> _____ ]"
  expectedAnswer?: string[];     // Whitelist sanitizada
  nextNodeOnSuccess?: string;    // Próximo nó em sucesso
  nextNodeOnFail?: string;       // (Opcional) fallback
  socraticHints?: [string, string, string]; // Exatamente 3 dicas
  tauntOnFail?: string;          // Provocação do Espectro
  isContextModal?: boolean;      // Modal vermelho ALERTA DE SISTEMA
}
```

### 2.3 PhaseConfig — Configuração de Fase
```typescript
interface PhaseConfig {
  id: PhaseId;
  ghostId: GhostId;
  title: string;           // "FASE 1/3"
  sectorName: string;      // "Setor 1: Laboratório de Desenvolvimento"
  ghostName: string;       // "Profª. Helena Vilar"
  ghostSprite: string;     // "/sprites/helena.jpg"
  theme: PuzzleType;       // Tema principal da fase
  startNodeId: string;     // Nó inicial ao entrar na fase
}
```

### 2.4 LegacyCompendiumEntry — Entrada do Compêndio
```typescript
interface LegacyCompendiumEntry {
  id: string;
  title: string;
  category: 'html' | 'logic' | 'python' | 'sql' | 'infra';
  analogyTitle: string;
  analogyText: string;
  description: string;
  codeSnippet: string;
  unlockedAtNode: string;  // ID do nó que desbloqueia
  phaseId: PhaseId;
}
```

### 2.5 GameState — Estado Global (para debugging/serialização)
```typescript
interface GameState {
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
```

---

## 3. Dicionário de Componentes

### 3.1 GameEngine (`src/app/page.tsx`)
**Responsabilidade:** Orquestrador central. Lê `campaign.json`, gerencia estado global, transições de fase, persistência.
- **Props:** Nenhuma (root component).
- **Estado:** `currentPhaseId`, `currentNodeId`, `unlockedEntryIds`, `inventory`, `soundEnabled`, `crtEnabled`, `completedPhases`, `hintsUsed`, `tauntMessage`, `mounted`.
- **Callbacks:** `handleAdvanceDialogue`, `handlePuzzleSolve`, `handlePuzzleFail`, `handleRequestHint`, `transitionToPhase`, `checkAndUnlockEntry`, `handleResetGame`.
- **Persistência:** 5 chaves localStorage (`ghostlog_phase`, `ghostlog_node`, `ghostlog_entries`, `ghostlog_inventory`, `ghostlog_completed`).

### 3.2 DialogueSystem (`src/components/DialogueSystem.tsx`)
**Responsabilidade:** Visual Novel — typewriter, avatar, dicas socráticas.
- **Props:** `speaker`, `text`, `isPuzzleActive`, `onNextNode`, `soundEnabled`, `socraticHints`, `hintsUsed`, `onRequestHint`, `hasHintsAvailable`.
- **Estado interno:** `displayedText`, `isTyping`, `textIndexRef`, `soundEnabledRef`.
- **Comportamento:** Typewriter 28ms/char, voice blip por char não-espaço, clique para pular/avançar, botão Monitor Fantasma condicional.

### 3.3 SpectralTerminal (`src/components/SpectralTerminal.tsx`)
**Responsabilidade:** Terminal interativo — template visual, input, validação, feedback.
- **Props:** `puzzleType`, `expectedAnswers`, `codeTemplate`, `onSolve`, `onFail`.
- **Estado interno:** `inputValue`, `statusFeedback` (`idle`|`success`|`error`|`close`), `errorMessage`, `inputRef`.
- **Validação:** Usa `validateAnswer()` de `sanitizer.ts` → `ValidationResult` com `isCorrect`, `feedbackType` (`empty`|`close`|`wrong`|`correct`), `message`.
- **Feedback visual:** Borda verde (sucesso), âmbar (quase), vermelho (erro), mensagem educativa.
- **Auto-focus:** `useEffect` no `puzzleType` + `onClick` no wrapper.

### 3.4 LegacyCompendium (`src/components/LegacyCompendium.tsx`)
**Responsabilidade:** Sidebar modal — analogia ativa, cards desbloqueados, inventário.
- **Props:** `unlockedEntryIds`, `inventory`, `currentAnalogyTitle`, `currentAnalogyText`, `currentDescription`, `currentCodeSnippet`.
- **Estado interno:** `isOpen`, `copiedId`.
- **Dados:** `LEGACY_COMPENDIUM_DATABASE` (10 entradas, 3 por fase + 1 extra).
- **Features:** Copy-to-clipboard com toast, badge de contador, analogia de bolso do desafio atual.

### 3.5 GhostBust (`src/components/GhostBust.tsx`)
**Responsabilidade:** Avatar 2D flutuante com halo e animações.
- **Props:** `speakerName`, `isTalking`.
- **Lógica de seleção:** `speakerName` → determina sprite/glow/borda (Sistema/Monitor/Helena/Valdemar/Cleiton).
- **Animações CSS:** `animate-float` (idle), `animate-bounce-gentle` (falando), halo `scale` + `opacity`.

### 3.6 GameHeader (`src/components/GameHeader.tsx`)
**Responsabilidade:** HUD topo — título, fase/enigma, progresso, toggles.
- **Props:** `soundEnabled`, `onToggleSound`, `crtEnabled`, `onToggleCRT`, `onResetGame`, `currentPhase`, `currentGhost`, `currentSector`, `completedPhases`, `totalPhases`.
- **Toggles:** Som (Web Audio), CRT (overlay CSS), Reset (limpa tudo).

### 3.7 AudioService (`src/services/audio.ts`)
**Responsabilidade:** Web Audio API nativa — sons 8-bit sintéticos.
- **Métodos:** `playVoiceBlip()` (typewriter), `playTerminalSubmit()`, `playSuccessChime()`, `playErrorBuzz()`, `setEnabled(bool)`.
- **Implementação:** `AudioContext` lazy, oscillators (square/sine), gain envelopes, sem arquivos externos.

---

## 4. Fluxo de Dados

### 4.1 Inicialização
1. `GameEngine` monta → `mounted=true` → lê localStorage → define fase/nó/estado.
2. Filtra `campaign.json` por `phaseId` → `currentPhaseNodes`.
3. Encontra `currentNode` por `currentNodeId`.

### 4.2 Loop Principal
```
render currentNode
  ├─ isContextModal → Modal ALERTA (analogia + botão CONTINUAR/PRÓXIMO SETOR)
  └─ else → DialogueSystem (typewriter + botão Monitor Fantasma)
      └─ isPuzzleActive → SpectralTerminal (template + input)
          ├─ onSolve → handlePuzzleSolve → nextNode / transitionToPhase
          ├─ onFail → handlePuzzleFail → taunt (4s)
          └─ hintsUsed < 3 → Botão Monitor → handleRequestHint
```

### 4.3 Transição de Fase
```
nextNodeId === 'phase2_intro' → transitionToPhase(2)
  → setCurrentPhaseId(2)
  → setCurrentNodeId(PHASE_CONFIG[2].startNodeId)
  → setCompletedPhases([...prev, 1])
  → checkAndUnlockEntry(startNodeId)
```

### 4.4 Desbloqueio do Compêndio
```
checkAndUnlockEntry(nodeId)
  → LEGACY_COMPENDIUM_DATABASE.find(e => e.unlockedAtNode === nodeId)
  → unlockEntry(entry.id) → setUnlockedEntryIds([...prev, entry.id])
```

---

## 5. Guia de Criação de Entidades (Novos Espectros/Fases)

### 5.1 Adicionar Nova Fase
1. Edite `src/types/game.ts`: adicione ao `PhaseId` e `GhostId`.
2. Edite `PHASE_CONFIG` em `page.tsx` e `campaign.json` com novo `startNodeId`.
3. Adicione sprites em `public/sprites/` (helena.jpg, valdemar.jpg, cleiton.jpg, professor.jpg, monitor.jpg).
4. Atualize `GhostBust.tsx` com nova lógica de seleção.
5. Adicione entradas em `LEGACY_COMPENDIUM_DATABASE` (3 por fase).

### 5.2 Adicionar Novo Minijogo (Nó)
1. Crie nó em `campaign.json` seguindo `DialogNode`.
2. `puzzleType`: novo ou existente (`html`|`logic`|`python`|`sql`|`infra`).
3. `codeTemplate`: string com `_____` marcando a lacuna.
4. `expectedAnswers`: array de variações aceitas (ex: `["for", "for "]`).
5. `socraticHints`: tupla de 3 strings `[conceito, estrutura, sintaxe]`.
6. `analogyTitle` + `analogyText`: analogia didática.
7. Adicione entrada correspondente em `LEGACY_COMPENDIUM_DATABASE` com mesmo `unlockedAtNode`.

### 5.3 Novo Tipo de Puzzle
1. Adicione ao `PuzzleType` em `types/game.ts`.
2. Atualize `getLanguageLabel()` em `SpectralTerminal.tsx`.
3. Crie lógica de validação específica se necessário (hoje tudo é string match).

---

## 6. Guia de Novos Enigmas (Contrato Obrigatório)

Todo puzzle **deve** respeitar:

```json
{
  "id": "puzzle_X_Y_tipo",
  "phaseId": 1,
  "sectorName": "Setor 1: Laboratório de Desenvolvimento",
  "speaker": "Nome do Espectro",
  "text": "Diálogo introdutório com a lacuna visível: [ código _____ ]",
  "puzzleType": "html|logic|python|sql|infra",
  "analogyTitle": "💡 Analogia do X",
  "analogyText": "Explicação cotidiana do conceito...",
  "codeTemplate": "[ código _____ ]",
  "expectedAnswer": ["resposta", "resposta "],
  "socraticHints": [
    "Dica 1: Conceito/Analogia reconectada ao cotidiano.",
    "Dica 2: Estrutura — onde a palavra se encaixa no código.",
    "Dica 3: Sintaxe — quase a resposta (ex: 'A resposta é: for')."
  ],
  "tauntOnFail": "Provocação temática que reforça a lição.",
  "nextNodeOnSuccess": "proximo_no_id"
}
```

**Validações automáticas (dev):**
- `expectedAnswer` não vazio para `puzzleType !== 'none'`.
- `socraticHints` array de exatamente 3 strings.
- `codeTemplate` contém exatamente um `_____`.
- `nextNodeOnSuccess` aponta para nó existente.

---

## 7. Dicionário de Flags (Variáveis de Controle de Fluxo)

| Flag / Estado | Tipo | Descrição | Onde Usado |
|---------------|------|-----------|------------|
| `currentPhaseId` | 1\|2\|3 | Fase ativa | GameEngine, HUD, Compêndio |
| `currentNodeId` | string | Nó atual na árvore | GameEngine, DialogueSystem |
| `completedPhases` | PhaseId[] | Fases finalizadas (1,2,3) | GameEngine, HUD, Persistência |
| `unlockedEntryIds` | string[] | IDs do compêndio desbloqueados | GameEngine, LegacyCompendium |
| `inventory` | string[] | Itens coletados (chaves, crachá, disquete) | GameEngine, LegacyCompendium, HUD |
| `hintsUsed` | 0..3 | Dicas usadas no enigma atual | DialogueSystem, GameEngine |
| `tauntMessage` | string|null | Provocação temporária (4s) | GameEngine, SpectralTerminal |
| `soundEnabled` | boolean | Áudio ligado/desligado | GameEngine, AudioService, DialogueSystem |
| `crtEnabled` | boolean | Overlay CRT ligado/desligado | GameEngine, CSS |
| `mounted` | boolean | Hidratação client-side completa | GameEngine (evita mismatch SSR) |

---

## 8. Padrões de Expansão e Manutenção

### 8.1 Adicionar Nova Fase sem Quebrar Existentes
- `campaign.json` é **append-only** para fases anteriores.
- `PHASE_CONFIG` em `page.tsx` é a única fonte de verdade para navegação.
- `LEGACY_COMPENDIUM_DATABASE` em `LegacyCompendium.tsx` é a única fonte para cards.

### 8.2 Modificar Enigma Existente
- Edite apenas o nó em `campaign.json`.
- Se mudar `expectedAnswer`, atualize `socraticHints[2]` (dica de sintaxe).
- Se mudar `puzzleType`, atualize `getLanguageLabel()` no Terminal.

### 8.3 Testes de Regressão Manual (Checklist)
- [ ] Fase 1 completa → transição para Fase 2.
- [ ] Fase 2 completa → transição para Fase 3.
- [ ] Fase 3 completa → tela de vitória.
- [ ] Reset limpa tudo e volta ao onboarding.
- [ ] Persistência: recarregar página mantém fase/nó/compêndio/inventário.
- [ ] Dicas socráticas: 1→2→3 funcionam, botão some após 3.
- [ ] Feedback: vazio / quase / errado / correto exibem mensagens corretas.
- [ ] Taunt aparece e some em 4s.
- [ ] Compêndio mostra analogia ativa do enigma atual.
- [ ] Sprites corretos para cada falante.

---

## 9. Decisões Técnicas Registradas

| Decisão | Justificativa |
|---------|---------------|
| **campaign.json único** vs múltiplos arquivos | Simplicidade de deploy, busca global, versionamento atômico. |
| **localStorage** vs IndexedDB/Context | MVP, dados pequenos (<5KB), API síncrona simples. |
| **Web Audio API** vs Howler.js | Zero dependências, controle total, tamanho mínimo. |
| **Fill-in-the-blanks** vs digitação livre | Foco no conceito, evita frustração de sintaxe, validação determinística. |
| **3 dicas socráticas fixas** vs livres | Garante progressão pedagógica consistente, evita "dica mastigada" na 1ª. |
| **TypeScript estrito + zero `any`** | Erros de estrutura em tempo de compilação, refatoração segura. |
| **Componentes puros + callbacks** | Testabilidade, isolamento, substituição fácil (ex: trocar Terminal). |
| **Nomenclatura blindada** (LegacyCompendium, SpectralTerminal) | Conformidade com Regulamento e Manual Anti-Plágio (sem marcas de terceiros). |

---

## 10. Assets Necessários

| Arquivo | Uso | Especificação |
|---------|-----|---------------|
| `/sprites/helena.jpg` | Profª. Helena Vilar | 512x512, retrato, estilo CRT verde |
| `/sprites/valdemar.jpg` | Prof. Valdemar | 512x512, retrato, estilo CRT esmeralda |
| `/sprites/cleiton.jpg` | Téc. Cleiton | 512x512, retrato, estilo CRT âmbar/laranja |
| `/sprites/professor.jpg` | Sistema/Alfredo | 512x512, genérico autoridade |
| `/sprites/monitor.jpg` | Monitor Fantasma | 512x512, estudante/ajudante |

> **Nota:** Imagens referenciadas com `?v=2` no `GhostBust` para cache-busting. `next.config.mjs` deve ter `images: { unoptimized: true }` para desenvolvimento local.

---

*Fim do ARCHITECTURE.md — Mantenha este documento atualizado a cada merge.*