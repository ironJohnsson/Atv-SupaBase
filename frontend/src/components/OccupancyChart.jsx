// ====================================================================
// SUCELSO TECH - Indicadores de Ocupação das Salas (Diferencial)
// ====================================================================

import React from 'react';
import { Building2, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function OccupancyChart({ ocupacaoData }) {
  if (!ocupacaoData || !ocupacaoData.salas) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm">
        Carregando dados de ocupação de salas...
      </div>
    );
  }

  const { media_ocupacao_geral_percentual, total_salas_monitoradas, salas } = ocupacaoData;

  function getBarColor(rate) {
    if (rate >= 75) return 'bg-rose-500';
    if (rate >= 40) return 'bg-blue-600';
    return 'bg-emerald-500';
  }

  function getBadgeColor(status) {
    if (status === 'ALTA') return 'bg-rose-100 text-rose-700 border-rose-200';
    if (status === 'MODERADA') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Taxa de Ocupação dos Laboratórios e Salas</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Diferencial de Excelência: Monitoramento da eficiência física dos espaços acadêmicos
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-900">
            Média Geral: {media_ocupacao_geral_percentual}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salas.map(s => (
          <div key={s.sala_id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{s.identificacao}</h4>
                <span className="text-[11px] text-slate-500">{s.tipo}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColor(s.status)}`}>
                {s.status}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-600 mb-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Capacidade: <strong>{s.capacidade} alunos</strong></span>
              <span className="text-slate-300">•</span>
              <span>{s.slots_ocupados} / {s.capacidade_maxima_semanal} slots</span>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-500">Uso Semanal</span>
                <span className="text-slate-800">{s.taxa_ocupacao_percentual}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(s.taxa_ocupacao_percentual)}`}
                  style={{ width: `${s.taxa_ocupacao_percentual}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

