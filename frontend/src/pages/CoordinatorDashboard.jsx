// ====================================================================
// SUCELSO TECH - Painel do Coordenador (Administração Completa da Grade)
// ====================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import TimetableGrid from '../components/TimetableGrid';
import ConflictBadge from '../components/ConflictBadge';
import OccupancyChart from '../components/OccupancyChart';
import EditSlotModal from '../components/EditSlotModal';
import ExportPdfButton from '../components/ExportPdfButton';
import {
  Shield,
  Zap,
  CheckCircle2,
  Calendar,
  Building2,
  History,
  BookOpen,
  Users,
  Layers,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Dados principais
  const [turmas, setTurmas] = useState([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState('');
  const [salas, setSalas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [versoes, setVersoes] = useState([]);
  const [conflitos, setConflitos] = useState([]);
  const [ocupacaoData, setOcupacaoData] = useState(null);
  const [historico, setHistorico] = useState([]);

  // Estados de navegação e modal
  const [activeTab, setActiveTab] = useState('grade'); // 'grade' | 'salas' | 'historico' | 'cadastros'
  const [editingSlot, setEditingSlot] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [
        turmasRes,
        salasRes,
        profsRes,
        discsRes,
        versoesRes,
        horariosRes,
        conflitosRes,
        ocupacaoRes,
        histRes
      ] = await Promise.all([
        apiRequest('/turmas'),
        apiRequest('/salas'),
        apiRequest('/professores'),
        apiRequest('/disciplinas'),
        apiRequest('/horarios/versoes'),
        apiRequest('/horarios/todos'),
        apiRequest('/horarios/conflitos'),
        apiRequest('/horarios/ocupacao-salas'),
        apiRequest('/horarios/historico')
      ]);

      if (turmasRes.success) {
        setTurmas(turmasRes.turmas || []);
        if (turmasRes.turmas?.length > 0 && !selectedTurmaId) {
          setSelectedTurmaId(turmasRes.turmas[0].id);
        }
      }
      if (salasRes.success) setSalas(salasRes.salas || []);
      if (profsRes.success) setProfessores(profsRes.professores || []);
      if (discsRes.success) setDisciplinas(discsRes.disciplinas || []);
      if (versoesRes.success) setVersoes(versoesRes.versoes || []);
      if (horariosRes.success) setHorarios(horariosRes.horarios || []);
      if (conflitosRes.success) setConflitos(conflitosRes.conflitos || []);
      if (ocupacaoRes.success) setOcupacaoData(ocupacaoRes.ocupacao);
      if (histRes.success) setHistorico(histRes.historico || []);
    } catch (err) {
      console.error('Erro ao carregar dados do painel do coordenador:', err);
    } finally {
      setLoading(false);
    }
  }

  // Ação 1: Gerar Proposta Automática (Algoritmo CSP + Heurística de Janelas)
  async function handleGenerateSchedule() {
    setGenerating(true);
    setNotification(null);
    try {
      const res = await apiRequest('/horarios/gerar', {
        method: 'POST',
        body: { periodo: '2026.1', observacoes: 'Grade gerada pelo Coordenador com gap reduction' }
      });

      setNotification({
        tipo: 'sucesso',
        titulo: 'Proposta de Grade Gerada com Sucesso!',
        mensagem: `Total de ${res.metricas?.total_aulas_alocadas || 0} aulas alocadas. ${res.conflitos?.length || 0} conflitos detectados. A nova versão está em status RASCUNHO para sua revisão.`
      });

      await loadAllData();
    } catch (err) {
      setNotification({
        tipo: 'erro',
        titulo: 'Falha na Geração',
        mensagem: err.message || 'Erro ao executar o algoritmo.'
      });
    } finally {
      setGenerating(false);
    }
  }

  // Ação 2: Publicar Versão Oficial
  async function handlePublishVersion() {
    // Localiza a versão mais recente em rascunho ou a primeira da lista
    const versaoAlvo = versoes.find(v => v.status === 'rascunho' || v.status === 'em_revisao') || versoes[0];
    if (!versaoAlvo) return;

    setPublishing(true);
    try {
      const res = await apiRequest(`/horarios/versoes/${versaoAlvo.id}/publicar`, {
        method: 'POST'
      });

      setNotification({
        tipo: 'sucesso',
        titulo: 'Grade Oficial Publicada!',
        mensagem: res.message || 'A versão foi homologada e está oficializada para consulta dos alunos e professores.'
      });

      await loadAllData();
    } catch (err) {
      setNotification({
        tipo: 'erro',
        titulo: 'Erro ao Publicar',
        mensagem: err.message || 'Não foi possível publicar a versão.'
      });
    } finally {
      setPublishing(false);
    }
  }

  // Ação 3: Salvar Ajuste Manual de Slot
  async function handleSaveSlot(slotData) {
    try {
      const res = await apiRequest(`/horarios/${slotData.id}`, {
        method: 'PUT',
        body: slotData
      });

      setNotification({
        tipo: 'sucesso',
        titulo: 'Alocação Ajustada com Sucesso',
        mensagem: 'O horário foi atualizado e a alteração foi registrada no Histórico de Auditoria.'
      });

      await loadAllData();
    } catch (err) {
      setNotification({
        tipo: 'erro',
        titulo: 'Erro ao Atualizar Alocação',
        mensagem: err.message || 'Não foi possível salvar o ajuste.'
      });
    }
  }

  const turmaSelecionada = turmas.find(t => t.id === selectedTurmaId) || turmas[0];
  const horariosDaTurma = horarios.filter(h => h.turma_id === selectedTurmaId);
  const versaoPublicada = versoes.find(v => v.status === 'publicada');
  const versaoRascunho = versoes.find(v => v.status === 'rascunho');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner da Coordenação */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              <span>Painel Geral da Coordenação • SENAI CIMATEC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Gestão Inteligente de Horários
            </h1>
            <p className="text-purple-100/90 text-sm mt-1">
              Coordenador: <strong>Prof. Celso Barreto</strong> • Período Letivo: <strong>2026.1</strong>
            </p>
          </div>

          {/* Botões de Ação Chave da Coordenação */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateSchedule}
              disabled={generating}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{generating ? 'Calculando Grade...' : 'Gerar Proposta Inteligente (CSP)'}</span>
            </button>

            <button
              onClick={handlePublishVersion}
              disabled={publishing}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{publishing ? 'Publicando...' : 'Homologar & Publicar Grade'}</span>
            </button>

            <ExportPdfButton
              targetElementId="grade-coordenador-container"
              filename={`grade-geral-${turmaSelecionada?.nome?.toLowerCase().replace(/\s+/g, '-') || 'turma'}.pdf`}
            />
          </div>
        </div>

        {/* Status das Versões */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-purple-300">Versão Oficial Vigente:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              {versaoPublicada ? `${versaoPublicada.periodo} (Publicada)` : 'Nenhuma'}
            </span>
          </div>

          {versaoRascunho && (
            <div className="flex items-center space-x-2">
              <span className="text-purple-300">Última Proposta:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {versaoRascunho.periodo} (Em Rascunho / Revisão)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notificação Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl border text-sm flex items-start justify-between shadow-xs ${notification.tipo === 'sucesso' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          <div>
            <h4 className="font-bold">{notification.titulo}</h4>
            <p className="text-xs mt-0.5 leading-relaxed">{notification.mensagem}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline ml-4 hover:opacity-80"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Relatório de Conflitos em Tempo Real */}
      <ConflictBadge conflitos={conflitos} />

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('grade')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'grade' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Editor de Grade Horária</span>
        </button>
        <button
          onClick={() => setActiveTab('salas')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'salas' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Ocupação das Salas (Diferencial)</span>
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'historico' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <History className="w-4 h-4" />
          <span>Histórico de Auditoria</span>
        </button>
        <button
          onClick={() => setActiveTab('cadastros')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'cadastros' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Layers className="w-4 h-4" />
          <span>Cadastros Acadêmicos</span>
        </button>
      </div>

      {/* ABA 1: EDITOR DE GRADE HORÁRIA */}
      {activeTab === 'grade' && (
        <div id="grade-coordenador-container" className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Visualização e Ajuste Manual da Grade</span>
              </h2>
              <p className="text-xs text-slate-500">
                Passe o mouse sobre qualquer aula e clique no ícone de lápis para reatribuir sala, docente ou horário
              </p>
            </div>

            {/* Seletor de Turmas */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500">Turma:</span>
              <select
                value={selectedTurmaId}
                onChange={e => setSelectedTurmaId(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm font-bold border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-600"
              >
                {turmas.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nome} ({t.turno})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">Carregando horários...</div>
          ) : (
            <TimetableGrid
              horarios={horariosDaTurma}
              turno={turmaSelecionada?.turno || 'matutino'}
              onEditSlot={setEditingSlot}
              isCoordinator={true}
            />
          )}
        </div>
      )}

      {/* ABA 2: OCUPAÇÃO DE SALAS */}
      {activeTab === 'salas' && (
        <OccupancyChart ocupacaoData={ocupacaoData} />
      )}

      {/* ABA 3: HISTÓRICO DE AUDITORIA */}
      {activeTab === 'historico' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <History className="w-5 h-5 text-purple-600" />
              <span>Registro de Alterações e Auditoria (Módulo 6)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rastreabilidade imutável de todas as modificações de alocação, geração e publicação
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase font-bold">
                  <th className="py-3 px-4">Data / Hora</th>
                  <th className="py-3 px-4">Operação</th>
                  <th className="py-3 px-4">Usuário</th>
                  <th className="py-3 px-4">Detalhes da Modificação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {historico.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Nenhum registro de auditoria no momento.
                    </td>
                  </tr>
                ) : (
                  historico.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {new Date(h.data).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-700 whitespace-nowrap">
                        {h.operacao}
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {h.usuario_id?.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-sans text-[11px] max-w-md truncate">
                        {JSON.stringify(h.valores_alterados)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 4: CADASTROS ACADÊMICOS */}
      {activeTab === 'cadastros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Turmas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Turmas Cadastradas ({turmas.length})</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {turmas.map(t => (
                <div key={t.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-800">{t.nome}</strong>
                    <span className="block text-[11px] text-slate-500">Período: {t.periodo_letivo}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold capitalize text-slate-600">
                    {t.turno}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Salas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Salas & Laboratórios ({salas.length})</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {salas.map(s => (
                <div key={s.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-800">{s.identificacao}</strong>
                    <span className="block text-[11px] text-slate-500">{s.tipo}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold">
                    {s.capacidade} alunos
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Professores */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Corpo Docente ({professores.length})</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {professores.map(p => (
                <div key={p.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-800">{p.nome}</strong>
                    <span className="block text-[11px] text-slate-500">{p.especialidade}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{p.matricula}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disciplinas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Disciplinas Ofertadas ({disciplinas.length})</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {disciplinas.map(d => (
                <div key={d.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-800">{d.nome}</strong>
                    <span className="block text-[11px] text-slate-500">Carga Horária: {d.carga_horaria}h</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono font-bold">
                    {d.codigo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Slot */}
      {editingSlot && (
        <EditSlotModal
          slot={editingSlot}
          salas={salas}
          professores={professores}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlot}
        />
      )}
    </div>
  );
}

