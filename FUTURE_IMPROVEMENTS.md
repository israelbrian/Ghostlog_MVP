# FUTURE_IMPROVEMENTS.md — Roadmap Pós-MVP

> Ideias documentadas para evolução do Ghost.log após a entrega do MVP.  
> Priorizadas por impacto pedagógico, viabilidade técnica e aderência ao regulamento.

---

## 1. Evolução Pedagógica (Alto Impacto)

### 1.1 Puzzles Interpretativos (Além do Fill-in-the-Blanks)
- **Múltiplas lacunas:** `[ SELECT _____ FROM _____ WHERE _____ ]` — ensina estrutura completa.
- **Ordenação de blocos:** Drag-and-drop de linhas de código para montar a query/loop.
- **Debugging reverso:** Código com bug intencional → jogador identifica e corrige a linha.
- **Refatoração guiada:** "Melhore este código usando o que aprendeu" (ex: trocar `while` por `for`).

### 1.2 Modo Professor / Sala de Aula
- **Dashboard do docente:** Cria campanhas customizadas (JSON visual), define analogias próprias.
- **Relatórios de turma:** % acerto por conceito, tempo médio, dicas usadas, tentativas.
- **Integração LTI/LMS:** Embed em Moodle, Canvas, Google Classroom.
- **Modo "Prova":** Desativa dicas, embaralha ordem, cronômetro.

### 1.3 Trilhas de Aprendizado Adaptativo
- **Diagnóstico inicial:** 5 perguntas → define nível (Iniciante/Intermediário/Avançado).
- **Ramo condicional:** Se acerta 1.1 e 1.2 → pula para 1.3 avançado; se erra → insere revisão extra.
- **Espaçamento (Spaced Repetition):** Revisão de conceitos anteriores em fases posteriores (ex: `WHERE` reaparece no `UPDATE`).

---

## 2. Expansão de Conteúdo (Médio Impacto)

### 2.2 Novas Fases/Temas
| Fase | Setor | Espectro | Conceitos |
|------|-------|----------|-----------|
| 4 | **DevOps / CI-CD** | Eng. Roberta (morreu de exaustão deployando sexta 18h) | `git`, `docker`, `yaml`, pipelines |
| 5 | **Segurança da Informação** | Analista Klaus (phishing no café) | Hash, salt, prepared statements, CSP, CORS |
| 6 | **Cloud / Arquitetura** | Arquiteta Nina (loop infinito de auto-scaling) | LB, cache, queue, microserviços, observabilidade |

### 2.3 Mini-Jogos de "Pausa" (Easter Eggs)
- **Terminal Retrô:** `snake`, `pong`, `2048` no terminal (desbloqueáveis no Compêndio).
- **Crypto-miner ocioso:** "Mine bits de conhecimento" enquanto lê o Compêndio.
- **Quiz Relâmpago:** 30s, 5 perguntas, leaderboard local.

---

## 3. Experiência do Usuário / Acessibilidade (Alto Impacto)

### 3.1 Acessibilidade Avançada
- **Leitor de tela completo:** `aria-live` no typewriter, labels no terminal, navegação por setas no Compêndio.
- **Modo Alto Contraste:** Toggle independente do CRT (preto/amarelo, branco/preto).
- **Dyslexia-friendly:** Fonte OpenDyslexic opcional, espaçamento ajustável.
- **Motor/Visual:** Input por voz (Web Speech API), controle por gamepad, auto-advance opcional.

### 3.2 Internacionalização (i18n)
- **Estrutura:** `campaign.{locale}.json` + `dictionary.{locale}.json` para UI.
- **Locales alvo:** `pt-BR`, `en-US`, `es-ES`, `fr-FR`.
- **Analogias localizadas:** "Sanduíche" → "Hamburger" (US) / "Bocadillo" (ES) — mantém pedagogia cultural.

### 3.3 Mobile-First Refinado
- **Teclado virtual contextual:** Mostra só teclas relevantes (ex: `</>`, `=`, `;`, `WHERE`, `SELECT`).
- **Gestos:** Swipe para avançar diálogo, long-press para dica, shake para reset.
- **PWA:** `manifest.json`, Service Worker offline, instalação "Add to Home Screen".

---

## 4. Polimento Audiovisual (Médio Impacto)

### 4.1 Arte 2D Substituindo Placeholders
- **Sprites animados (Spine/Rive):** Idle, talking, taunt, happy (apaziguado).
- **Backgrounds por setor:** Laboratório (monitores, código na parede), Cofre (racks, fitas magnéticas), Subsolo (cabos, disjuntores, luz de emergência).
- **Transições de cena:** Fade + glitch effect entre fases.

### 4.2 Áudio Imersivo
- **BGM adaptativa por fase:** Camadas (base + tensão + resolução) crossfadeadas.
- **SFX contextuais:** Teclado mecânico (cherry mx blue), zumbido de cooler, bip de POST, som de "arquivo salvo".
- **Voice acting (opcional):** Linhas-chave dos Espectros (PT-BR/EN).

### 4.3 Efeitos Visuais
- **Partículas:** "Bits" flutuando ao acertar, "static" ao errar.
- **Shader CRT avançado:** Curvatura, vignette, scanlines animadas, chromatic aberration sutil.
- **Glitch transitions:** RGB shift + noise ao transicionar fase / taunt.

---

## 5. Engenharia e Arquitetura (Baixo Impacto Imediato, Alto Longo Prazo)

### 5.1 Estado Global Robusto
- **Zustand/Jotai** para estado global tipado + persistência seletiva + DevTools.
- **Sagas/Effects** para side-effects (áudio, persistência, analytics) fora dos componentes.

### 5.2 Testes Automatizados
- **Unit (Vitest):** `sanitizer.ts`, `validateAnswer`, `transitionToPhase`, `checkAndUnlockEntry`.
- **Integration (React Testing Library):** Fluxo completo Fase 1 → Vitória.
- **E2E (Playwright):** Happy path, persistência reload, acessibilidade (axe-core).
- **Visual Regression (Chromatic):** Snapshots de Terminal, Compêndio, Modais.

### 5.3 CI/CD e Qualidade
- **GitHub Actions:** `lint` → `typecheck` → `test` → `build` → `deploy preview (Vercel)`.
- **Husky + lint-staged:** Pre-commit `eslint --fix`, `prettier`, `tsc --noEmit`.
- **Bundle Analyzer:** Monitorar `next/bundle-analyzer` — meta < 150kb JS gzipped.

### 5.4 Analytics Éticos (Opt-in)
- **Eventos anônimos:** `puzzle_started`, `puzzle_solved`, `hint_used`, `taunt_triggered`, `phase_completed`.
- **Dashboard interno:** Funil de conversão por enigma, gargalos pedagógicos.
- **LGPD/GDPR ready:** Sem PII, consentimento claro, exclusão sob demanda.

---

## 6. Gamificação e Retenção (Baixo Impacto Pedagógico Direto)

### 6.1 Sistema de Conquistas (Achievements)
- **"Primeiro Sangue"**: Primeiro enigma resolvido.
- **"Sem Dicas"**: Fase completa sem usar Monitor.
- **"Velocista"**: Fase 1 em < 3 min.
- **"Arqueólogo"**: Lê todas as analogias do Compêndio.
- **"Exorcista Supremo"**: Zera o jogo 3 vezes.

### 6.2 New Game+ / Modos Extras
- **Modo "Hardcore":** 1 vida, sem dicas, taunts instantâneos.
- **Modo "Speedrun":** Cronômetro global, leaderboard local (IndexedDB).
- **Gerador de Campanhas:** Editor visual (JSON → UI) para comunidade criar fases.

---

## 7. Priorização Sugerida (Próximos 3 Meses)

| Sprint | Foco | Entregáveis |
|--------|------|-------------|
| 1 | **Acessibilidade + i18n** | Alto contraste, dyslexia font, `pt-BR`/`en-US`, PWA básico |
| 2 | **Puzzles Avançados** | Múltiplas lacunas, ordenação, debugging reverso (1 por fase) |
| 3 | **Arte + Áudio** | Sprites animados, backgrounds, BGM adaptativa, SFX contextuais |
| 4 | **Modo Professor** | Editor JSON visual, relatório de turma, embed LTI |
| 5 | **Expansão** | Fases 4-6 (DevOps, Seg, Cloud) + Nova Game+ |

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Scope creep no MVP | Alta | Atraso entrega | Freeze de features 2 semanas antes do deadline; backlog priorizado no GitHub Projects. |
| Analogias não ressoam | Média | Baixo aprendizado | Teste com 5 usuários-alvo (estudantes TI) antes do freeze; A/B no texto. |
| Performance mobile | Baixa | Crítico | `next/image` otimizado, `unoptimized` só dev, lazy-load Compêndio, code-splitting por fase. |
| Dependência de assets artísticos | Média | Atraso visual | Placeholders programáticos (CSS shapes) prontos; arte entra como overlay opcional. |
| Conformidade regulamento | Baixa | Desclassificação | Checklist semanal: marcas terceiros, seção Referências, nomenclatura blindada. |

---

*Documento vivo — Atualize a cada sprint review.*