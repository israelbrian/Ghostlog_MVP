# Ghost.log — O Terminal Assombrado (MVP)

Ghost.log é um MVP (Minimum Viable Product) de um jogo web *point-and-click* investigativo educacional. O jogador assume o papel de um estagiário de TI no turno da madrugada que precisa "exorcizar" espectros acadêmicos (professores falecidos) resolvendo problemas de programação, sintaxe e banco de dados.

## 🎯 Objetivo do Projeto
Transformar o aprendizado de fundamentos de programação (como laços de repetição em Python, queries SQL, e tags HTML) em uma experiência narrativa imersiva, combinando mecânicas de Visual Novel com a interface de um terminal hacker retrô.

## 🛠️ Tecnologias Utilizadas
- **Framework:** Next.js 14+ (App Router)
- **Biblioteca UI:** React 19
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 (com `@tailwindcss/postcss`)
- **Fontes:** Google Fonts (Inter para UI, Fira Code para o Terminal) via `next/font`
- **Áudio:** Web Audio API nativa (sons de 8-bits, sem dependências externas)

## 🚀 Como Executar Localmente

Siga os passos abaixo para rodar o projeto na sua máquina local de acordo com os padrões de mercado.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (Versão 18.17 ou superior recomendada)
- NPM (ou gerenciador de pacotes equivalente como Yarn, pnpm, bun)

### Instalação e Execução

1. **Clone o repositório ou acesse o diretório do projeto:**
   ```bash
   cd Ghostlog_MVP
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra `http://localhost:3000` para jogar o MVP.

## 🏗️ Estrutura Arquitetural
Para entender como os componentes se comunicam e onde cada lógica reside, consulte- Organização: Criada a pasta `docs/` e movidos os arquivos de arquitetura e planejamento para centralizar a documentação do projeto.
- README.md: Totalmente reescrito com foco no objetivo do produto, tecnologias utilizadas e um guia passo a passo padronizado para execução local (instalação e scripts).
- ARCHITECTURE.md: Expandido com um dicionário detalhado de componentes. Agora documenta claramente o fluxo de dados (Data-Driven), responsabilidades isoladas (GameEngine, JSON, DialogueSystem, etc) e regras de estado global vs local.
- FUTURE_IMPROVEMENTS.md: Criado novo documento mapeando o plano de ação focado na evolução pedagógica do MVP, incluindo propostas de dicas socráticas, puzzles interpretativos, uso imersivo do Necronomicon e substituição de emojis por artes 2D.
 o arquivo [ARCHITECTURE.md](./ARCHITECTURE.md) neste repositório.
