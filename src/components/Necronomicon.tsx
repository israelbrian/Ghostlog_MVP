'use client';

import React, { useState } from 'react';
import { NecronomiconEntry } from '@/types/game';

interface NecronomiconProps {
  unlockedSpellIds: string[];
  inventory: string[];
}

/**
 * Base de Dados Fixa dos Feitiços de TI do Grimório (Necronomicon)
 */
const NECRONOMICON_DATABASE: NecronomiconEntry[] = [
  {
    id: 'spell_html',
    title: 'Feitiço 01: Selamento de Entidade HTML',
    category: 'html',
    description: 'Em HTML, os elementos estruturais possuem tags de abertura e fechamento. Para fechar a tag de corpo <body> e selar uma sala, utiliza-se a barra de fechamento.',
    codeSnippet: '<!-- Exemplo de Selamento -->\n<body>\n  <p>Conteúdo da Sala</p>\n</body>',
    unlockedAtNode: 'post_html_success',
  },
  {
    id: 'spell_python',
    title: 'Feitiço 02: Laços de Repetição em Python',
    category: 'python',
    description: 'Para iterar sobre uma sequência ou executar um bloco enquanto uma condição for verdadeira sem travar o processador em um loop infinito, utilize as palavras-chave `while` ou `for`.',
    codeSnippet: '# Laço While em Python\ncontador = 0\nwhile contador < 10:\n    print("Energizando módulo", contador)\n    contador += 1',
    unlockedAtNode: 'post_python_success',
  },
  {
    id: 'spell_sql',
    title: 'Feitiço 03: A Cláusula de Redenção WHERE em SQL',
    category: 'sql',
    description: 'A regra número um de banco de dados: NUNCA execute um comando de SELECT, UPDATE ou DELETE sem a cláusula WHERE! Ela restringe o comando a apenas as linhas especificadas.',
    codeSnippet: '-- Consulta Segura com WHERE\nSELECT nota \nFROM historico \nWHERE aluno = \'Roberto\';',
    unlockedAtNode: 'victory',
  },
];

/**
 * Necronomicon: Componente de Grimório Lateral (Passo 4)
 * 
 * Responsabilidade:
 * Exibir os feitiços e conhecimentos de TI desbloqueados pelo jogador durante a partida.
 * Renderiza em modal/sidebar com animações, badges e formatação de código.
 */
export const Necronomicon: React.FC<NecronomiconProps> = ({ unlockedSpellIds, inventory }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const unlockedSpells = NECRONOMICON_DATABASE.filter((spell) =>
    unlockedSpellIds.includes(spell.id)
  );

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <>
      {/* Botão Flutuante de Abertura no Canto Superior Direito */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/40 bg-slate-950/80 backdrop-blur-md text-purple-300 hover:text-purple-100 hover:border-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95 group font-mono text-sm"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform">📖</span>
        <span className="font-bold">Necronomicon</span>
        {unlockedSpells.length > 0 && (
          <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-md">
            {unlockedSpells.length}
          </span>
        )}
      </button>

      {/* Modal / Sidebar Obscuro do Grimório */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
          <div className="w-full max-w-lg h-full max-h-[90vh] flex flex-col rounded-2xl border border-purple-500/50 bg-slate-950 shadow-[0_0_50px_rgba(168,85,247,0.4)] backdrop-blur-2xl overflow-hidden font-mono">
            
            {/* Cabeçalho do Grimório */}
            <div className="p-5 border-b border-purple-900/60 flex items-center justify-between bg-purple-950/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📖</span>
                <div>
                  <h2 className="text-lg font-bold text-purple-200 tracking-wide">
                    NECRONOMICON DE TI
                  </h2>
                  <p className="text-xs text-purple-400">
                    Conhecimentos & Feitiços Amaldiçoados
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Inventário de Itens Coletados */}
            {inventory.length > 0 && (
              <div className="px-5 py-3 border-b border-purple-900/40 bg-slate-900/60 flex items-center gap-2">
                <span className="text-xs text-purple-400 font-bold uppercase">Inventário:</span>
                <div className="flex gap-2">
                  {inventory.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-purple-950 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-1 shadow-sm"
                    >
                      <span>💾</span> {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Feitiços Desbloqueados */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {unlockedSpells.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-purple-400/60">
                  <span className="text-5xl mb-3 opacity-40">📜</span>
                  <p className="text-sm">Nenhum feitiço desbloqueado ainda.</p>
                  <p className="text-xs mt-1 text-purple-500/50">
                    Resolva os enigmas do Prof. Valdemar para registrar o conhecimento.
                  </p>
                </div>
              ) : (
                unlockedSpells.map((spell) => (
                  <div
                    key={spell.id}
                    className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-2 hover:border-purple-400/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-purple-200">{spell.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-900/60 text-purple-300 border border-purple-500/30">
                        {spell.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {spell.description}
                    </p>

                    {/* Bloco de Código Simplificado com Copiar */}
                    <div className="relative mt-2 rounded-lg bg-black/90 p-3 border border-purple-900/80 text-xs font-mono text-emerald-400">
                      <pre className="overflow-x-auto">{spell.codeSnippet}</pre>
                      <button
                        onClick={() => handleCopyCode(spell.codeSnippet, spell.id)}
                        className="absolute top-2 right-2 px-2 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-[10px] text-purple-200 transition-colors border border-purple-500/30"
                      >
                        {copiedId === spell.id ? 'Copiado! ✓' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé do Grimório */}
            <div className="p-4 border-t border-purple-900/60 bg-purple-950/40 text-center text-xs text-purple-400/70">
              Ghost.log MVP • Exorcismo de TI
            </div>
          </div>
        </div>
      )}
    </>
  );
};
