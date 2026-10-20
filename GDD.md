# GDD — Ghost.log: O Terminal Assombrado

**Projeto:** Ghost.log — O Terminal Assombrado (MVP)  
**Plataforma:** Web (React/Next.js/Tailwind CSS) e Mobile (Responsivo)  
**Gênero:** Point & Click Investigativo + Visual Novel Cômica e Educacional  
**Estética:** Sombria, tons de esmeralda/verde-fósforo (monitores CRT) e preto. Laboratórios escuros iluminados apenas pela luz de monitores antigos.

---

## 1. Premissa

Você é o estagiário azarado que pegou o turno da madrugada no suporte de TI da faculdade. Após um apagão geral, os laboratórios são tomados por **Espectros Acadêmicos** — professores e técnicos que morreram de formas trágicas e ridículas ligadas a falhas de tecnologia. Para sobreviver à noite e fazê-los descansar em paz, você deve resolver seus "últimos desejos" usando lógica de programação, banco de dados e comandos de infraestrutura, atuando como um **Exorcista de TI**.

O jogo transforma fundamentos de computação em uma experiência narrativa imersiva: cada enigma é uma lacuna (_ fill-in-the-blanks _) no código, precedida por uma **analogia do cotidiano** que ensina o conceito antes de cobrar a sintaxe.

---

## 2. Gênero

**Point & Click Investigativo + Visual Novel Cômica e Educacional**

- **Exploração narrativa:** Diálogos com personagens (Espectros, Sistema, Monitor Fantasma) via caixas de texto estilo máquina de escrever.
- **Resolução de enigmas:** Terminal Espectral com desafios *fill-in-the-blanks* (preenchimento de lacuna única).
- **Progressão por fases:** 3 Setores da Faculdade → 3 Espectros → 9 Minijogos no total.
- **Tom:** Cômico, caricato, misterioso. Referências ao cotidiano universitário e de TI (café ruim, TCC atrasado, cabo de rede solto, DELETE sem WHERE).

---

## 3. Mecânicas-Core e Metodologia Pedagógica

### 3.1 Terminal Espectral (<SpectralTerminal />)
- Interface de terminal retrô (fundo esverdeado/preto, fonte monoespaçada).
- **Fill-in-the-blanks:** O código aparece quase completo com uma lacuna `_____`. O jogador digita apenas **1 palavra-chave**.
- **Sanitização estrita:** `.trim().toLowerCase()` + remoção de espaços extras. Validação contra *whitelist* de respostas esperadas (sem `eval`, sem execução de código).
- **Feedback educativo granular:**
  - Vazio → "Digite algo!"
  - Próximo (Levenshtein/substring) → "Quase! Você digitou X, esperado Y."
  - Errado → "Comando não reconhecido. Consulte o Compêndio ou peça dica."

### 3.2 Compêndio do Código Legado (<LegacyCompendium />)
- **Guia Prévio Ativo:** Não é recompensa — é consulta *antes* e *durante* o enigma.
- **Analogia de Bolso:** Cada card mostra a analogia do desafio atual (ex: "Sanduíche" para tags HTML, "Catraca" para WHERE).
- **Explicação técnica curta:** Definição concisa + snippet de código copiável.
- **Progressivo:** Entradas desbloqueadas ao resolver cada minijogo.

### 3.3 Monitor Fantasma — Dicas Socráticas (3 Níveis)
Botão "Pedir Dica ao Monitor (X/3)" revela progressivamente:
1. **Conceito/Analogia:** Reconecta com a analogia do cotidiano.
2. **Estrutura:** Onde a palavra-chave se encaixa no código.
3. **Sintaxe:** Quase a resposta completa (ex: "A resposta é: `for`").

### 3.4 Sistema de Taunt
Ao errar, o Espectro zomba com frase temática que reforça a lição (ex: "Sem WHERE você apaga a pauta inteira!").

### 3.5 Persistência e Acessibilidade
- **localStorage:** Fase, nó, compêndio, inventário, fases concluídas.
- **Hidratação segura:** Loading screen evita mismatch SSR/client.
- **Responsivo:** Mobile-first, touch-friendly.

---

## 4. Estrutura da Campanha — 3 Fases × 3 Minijogos

| Fase | Setor | Espectro | Tema | Minijogos (Analogia → Lacuna) |
|------|-------|----------|------|-------------------------------|
| **1** | **Laboratório de Desenvolvimento** (Front/Back) | **Profª. Helena Vilar** (exausta na véspera do TCC) | HTML / Lógica / Python | 1.1 `</body>` (Sanduíche) • 1.2 `=` (Caixa Etiquetada) • 1.3 `for` (Chamada Escolar) |
| **2** | **Cofre de Dados Acadêmicos** (SQL) | **Prof. Valdemar** (infartou em 99 após `DELETE` sem WHERE) | SQL | 2.1 `SELECT` (Cardápio) • 2.2 `WHERE` (Catraca) • 2.3 `UPDATE` (Corretivo) |
| **3** | **Subsolo de Suporte e Infraestrutura** | **Téc. Cleiton** (tropeçou no cabo do rack no apagão) | Infra/Terminal | 3.1 `ping` (Sonar) • 3.2 `cd` (Maçaneta) • 3.3 `kill` (Disjuntor) |

### Fluxo por Fase
1. **Onboarding** (só na Fase 1): Sistema explica mecânicas.
2. **Alerta de Sistema:** Modal vermelho apresenta o Espectro, causa mortis e corrupção.
3. **Analogia de Bolso:** Exibida no modal e no Compêndio.
4. **Minijogo 1 → 2 → 3:** Cada um com lacuna, dicas socráticas, taunt.
5. **Desfecho da Fase:** Espectro apaziguado → item no inventário → transição ("⚡ PRÓXIMO SETOR").
6. **Vitória Final:** Tela de parabéns listando todas as conquistas.

---

## 5. Referências Estéticas, Técnicas e Conceituais do Protótipo

> **Nota:** Esta seção atende ao item 6.3.a do Regulamento (Premissa, Gênero, Mecânicas-Core, **Referências**). Não citam-se marcas, franquias ou jogos comerciais de terceiros.

### Estéticas Visuais
- **Monitores CRT de fósforo verde/âmbar (anos 1980–90):** Scanlines, curvatura sutil, brilho difuso, "burn-in" sutil. Paleta: `#00ff88` (esmeralda), `#ffaa00` (âmbar), `#0a0a0a` (preto profundo).
- **Interfaces de linha de comando clássicas:** `user@host:~$`, cursor piscante, saída monoespaçada.
- **Visual Novel minimalista:** Caixa de diálogo com glassmorphism, avatar flutuante com halo, máquina de escrever letra a letra.

### Referências de Design de Interação
- **Aventuras de texto via terminal (CLI):** Parser de linguagem natural simplificado → adaptado para *fill-in-the-blanks* de palavra única.
- **Método maiêutico/socrático gamificado:** Dicas progressivas que induzem o raciocínio, não dão a resposta.
- **Aprendizado baseado em analogias cotidianas:** Cada conceito técnico mapeado a objeto/ação familiar (sanduíche, caixa, chamada, cardápio, catraca, corretivo, sonar, maçaneta, disjuntor).

### Arquitetura de Software (Data-Driven)
- **Engine genérica:** `GameEngine` lê `campaign.json` e renderiza fases/nós dinamicamente.
- **Componentes isolados:** `DialogueSystem`, `SpectralTerminal`, `LegacyCompendium`, `GhostBust`, `GameHeader` — cada um com responsabilidade única, comunicam-se via props/callbacks.
- **Tipagem estrita (TypeScript):** Interfaces para `DialogNode`, `PhaseConfig`, `LegacyCompendiumEntry`, `GameState`. Zero `any`.
- **Estado global previsível:** `useState` + `localStorage` sincronizado. Estados efêmeros (input do terminal, texto digitando) ficam no componente.
- **Sem dependências de áudio externas:** Web Audio API nativa (oscillators para blips 8-bit, chimes, buzz).

### Acessibilidade e Qualidade
- **Contraste WCAG AA:** Verde-esmeralda sobre preto, âmbar sobre escuro.
- **Navegação por teclado:** `Tab` no terminal, `Enter` para enviar, clique na caixa de diálogo para avançar.
- **Redução de movimento:** Animações CSS respeitam `prefers-reduced-motion`.
- **Sem execução de código do usuário:** Whitelist-only, sanitização, sem `eval`/`Function`/`vm`.

---

## Checklist Técnico (MVP)

- [x] 3 Fases / 3 Espectros / 9 Minijogos implementados em `campaign.json`
- [x] Engine multi-fase com transição automática e persistência
- [x] Terminal Espectral com template visual `_____` e feedback granular
- [x] Compêndio do Código Legado com Analogia de Bolso ativa
- [x] Monitor Fantasma com 3 dicas socráticas por enigma
- [x] Taunts temáticos por Espectro
- [x] GhostBust com 3 avatares (Helena, Valdemar, Cleiton) + Sistema + Monitor
- [x] HUD com fase, enigma atual, progresso de fases, toggles Som/CRT/Reset
- [x] Web Audio API nativa (blips, chime, buzz)
- [x] Tipagem TypeScript estrita em todos os contratos
- [x] Build Next.js 14+ (App Router) + Tailwind CSS v4
- [x] Documentação blindada (GDD, README, ARCHITECTURE) sem marcas de terceiros