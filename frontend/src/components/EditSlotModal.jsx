// ====================================================================
// SUCELSO TECH - Modal de Ajuste Manual de Alocação de Horário
// ====================================================================

import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function EditSlotModal({
  slot,
  salas = [],
  professores = [],
  onClose,
  onSave
}) {
  const [salaId, setSalaId] = useState(slot?.sala_id || '');
  const [professorId, setProfessorId] = useState(slot?.professor_id || '');
  const [dia, setDia] = useState(slot?.dia || 'segunda');
  const [inicio, setInicio] = useState(slot?.inicio || '08:00');
  const [fim, setFim] = useState(slot?.fim || '10:00');
  const [saving, setSaving] = useState(false);

  if (!slot) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        id: slot.id,
        sala_id: salaId,
        professor_id: professorId,
        dia,
        inicio,
        fim
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Ajustar Alocação de Horário</h3>
            <p className="text-xs text-slate-500 mt-0.5">{slot.disciplina_nome} ({slot.turma_nome})</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Seletor de Sala */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sala / Laboratório
            </label>
            <select
              value={salaId}
              onChange={e => setSalaId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {salas.map(s => (
                <option key={s.id} value={s.id}>
                  {s.identificacao} (Capacidade: {s.capacidade} alunos)
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Professor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Docente Responsável
            </label>
            <select
              value={professorId}
              onChange={e => setProfessorId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {professores.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.matricula})
                </option>
              ))}
            </select>
          </div>

          {/* Dia da Semana */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dia da Semana
            </label>
            <select
              value={dia}
              onChange={e => setDia(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="segunda">Segunda-feira</option>
              <option value="terca">Terça-feira</option>
              <option value="quarta">Quarta-feira</option>
              <option value="quinta">Quinta-feira</option>
              <option value="sexta">Sexta-feira</option>
            </select>
          </div>

          {/* Horários */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Início</label>
              <input
                type="time"
                value={inicio}
                onChange={e => setInicio(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fim</label>
              <input
                type="time"
                value={fim}
                onChange={e => setFim(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Esta alteração será registrada automaticamente no <strong>Histórico de Auditoria</strong> com seu usuário e carimbo de data/hora.
            </span>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Confirmar Ajuste'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

