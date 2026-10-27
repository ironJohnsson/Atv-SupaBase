// ====================================================================
// SUCELSO TECH - Grade Horária Semanal Responsiva e Interativa
// ====================================================================

import React from 'react';
import { Clock, MapPin, User, Edit3, Coffee, CheckCircle } from 'lucide-react';

const DIAS = [
  { key: 'segunda', label: 'Segunda-feira', short: 'Seg' },
  { key: 'terca', label: 'Terça-feira', short: 'Ter' },
  { key: 'quarta', label: 'Quarta-feira', short: 'Qua' },
  { key: 'quinta', label: 'Quinta-feira', short: 'Qui' },
  { key: 'sexta', label: 'Sexta-feira', short: 'Sex' }
];

// Paleta de cores moderna por disciplina
const DISCIPLINA_CORES = [
  { bg: 'bg-blue-50 border-blue-200 text-blue-900', badge: 'bg-blue-200 text-blue-800' },
  { bg: 'bg-emerald-50 border-emerald-200 text-emerald-900', badge: 'bg-emerald-200 text-emerald-800' },
  { bg: 'bg-purple-50 border-purple-200 text-purple-900', badge: 'bg-purple-200 text-purple-800' },
  { bg: 'bg-amber-50 border-amber-200 text-amber-900', badge: 'bg-amber-200 text-amber-800' },
  { bg: 'bg-rose-50 border-rose-200 text-rose-900', badge: 'bg-rose-200 text-rose-800' },
  { bg: 'bg-indigo-50 border-indigo-200 text-indigo-900', badge: 'bg-indigo-200 text-indigo-800' },
  { bg: 'bg-teal-50 border-teal-200 text-teal-900', badge: 'bg-teal-200 text-teal-800' },
  { bg: 'bg-cyan-50 border-cyan-200 text-cyan-900', badge: 'bg-cyan-200 text-cyan-800' }
];

function getSubjectColor(codeOrName = '') {
  let hash = 0;
  for (let i = 0; i < codeOrName.length; i++) {
    hash = codeOrName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DISCIPLINA_CORES.length;
  return DISCIPLINA_CORES[index];
}

export default function TimetableGrid({
  horarios = [],
  turno = 'matutino',
  onEditSlot = null,
  isCoordinator = false
}) {
  // Define os intervalos de slots baseado no turno
  const isVespertino = turno === 'vespertino';

  const slot1 = isVespertino
    ? { inicio: '13:00', fim: '15:00', label: '1º Bloco: 13:00 - 15:00' }
    : { inicio: '08:00', fim: '10:00', label: '1º Bloco: 08:00 - 10:00' };

  const intervalo = isVespertino
    ? { inicio: '15:00', fim: '15:20', label: '15:00 - 15:20' }
    : { inicio: '10:00', fim: '10:20', label: '10:00 - 10:20' };

  const slot2 = isVespertino
    ? { inicio: '15:20', fim: '17:00', label: '2º Bloco: 15:20 - 17:00' }
    : { inicio: '10:20', fim: '12:00', label: '2º Bloco: 10:20 - 12:00' };

  function findItem(diaKey, inicio) {
    return horarios.find(h => h.dia.toLowerCase() === diaKey && h.inicio === inicio);
  }

  function renderSlotCell(item, dia, slot) {
    if (!item) {
      return (
        <div className="h-full min-h-[110px] p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 text-xs">
          <Clock className="w-4 h-4 mb-1 text-slate-300" />
          <span>Livre</span>
        </div>
      );
    }

    const color = getSubjectColor(item.disciplina_codigo || item.disciplina_nome);

    return (
      <div
        className={`h-full min-h-[110px] p-3 rounded-xl border ${color.bg} shadow-xs flex flex-col justify-between transition-all hover:shadow-md relative group`}
      >
        <div>
          <div className="flex items-start justify-between gap-1 mb-1.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${color.badge}`}>
              {item.disciplina_codigo || 'AULA'}
            </span>
            {isCoordinator && onEditSlot && (
              <button
                onClick={() => onEditSlot(item)}
                title="Ajustar alocação deste horário"
                className="opacity-0 group-hover:opacity-100 p-1 bg-white/80 hover:bg-white text-slate-700 rounded shadow-xs transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <h4 className="font-bold text-xs sm:text-sm leading-tight text-slate-900 line-clamp-2">
            {item.disciplina_nome}
          </h4>
        </div>

        <div className="mt-2 space-y-1 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1.5 truncate">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{item.professor_nome}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-700">{item.sala_identificacao}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full border-collapse min-w-[760px]">
        <thead>
          <tr className="bg-slate-100/80 border-b border-slate-200">
            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-36">
              Horário / Turno
            </th>
            {DIAS.map(dia => (
              <th key={dia.key} className="py-3 px-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span className="hidden sm:inline">{dia.label}</span>
                <span className="sm:hidden">{dia.short}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {/* 1º Bloco de Aulas */}
          <tr>
            <td className="py-4 px-4 bg-slate-50/50 border-r border-slate-100 align-top">
              <span className="font-bold text-xs text-slate-800 block">{slot1.label.split(':')[0]}</span>
              <span className="text-xs text-slate-500 font-mono mt-0.5 block">{slot1.inicio} - {slot1.fim}</span>
              <span className="inline-block mt-2 text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                2 horas-aula
              </span>
            </td>
            {DIAS.map(dia => (
              <td key={dia.key} className="p-2.5 align-top">
                {renderSlotCell(findItem(dia.key, slot1.inicio), dia, slot1)}
              </td>
            ))}
          </tr>

          {/* Faixa de Intervalo / Recreio Obrigatório */}
          <tr className="bg-amber-50/50 border-y border-amber-200/60">
            <td className="py-2 px-4 text-xs font-medium text-amber-800 flex items-center space-x-1.5 border-r border-amber-100">
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Intervalo: {intervalo.label}</span>
            </td>
            <td colSpan={5} className="py-2 px-4 text-center text-xs text-amber-700 font-medium">
              ☕ Intervalo e Convivência Escolar (20 min)
            </td>
          </tr>

          {/* 2º Bloco de Aulas */}
          <tr>
            <td className="py-4 px-4 bg-slate-50/50 border-r border-slate-100 align-top">
              <span className="font-bold text-xs text-slate-800 block">{slot2.label.split(':')[0]}</span>
              <span className="text-xs text-slate-500 font-mono mt-0.5 block">{slot2.inicio} - {slot2.fim}</span>
              <span className="inline-block mt-2 text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                2 horas-aula
              </span>
            </td>
            {DIAS.map(dia => (
              <td key={dia.key} className="p-2.5 align-top">
                {renderSlotCell(findItem(dia.key, slot2.inicio), dia, slot2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

