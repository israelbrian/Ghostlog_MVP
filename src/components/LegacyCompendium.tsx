'use client';

import React, { useState } from 'react';
import { LegacyCompendiumEntry } from '@/types/game';

interface LegacyCompendiumProps {
  unlockedEntryIds: string[];
  inventory: string[];
  currentAnalogyTitle?: string;
  currentAnalogyText?: string;
  currentDescription?: string;
  currentCodeSnippet?: string;
}

/**
 * Base de Dados Fixa do Compêndio do Código Legado
 * Conhecimentos desbloqueados por fase, com analogias didáticas.
 */
const LEGACY_COMPENDIUM_DATABASE: LegacyCompendiumEntry[] = [
  // FASE 1
  {
    id: 'entry_html_close',
    title: 'HTML: Fechamento de Tags',
    category: 'html',
    analogyTitle: '💡 Analogia do Sanduíche',
    analogyText: 'Pense no HTML como um sanduíche: o pão de baixo abre <body>, o recheio fica no meio, e o pão de cima </body> fecha tudo. Se faltar o pão de cima, o recheio cai e a estrutura desmorona.',
    description: 'Toda tag de abertura <tag> exige uma tag de fechamento </tag>. O navegador monta a árvore DOM corretamente apenas quando a estrutura está balanceada.',
    codeSnippet: '<!-- Estrutura Básica -->\n<body>\n  <h1>Título</h1>\n  <p>Conteúdo</p>\n</body>',
    unlockedAtNode: 'puzzle_1_1_html',
    phaseId: 1,
  },
  {
    id: 'entry_logic_assign',
    title: 'Lógica: Atribuição de Variáveis',
    category: 'logic',
    analogyTitle: '💡 Analogia da Caixa Etiquetada',
    analogyText: 'Variáveis são caixas com etiquetas. Você escreve o nome na etiqueta (energia_ativa), coloca o valor dentro (True), e usa o sinal = para guardar. Depois o sistema olha a caixa e sabe o que tem dentro.',
    description: 'O operador de atribuição (=) armazena um valor numa variável. Em Python: variavel = valor. O lado esquerdo recebe o resultado do lado direito.',
    codeSnippet: '# Atribuição em Python\nenergia_ativa = True\ncontador = 0\nnome = "Servidor"',
    unlockedAtNode: 'puzzle_1_2_logic',
    phaseId: 1,
  },
  {
    id: 'entry_python_for',
    title: 'Python: Laço de Repetição for',
    category: 'python',
    analogyTitle: '💡 Analogia da Chamada Escolar',
    analogyText: 'O laço "for" é como a chamada do professor: ele passa nome por nome na lista (for cada aluno in turma) e executa a mesma ação para cada um. Não precisa escrever 30 vezes — escreve uma vez e o laço repete.',
    description: 'Itera sobre sequências (listas, tuplas, ranges). Sintaxe: for item in colecao: bloco. A variável "item" recebe cada elemento por vez.',
    codeSnippet: '# Laço for em Python\nfor gerador in geradores:\n    print("Energizando", gerador)\n    gerador.ativar()',
    unlockedAtNode: 'puzzle_1_3_python',
    phaseId: 1,
  },
  // FASE 2
  {
    id: 'entry_sql_select',
    title: 'SQL: Consulta SELECT',
    category: 'sql',
    analogyTitle: '💡 Analogia do Cardápio',
    analogyText: 'O SELECT é como pedir ao garçom: "Quero ver apenas o item X do cardápio". Você não pede a cozinha inteira — especifica exatamente qual coluna quer que apareça na sua mesa.',
    description: 'Seleciona colunas específicas de uma tabela. SELECT coluna FROM tabela. Use * para todas as colunas, mas evite em produção.',
    codeSnippet: '-- Consulta básica\nSELECT nome, email\nFROM alunos\nWHERE ativo = true;',
    unlockedAtNode: 'puzzle_2_1_sql_select',
    phaseId: 2,
  },
  {
    id: 'entry_sql_where',
    title: 'SQL: Filtro WHERE',
    category: 'sql',
    analogyTitle: '💡 Analogia da Catraca',
    analogyText: 'O WHERE é a catraca da portaria: barra todo mundo e deixa passar apenas quem tem o crachá certo (aluno = "Roberto"). Sem catraca, a faculdade inteira entra e o caos se instala.',
    description: 'Restringe linhas retornadas pela consulta. WHERE condição. Operadores: =, !=, >, <, LIKE, IN, BETWEEN. SEMPRE use em UPDATE/DELETE.',
    codeSnippet: '-- Filtro seguro\nSELECT nota\nFROM historico\nWHERE aluno = \'Roberto\';',
    unlockedAtNode: 'puzzle_2_2_sql_where',
    phaseId: 2,
  },
  {
    id: 'entry_sql_update',
    title: 'SQL: Atualização UPDATE',
    category: 'sql',
    analogyTitle: '💡 Analogia do Corretivo',
    analogyText: 'UPDATE é passar corretivo numa linha da pauta: você apaga o erro (SET nota = 10) mas SÓ naquela linha (WHERE aluno = "Roberto"). Sem o WHERE, você apaga a pauta inteira.',
    description: 'Modifica dados existentes. UPDATE tabela SET coluna = valor WHERE condição. O WHERE é obrigatório para evitar alteração em massa acidental.',
    codeSnippet: '-- Atualização segura\nUPDATE historico\nSET nota = 10\nWHERE aluno = \'Roberto\';',
    unlockedAtNode: 'puzzle_2_3_sql_update',
    phaseId: 2,
  },
  // FASE 3
  {
    id: 'entry_infra_ping',
    title: 'Infraestrutura: Teste de Conectividade ping',
    category: 'infra',
    analogyTitle: '💡 Analogia do Sonar',
    analogyText: 'O ping é como um sonar no escuro: você envia um "grito" (pacote ICMP) e espera o eco voltar. Se volta, o servidor tá acordado e alcançável. Se não volta, tá desligado ou o cabo caiu.',
    description: 'Testa conectividade IP. ping endereço_ip. Retorna tempo de resposta (latência) ou "Request timed out" se falhar.',
    codeSnippet: '# Teste de conectividade\nping 192.168.0.1\nping google.com',
    unlockedAtNode: 'puzzle_3_1_ping',
    phaseId: 3,
  },
  {
    id: 'entry_infra_cd',
    title: 'Infraestrutura: Navegação cd',
    category: 'infra',
    analogyTitle: '💡 Analogia da Maçaneta',
    analogyText: 'O cd (change directory) é girar a maçaneta e entrar numa sala. Você tá no corredor (pasta atual), digita cd pasta_logs e entra na sala onde o arquivo tá guardado.',
    description: 'Muda o diretório de trabalho atual. cd caminho/para/pasta. Use cd .. para subir um nível. pwd mostra onde você está.',
    codeSnippet: '# Navegação de diretórios\ncd /var/log\ncd pasta_logs\ncd ..  # volta um nível\npwd    # mostra caminho atual',
    unlockedAtNode: 'puzzle_3_2_cd',
    phaseId: 3,
  },
  {
    id: 'entry_infra_kill',
    title: 'Infraestrutura: Encerramento de Processo kill',
    category: 'infra',
    analogyTitle: '💡 Analogia do Disjuntor',
    analogyText: 'O kill é o disjuntor de emergência: você identifica o aparelho que entrou em curto (PID 4040) e desliga SÓ ele (kill 4040). A rede elétrica (servidor) continua viva, só o problema some.',
    description: 'Encerra processos pelo PID. kill PID encerra graciosamente (SIGTERM). kill -9 PID força encerramento imediato (SIGKILL). Use com cautela.',
    codeSnippet: '# Gerenciamento de processos\nps aux | grep node  # acha PID\nkill 4040            # encerra gracioso\nkill -9 4040         # força (último recurso)',
    unlockedAtNode: 'puzzle_3_3_kill',
    phaseId: 3,
  },
];

/**
 * LegacyCompendium: Componente do Compêndio do Código Legado
 * Exibe conhecimentos desbloqueados, analogia do desafio atual e inventário.
 */
export const LegacyCompendium: React.FC<LegacyCompendiumProps> = ({
  unlockedEntryIds,
  inventory,
  currentAnalogyTitle,
  currentAnalogyText,
  currentDescription,
  currentCodeSnippet,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const unlockedEntries = LEGACY_COMPENDIUM_DATABASE.filter((entry) =>
    unlockedEntryIds.includes(entry.id)
  );

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <>
      {/* Botão Flutuante de Abertura no Canto Inferior Direito */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Compêndio do Código Legado"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-slate-950/80 backdrop-blur-md text-emerald-300 hover:text-emerald-100 hover:border-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 group font-mono text-sm"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform">📋</span>
        <span className="font-bold">Compêndio</span>
        {unlockedEntries.length > 0 && (
          <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
            {unlockedEntries.length}
          </span>
        )}
      </button>

      {/* Modal / Sidebar do Compêndio */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
          <div className="w-full max-w-lg h-full max-h-[90vh] flex flex-col rounded-2xl border border-emerald-500/50 bg-slate-950 shadow-[0_0_50px_rgba(16,185,129,0.4)] backdrop-blur-2xl overflow-hidden font-mono">
            
            {/* Cabeçalho do Compêndio */}
            <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between bg-emerald-950/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <div>
                  <h2 className="text-lg font-bold text-emerald-200 tracking-wide">
                    COMPÊNDIO DO CÓDIGO LEGADO
                  </h2>
                  <p className="text-xs text-emerald-400">
                    Conhecimentos & Analogias de Bolso
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Analogia do Desafio Atual (Guia Prévio Ativo) */}
            {(currentAnalogyTitle || currentAnalogyText) && (
              <div className="px-5 py-4 border-b border-emerald-900/40 bg-emerald-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Analogia de Bolso — Desafio Atual
                  </span>
                </div>
                <h3 className="text-sm font-bold text-emerald-200 mb-1">
                  {currentAnalogyTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalogyText}
                </p>
              </div>
            )}

            {/* Inventário de Itens Coletados */}
            {inventory.length > 0 && (
              <div className="px-5 py-3 border-b border-emerald-900/40 bg-slate-900/60 flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-bold uppercase">Inventário:</span>
                <div className="flex gap-2 flex-wrap">
                  {inventory.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-1 shadow-sm"
                    >
                      <span>💾</span> {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Conhecimentos Desbloqueados */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {unlockedEntries.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-emerald-400/60">
                  <span className="text-5xl mb-3 opacity-40">📜</span>
                  <p className="text-sm">Nenhum conhecimento desbloqueado ainda.</p>
                  <p className="text-xs mt-1 text-emerald-500/50">
                    Resolva os enigmas dos 3 Espectros para registrar o conhecimento.
                  </p>
                </div>
              ) : (
                unlockedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 hover:border-emerald-400/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-emerald-200">{entry.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                        {entry.category}
                      </span>
                    </div>

                    {/* Mini-analogia no card */}
                    <div className="text-[10px] text-emerald-400/80 bg-emerald-950/30 px-2 py-1 rounded">
                      {entry.analogyTitle}: {entry.analogyText}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {entry.description}
                    </p>

                    {/* Bloco de Código com Copiar */}
                    <div className="relative mt-2 rounded-lg bg-black/90 p-3 border border-emerald-900/80 text-xs font-mono text-emerald-400">
                      <pre className="overflow-x-auto">{entry.codeSnippet}</pre>
                      <button
                        onClick={() => handleCopyCode(entry.codeSnippet, entry.id)}
                        className="absolute top-2 right-2 px-2 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-[10px] text-emerald-200 transition-colors border border-emerald-500/30"
                      >
                        {copiedId === entry.id ? 'Copiado! ✓' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé do Compêndio */}
            <div className="p-4 border-t border-emerald-900/60 bg-emerald-950/40 text-center text-xs text-emerald-400/70">
              Ghost.log — Terminal Assombrado
            </div>
          </div>
        </div>
      )}
    </>
  );
};