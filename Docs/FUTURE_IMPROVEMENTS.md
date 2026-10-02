# Plano de Melhorias Futuras (Aprendizagem, Didática e Imersão)

Este documento detalha o plano de ação para lapidar a experiência do MVP do Ghost.log, transformando-o de um simples jogo de "perguntas e respostas com cópia" para uma ferramenta educacional interativa, envolta em uma atmosfera de terror e mistério.

---

## 1. Visão Geral da Nova Estrutura

**O Paradigma Atual:** As perguntas já possuem a resposta linkada. Se o jogador erra, o "Monitor Falecido" aparece automaticamente e dá a resposta exata, gerando um ciclo de memorização rasa.
**O Novo Paradigma:** A estrutura deve ser mais dinâmica e educativa. O jogador precisa sentir que está aprendendo e investigando ativamente, imerso em uma sensação de urgência e suspense (estética de terror e mistério).

---

## 2. Onboarding: O Novo Componente de Introdução

Para criar a atmosfera correta, o jogo iniciará com um fluxo de introdução dividido em etapas narrativas:

- **Etapa 1 (Contextualização):** Apresentação do cenário. O jogador é informado de que é um estagiário de TI trabalhando no turno da noite e descobre que o sistema da faculdade está sendo assombrado por espectros de professores falecidos.
- **Etapa 2 (Mecânicas):** Explicação do funcionamento da interface ("máquina"):
  - Apresentação do **Necronomicon**: Onde todas as informações, regras básicas e anotações ficam guardadas para consulta.
  - Apresentação do **Sistema de Dicas**: Como invocar o "Monitor Falecido" quando precisar de socorro.

---

## 3. Dinâmica das Fases e Enigmas

Cada fase (cada professor) terá um fluxo bem definido e focado no contexto do problema:

- **Contexto do Problema (Modal/Diálogo):** Antes de o puzzle iniciar, será exibida uma breve contextualização (ex: via modal ou caixa de diálogo destacada) explicando *por que* aquele professor específico está assombrando o sistema e *qual arquivo/função* ele corrompeu. 
- **O Desafio:** Em seguida, o fantasma do professor toma controle e lança o desafio.
- **Puzzles Interpretativos (Fill-in-the-blanks):** Em vez de digitar do zero de forma livre, o terminal mostrará códigos quebrados ou erros impressos (`SyntaxError`) e o jogador deve submeter a correção específica.

---

## 4. Necronomicon e Sistema de Dicas (Aprendizado Ativo)

O aprendizado não será mais entregue de bandeja. O jogador deverá buscar a resposta:

- **O Novo Necronomicon:** Deixa de ser um "inventário de recompensas" e passa a ser o **Guia Prévio** do jogador. Ele consultará suas anotações e regras estruturais das linguagens nele para descobrir como resolver o puzzle atual.
- **Botão de Dicas (Sob Demanda):** O Monitor Falecido não aparecerá mais sozinho. Existirá um botão de dica. O Monitor só aparece se o jogador ativamente pedir ajuda.
- **Feedback de Erro e Punição:** Ao errar o puzzle, o jogo exibe um alerta de erro do sistema e uma fala provocativa de Valdemar, instruindo o jogador a ler suas anotações no Necronomicon ou pedir dicas, instigando o aprendizado.
- **Dicas Socráticas:** Quando o Monitor Falecido for invocado, ele usará dicas graduais (1. Dica conceitual -> 2. Dica estrutural -> 3. Sintaxe) em vez de dar o código pronto.

---

## 5. Melhorias Técnicas e Visuais

- **Feedback de Sintaxe Granular (`sanitizer.ts`):** Expandir a validação para capturar erros específicos. Ex: Se a resposta de SQL precisa de `WHERE` e o jogador escreve `SELECT` certo mas esquece o filtro, o terminal avisa o erro exato ("Filtro ausente").
- **Substituição dos Emojis por Arte (Avatar 2D):** Atualizar o componente `GhostBust.tsx` para usar a tag `<Image />` do Next.js com artes `.png` dos professores, mantendo as animações de flutuação e brilho (flicker) para intensificar a atmosfera de terror.

