GDD MVP: Projeto "Ghost.log" (Terminal Assombrado)b
Plataforma: Web (React/Next.js/Tailwindcss) e Mobile (Responsivo).
Gênero: Point & Click Investigativo + Visual Novel Cômica.
Estética: Sombria, tons de roxo, verde-esmeralda (fantasmas) e preto. Laboratórios escuros iluminados apenas pela luz de monitores CRT antigos.
1. Premissa do MVP
Você é o aluno azarado que pegou o turno da madrugada no suporte de TI da faculdade. Após um apagão, os laboratórios são tomados por "Espectros Acadêmicos" — professores que morreram de formas trágicas e ridículas. Para sobreviver à noite e fazê-los descansar em paz, você precisa resolver seus últimos desejos usando lógica de programação e banco de dados, atuando como um "Exorcista de TI".
2. Adaptação das Mecânicas (O "Reskin")
As mecânicas do Estagiário.exe foram mantidas, mas a roupagem foi alterada para o novo tema:
O Necronomicon de TI (Antigo Caderninho): Em vez de um bloco de notas, é um grimório amaldiçoado no HUD. Ele registra os "feitiços" aprendidos (comandos SQL, loops em Python, tags HTML) que funcionam como dicas.
O Tabuleiro Ouija (Antigo Terminal): Um terminal esverdeado e macabro onde o jogador digita os trechos de código (inputs) para interagir com o além.
A Sessão Espírita (Sistema de Dicas): Errou o código 3 vezes? Em vez de ligar para o chefe, você invoca o fantasma de um monitor de turma falecido que te xinga comicamente e explica a lógica por trás do enigma.
3. A Jornada do Jogador no MVP (O Caso do Prof. Valdemar)
Este MVP foca em resolver o mistério de um único fantasma para validar o código e a jogabilidade.
O Fantasma: Professor Valdemar.
Causa mortis: Infarto fulminante em 1999 após esquecer de colocar a cláusula WHERE em um DELETE FROM, apagando todo o banco de dados da reitoria.
A Maldição: Ele assombra a sala dos servidores porque perdeu o registro da nota do seu aluno favorito e não pode ir para o céu até encontrá-la.
Passo a Passo da Gameplay:
Introdução: O jogador clica no laboratório escuro. A tela treme (Framer Motion) e o fantasma de Valdemar aparece flutuando, resmungando sobre tabelas corrompidas. Textos rolam na tela (Visual Novel).
Quebra-Cabeça 1 (HTML - O Selamento): O laboratório está um caos poltergeist. Para acalmar a sala e acessar o servidor, o jogador clica em uma porta espiritual aberta. No Terminal Ouija, ele precisa selar a entidade digitando o fechamento de uma tag HTML básica: </door> ou </body>. O grimório é atualizado.
Quebra-Cabeça 2 (Python - O Desespero do Loop): Para ligar a energia do servidor principal, é necessário gerar a antiga tabuada de senhas do Valdemar. O Terminal mostra um script em Python travado. O jogador precisa preencher o while ou o for corretamente para que a repetição de 1 a 10 aconteça sem criar um loop infinito.
Batalha Final (SQL - A Redenção): Com o servidor ligado, o jogador precisa achar a nota do aluno de 1998. O fantasma implora para você não esquecer o filtro. O jogador digita no Terminal: SELECT nota FROM historico WHERE aluno = 'Roberto' AND ano = 1998;.
Desfecho: Valdemar chora lágrimas de ectoplasma, agradece, e desaparece em uma luz azul. O jogador ganha o item "Disquete da Paz". Fim do MVP.
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
