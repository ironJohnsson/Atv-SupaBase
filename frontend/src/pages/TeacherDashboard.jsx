// ====================================================================
// SUCELSO TECH - Painel do Professor (Grade e Gestão de Disponibilidade)
// ====================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import TimetableGrid from '../components/TimetableGrid';
import ExportPdfButton from '../components/ExportPdfButton';
import { BookOpen, Calendar, Clock, Plus, AlertCircle, CheckCircle, Info, ShieldAlert, Send } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [activeTab, setActiveTab] = useState('grade'); // 'grade' | 'disponibilidade'

  // Formulário de nova disponibilidade
  const [dia, setDia] = useState('terca');
  const [inicio, setInicio] = useState('08:00');
  const [fim, setFim] = useState('12:00');
  const [savingDisp, setSavingDisp] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [horariosRes, dispRes] = await Promise.all([
        apiRequest('/horarios/professor'),
        apiRequest('/disponibilidades')
      ]);

      if (horariosRes.success) setHorarios(horariosRes.horarios || []);
      if (dispRes.success) setDisponibilidades(dispRes.disponibilidades || []);
    } catch (err) {
      console.error('Erro ao carregar dados do docente:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAvailability(e) {
    e.preventDefault();
    setSavingDisp(true);
    setFeedbackMsg(null);
    try {
      const res = await apiRequest('/disponibilidades', {
        method: 'POST',
        body: { dia, inicio, fim }
      });

      setFeedbackMsg({
        tipo: 'sucesso',
        texto: res.message || 'Disponibilidade registrada com sucesso!'
      });

      // Recarrega lista
      const updated = await apiRequest('/disponibilidades');
      if (updated.success) setDisponibilidades(updated.disponibilidades || []);
    } catch (err) {
      setFeedbackMsg({
        tipo: 'erro',
        texto: err.message || 'Falha ao registrar disponibilidade.'
      });
    } finally {
      setSavingDisp(false);
    }
  }

  const isRobertoLima = user?.email?.includes('roberto');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner de Boas-vindas */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Portal do Docente • SENAI CIMATEC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user?.nome || 'Docente'}
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1">
              Matrícula: <strong>{user?.matricula || 'MATR-P001'}</strong> • Especialidade: <strong>Banco de Dados & Big Data</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <ExportPdfButton
              targetElementId="grade-docente-container"
              filename={`grade-docente-${user?.nome?.toLowerCase().replace(/\s+/g, '-') || 'professor'}.pdf`}
            />
          </div>
        </div>

        {/* Alerta de Validação Específica do Prof. Roberto Lima */}
        {isRobertoLima && (
          <div className="mt-4 pt-4 border-t border-white/15 flex items-start space-x-2 text-xs text-amber-200 bg-amber-500/10 p-3 rounded-2xl border border-amber-300/20">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Cenário Obrigatório de Validação (Item 10):</strong> O Prof. Roberto Lima possui restrição estrita registrada exclusivamente para <strong>Segundas e Quartas-feiras</strong>. O algoritmo de geração automática só poderá alocar turmas nestes dias!
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('grade')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'grade' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Minha Grade de Aulas</span>
        </button>
        <button
          onClick={() => setActiveTab('disponibilidade')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'disponibilidade' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Clock className="w-4 h-4" />
          <span>Minhas Disponibilidades Semanais</span>
        </button>
      </div>

      {/* TAB 1: GRADE DO PROFESSOR */}
      {activeTab === 'grade' && (
        <div id="grade-docente-container" className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Minha Grade Semanal Oficial (2026.1)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Horários de aulas homologados pela coordenação onde você atua como docente responsável
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              Carregando seus horários...
            </div>
          ) : horarios.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Nenhuma aula alocada para você na versão oficial publicada no momento.
            </div>
          ) : (
            <TimetableGrid
              horarios={horarios}
              turno="matutino"
              isCoordinator={false}
            />
          )}
        </div>
      )}

      {/* TAB 2: GESTÃO DE DISPONIBILIDADE */}
      {activeTab === 'disponibilidade' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário para Submeter Nova Disponibilidade */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Informar Nova Disponibilidade</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Dias e faixas horárias em que você pode lecionar
              </p>
            </div>

            {feedbackMsg && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start space-x-2 border ${feedbackMsg.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                {feedbackMsg.tipo === 'sucesso' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{feedbackMsg.texto}</span>
              </div>
            )}

            <form onSubmit={handleAddAvailability} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dia da Semana
                </label>
                <select
                  value={dia}
                  onChange={e => setDia(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="segunda">Segunda-feira</option>
                  <option value="terca">Terça-feira</option>
                  <option value="quarta">Quarta-feira</option>
                  <option value="quinta">Quinta-feira</option>
                  <option value="sexta">Sexta-feira</option>
                  <option value="sabado">Sábado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Início</label>
                  <input
                    type="time"
                    value={inicio}
                    onChange={e => setInicio(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fim</label>
                  <input
                    type="time"
                    value={fim}
                    onChange={e => setFim(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Informação sobre a regra de alteração pós-publicação */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Regra de Negócio:</strong> Como a grade já foi publicada, alterações de disponibilidade são submetidas à análise da coordenação e <em>não alteram automaticamente</em> a grade oficial vigente.
                </span>
              </div>

              <button
                type="submit"
                disabled={savingDisp}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{savingDisp ? 'Submetendo...' : 'Submeter Disponibilidade'}</span>
              </button>
            </form>
          </div>

          {/* Lista de Disponibilidades Cadastradas */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Suas Janelas de Disponibilidade Cadastradas</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {disponibilidades.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  Nenhuma disponibilidade cadastrada até o momento.
                </p>
              ) : (
                disponibilidades.map(d => (
                  <div key={d.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm capitalize">
                        {d.dia}-feira
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {d.inicio} às {d.fim}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${d.status === 'aprovado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                        {d.status === 'aprovado' ? 'Aprovado / Vigente' : 'Pendente de Homologação'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

