// ====================================================================
// SUCELSO TECH - Componente de Alertas e Detecção de Conflitos
// ====================================================================

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function ConflictBadge({ conflitos = [], aulasNaoAlocadas = [] }) {
  const hasConflicts = conflitos.length > 0;
  const hasUnallocated = aulasNaoAlocadas.length > 0;

  if (!hasConflicts && !hasUnallocated) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold shadow-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Grade 100% Otimizada • 0 Conflitos Detectados</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {hasConflicts && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 shadow-xs">
          <div className="flex items-center space-x-2 font-bold mb-1.5 text-red-700">
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Atenção: {conflitos.length} Conflito(s) Identificado(s) na Grade</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-red-800">
            {conflitos.map((c, i) => (
              <li key={i} className="leading-relaxed">
                <strong>{c.tipo}:</strong> {c.mensagem}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasUnallocated && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 shadow-xs">
          <div className="flex items-center space-x-2 font-bold mb-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{aulasNaoAlocadas.length} Aula(s) Não Alocadas por Restrições Rígidas</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            {aulasNaoAlocadas.map((a, i) => (
              <li key={i}>
                <strong>{a.turma} - {a.disciplina}:</strong> {a.motivo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

