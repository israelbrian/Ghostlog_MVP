GDD MVP: Projeto "Ghost.log" (Terminal Assombrado)b
Plataforma: Web (React/Next.js/Tailwindcss) e Mobile (Responsivo).
Gênero: Point & Click Investigativo + Visual Novel Cômica.
Estética: Sombria, tons de roxo, verde-esmeralda (fantasmas) e preto. Laboratórios escuros iluminados apenas pela luz de monitores CRT antigos.
1. Premissa do MVP
Você é o aluno azarado que pegou o turno da madrugada no suporte de TI da faculdade. Após um apagão, os laboratórios são tomados por "Espectros Acadêmicos" — professores que morreram de formas trágicas e ridículas. Para sobreviver à noite e fazê-los descansar em paz, você precisa resolver seus últimos desejos usando lógica de programação e banco de dados, atuando como um "Exorcista de TI".
2. Adaptação das Mecânicas e Aprendizado Ativo (O "Reskin" Educacional)
As mecânicas do Estagiário.exe foram expandidas para focar em uma didática ativa, mantendo a roupagem de terror:
O Necronomicon de TI: Em vez de um bloco de notas de recompensa, é o **Guia Prévio**. O jogador recebe "páginas rasgadas" com teorias antes de enfrentar os enigmas e deve consultá-lo para sobreviver.
O Tabuleiro Ouija (Terminal): Um terminal esverdeado e macabro onde o jogador digita os trechos de código (inputs). Os desafios são baseados em *Fill-in-the-blanks* (Preenchimento de Lacunas) ao invés de digitação livre, focando no raciocínio estrutural.
O Botão de Dica (O Monitor Falecido): Um sistema de **dicas socráticas sob demanda**. Se o jogador ficar travado, ele pode invocar o Monitor Falecido (ícone 👨‍🎓) que lhe dará dicas progressivas, interceptando o diálogo principal, sem dar a resposta mastigada.
Sistema de Taunt: Ao errar o código, a tela pisca em vermelho e o Espectro Acadêmico (ícone 👻) zomba do jogador, forçando-o a ler o Necronomicon.

3. A Jornada do Jogador no MVP (O Caso do Prof. Valdemar)
O Fantasma: Professor Valdemar.
Causa mortis: Infarto fulminante em 1999 após rodar um DELETE sem WHERE.

Passo a Passo da Gameplay Atualizada:
Introdução (Onboarding): O jogador é contextualizado pelo Instrutor do Sistema (ícone 👨‍🏫) de que é o estagiário da madrugada e a faculdade está sendo assombrada. As mecânicas de Dicas e Necronomicon são explicadas.
Alerta de Sistema e Contexto: Antes de cada puzzle, um modal em vermelho e pulsante (ALERTA DE SISTEMA) explica *por que* aquele arquivo está corrompido, mergulhando o jogador na investigação de TI.
Quebra-Cabeça 1 (HTML - O Selamento): Valdemar assombra o front-end. O jogador deve preencher a lacuna `[ <html> ... _____ </html> ]` com `</body>` no Terminal Ouija.
Quebra-Cabeça 2 (Python - O Desespero do Loop): O servidor perdeu energia. O jogador deve iterar uma lista de geradores preenchendo a lacuna `[ _____ gerador in geradores: ]` com `for`.
Batalha Final (SQL - A Redenção): Valdemar não consegue encontrar a nota do aluno 'Roberto'. Ele grita para o estagiário não esquecer o filtro. O jogador preenche `[ SELECT nota FROM historico _______ aluno = 'Roberto' ]` com `where`.
Desfecho: Valdemar encontra a paz. O Sistema de Suporte parabeniza o jogador, que ganha o lendário "Disquete da Paz". Fim do MVP.
4. Checklist Técnico e Audiovisual (MVP)
Engenharia (React/Next.js):
Componente <OuijaTerminal/>: Deve aceitar inputs de texto, higienizar a entrada (.trim().toLowerCase()) e validar expressões como where e select.
Componente <Necronomicon/>: Estado global para armazenar e exibir dinamicamente os "feitiços" de código descobertos.
Componente <GhostDialog/>: Renderizador de texto estilo máquina de escrever (Typewriter).
Audiovisual (Howler.js e Assets):
Visuais: Fundo estático de um laboratório sombrio. O Professor Valdemar é apenas uma arte de meio-corpo translúcida (opacidade 70%) sobreposta no centro da tela.
BGM: Música ambiente tensa, como o vento uivando misturado com zumbido de servidor (estilo Silent Hill bem leve e cômico).
SFX: Em vez de teclados mecânicos normais, digitar no Terminal Ouija emite sons de pedra raspando ou ecos digitais. O "Voice Blip" do fantasma soa como um gemido agudo e rápido em 8-bits.

5. Arquitetura de Software e Diretrizes Técnicas (MVP e Escalabilidade)
Para garantir que o projeto não colapse conforme novas ideias, fantasmas e enigmas sejam adicionados após o MVP, o desenvolvimento seguirá uma arquitetura estrita de alta coesão e baixo acoplamento. Toda a estrutura será orientada a dados (Data-Driven Design) e altamente componentizada, garantindo máxima manutenabilidade.
5.1. Componentização Modular Absoluta Nenhum componente do jogo deve conhecer a lógica do outro. A interface deve ser "burra" e apenas reagir ao estado. O ecossistema em React/Next.js será dividido em blocos isolados:
SceneManager (Gerenciador de Atos/Salas): Responsável apenas por ler em qual sala o jogador está e carregar o fundo (bg_lab.jpg) e a música correspondente. Atualizar uma sala não pode, sob nenhuma hipótese, quebrar o estado do jogador.
DialogueSystem (Motor da Visual Novel): Um componente genérico que recebe como props um objeto contendo a string de texto, o nome do fantasma e a chave da emoção. Ele não sabe quem está falando, apenas renderiza.
PuzzleContainer (Fábrica de Enigmas): Os enigmas (HTML, Python, SQL) serão sub-componentes injetados dinamicamente. Se o enigma de SQL quebrar durante o desenvolvimento, o módulo do Terminal Ouija apenas renderiza um fallback de erro, sem derrubar (crashar) a aplicação inteira.
5.2. Separação Estrita de Conteúdo e Lógica Para que a dupla não-técnica da equipe possa trabalhar simultaneamente sem tocar no código-fonte em TypeScript, todo o roteiro e especificações das fases viverão fora dos componentes, em arquivos .json estruturados.
Roteiros (dialogues.json): A equipe de design altera os textos, dicas e invocações do Professor Valdemar diretamente no JSON. O motor do jogo apenas consome esse arquivo.
Configuração de Fase (levels.json): Define quais peças interativas existem em cada sala, quais coordenadas clicáveis e quais enigmas elas acionam.
5.3. Gerenciamento de Estado Previsível O jogo utilizará uma loja global (como Zustand ou Context API) dividida em fatias (slices) lógicas para evitar re-renderizações desnecessárias:
useGameState: Controla o macro (Ato atual, sala atual, flags de eventos como hasTalkedToValdemar).
usePlayerState: Controla o progresso do jogador (itens coletados no inventário, feitiços anotados no Necronomicon).
Nota de Manutenção: Estados efêmeros (como o texto que o jogador está digitando no terminal naquele exato segundo) devem ser mantidos localmente no próprio componente, nunca sujando o estado global.
5.4. Documentação Técnica e Padrões de Expansão Visando a sustentação do projeto, a dupla de engenharia deve manter um arquivo ARCHITECTURE.md no repositório. Nenhuma nova feature será mesclada (merge) sem que seu processo de criação esteja documentado. Este manual interno deve conter obrigatoriamente:
Guia de Criação de Entidades: Como adicionar um novo Fantasma no dialogues.json e registrar suas artes (bust-ups) no mapeamento de assets.
Guia de Novos Enigmas: O contrato (Interface em TypeScript) que todo novo puzzle deve respeitar. Exemplo: Todo puzzle deve obrigatoriamente emitir o evento onSolve(payload) ou onFail(payload) para se comunicar com o GameEngine.
Dicionário de Flags: Uma tabela com todas as variáveis booleanas que controlam o fluxo do jogo (ex: isServerPoweredOn = true), para que a equipe de design saiba quais gatilhos podem usar nos diálogos.
5.5. Tipagem Rigorosa e Prevenção de Erros O uso de TypeScript será mandatório. Não haverá uso de any. A tipagem estrita das interfaces de Personagens, Atos e Respostas Esperadas (no terminal) garantirá que erros estruturais sejam capturados em tempo de compilação pela IDE, muito antes de o código ir para a branch principal ou causar frustração no navegador do avaliador.
