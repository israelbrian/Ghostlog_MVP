# Ghost.log — O Terminal Assombrado (MVP)

Ghost.log é um MVP (Minimum Viable Product) de um jogo web **point-and-click investigativo educacional**. O jogador assume o papel de um estagiário de TI no turno da madrugada que precisa "apaziguar espectros acadêmicos" (professores e técnicos falecidos) resolvendo problemas de programação, banco de dados e infraestrutura.

Transforma o aprendizado de fundamentos de computação (HTML, variáveis, Python, SQL, comandos de terminal) em uma experiência narrativa imersiva, combinando mecânicas de Visual Novel com a interface de um terminal hacker retrô.

---

## 🎯 Objetivo do Projeto

- **Ensino ativo por analogia:** Cada conceito técnico é introduzido via analogia do cotidiano (sanduíche, caixa etiquetada, chamada escolar, cardápio, catraca, corretivo, sonar, maçaneta, disjuntor).
- **Fill-in-the-blanks:** Desafios de preenchimento de lacuna única (`_____`) — foco no raciocínio, não na digitação.
- **Dicas socráticas:** 3 níveis progressivos sob demanda (Conceito → Estrutura → Sintaxe).
- **Narrativa cômica de terror leve:** 3 fases, 3 espectros, 9 minijogos, final recompensador.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 14+ (App Router)
- **Biblioteca UI:** React 19
- **Linguagem:** TypeScript (estrito, zero `any`)
- **Estilização:** Tailwind CSS v4 (com `@tailwindcss/postcss`)
- **Fontes:** Google Fonts (Inter para UI, Fira Code para Terminal) via `next/font`
- **Áudio:** Web Audio API nativa (oscillators 8-bit — sem dependências externas)
- **Persistência:** localStorage (fase, progresso, compêndio, inventário)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18.17 ou superior)
- NPM (ou Yarn, pnpm, bun)

### Instalação e Execução

```bash
# 1. Acesse o diretório do projeto
cd Ghostlog_MVP

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
# http://localhost:3000
```

---

## 🏗️ Estrutura Arquitetural

```
src/
├── app/
│   └── page.tsx              # GameEngine principal (estado, fluxo, persistência)
├── components/
│   ├── DialogueSystem.tsx    # Visual Novel: typewriter, avatar, dicas socráticas
│   ├── SpectralTerminal.tsx  # Terminal: template _____, validação, feedback
│   ├── LegacyCompendium.tsx  # Compêndio: analogias, cards, inventário
│   ├── GhostBust.tsx         # Avatar 2D: 5 personagens + animações
│   └── GameHeader.tsx        # HUD: fase, progresso, toggles Som/CRT/Reset
├── content/
│   └── campaign.json         # Campanha completa (3 fases × 3 minijogos = 9 puzzles)
├── types/
│   └── game.ts               # Contratos TypeScript (DialogNode, PhaseConfig, etc.)
├── utils/
│   └── sanitizer.ts          # Sanitização + validação + feedback educativo
└── services/
    └── audio.ts              # Web Audio API (blips, chime, buzz)
```

**Princípios:**
- **Data-Driven:** Toda campanha vive em JSON; engine é genérica.
- **Baixo acoplamento:** Componentes não se conhecem; comunicam-se via props/callbacks.
- **Tipagem estrita:** Interfaces para cada entidade; zero `any`.
- **Estado previsível:** `useState` + `localStorage` sincronizado; efêmeros ficam no componente.

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| **GDD.md** | Game Design Document completo (Premissa, Gênero, Mecânicas, Campanha, Referências) |
| **ARCHITECTURE.md** | Arquitetura técnica, dicionário de componentes, fluxo de dados, padrões de expansão |
| **FUTURE_IMPROVEMENTS.md** | Roadmap: arte 2D, puzzles interpretativos, modo professor, acessibilidade avançada |

---

## 🎮 Como Jogar

1. **Leia o diálogo** (clique para avançar / pular typewriter).
2. **No enigma:** Observe o template com `_____` e a **Analogia de Bolso** no Compêndio (canto inferior direito).
3. **Digite a palavra-chave** que falta no Terminal Espectral e pressione **Executar**.
4. **Errou?** O Espectro zomba (taunt). Peça dica ao **Monitor Fantasma** (👨‍🎓) — 3 níveis: Conceito → Estrutura → Sintaxe.
4. **Acertou?** Avança automaticamente. Compêndio desbloqueia a entrada correspondente.
5. **Complete os 3 minijogos da fase** → Espectro apaziguado → Item no inventário → Próximo setor.
6. **Zere as 3 fases** → Tela de vitória com resumo de conquistas.

---

## 🔒 Segurança e Boas Práticas

- **Zero execução de código do jogador:** Validação *whitelist-only* contra respostas esperadas. Sanitização rigorosa (`trim`, `lowerCase`, collapse espaços). Sem `eval`, `Function`, `vm`, `exec`.
- **Feedback educativo:** Distância de Levenshtein simplificada detecta "quase acertos" e orienta.
- **Hidratação SSR segura:** Loading screen evita mismatch de `localStorage`.
- **Acessibilidade:** Contraste AA, navegação por teclado, `prefers-reduced-motion`.

---

## 📦 Build de Produção

```bash
npm run build
npm start
```

---

## 📄 Licença

Projeto acadêmico / MVP educacional. Uso livre para fins de estudo e portfólio.