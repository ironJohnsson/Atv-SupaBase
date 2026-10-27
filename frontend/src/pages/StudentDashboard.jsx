// ====================================================================
// SUCELSO TECH - Painel do Aluno (Visualização Somente Leitura)
// ====================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import TimetableGrid from '../components/TimetableGrid';
import ExportPdfButton from '../components/ExportPdfButton';
import { GraduationCap, Calendar, CheckCircle2, BookOpen, MapPin, User, ShieldCheck } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [turmaData, setTurmaData] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [versao, setVersao] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHorarios() {
      setLoading(true);
      setError('');
      try {
        const res = await apiRequest('/horarios/minha-turma');
        if (res.success) {
          setTurmaData(res.turma);
          setHorarios(res.horarios || []);
          setVersao(res.versao);
        }
      } catch (err) {
        setError(err.message || 'Falha ao carregar horários da turma.');
      } finally {
        setLoading(false);
      }
    }

    fetchHorarios();
  }, []);

  // Extrair lista única de disciplinas desta grade
  const disciplinasUnicas = Array.from(
    new Map(horarios.map(h => [h.disciplina_id, h])).values()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner de Boas-vindas e Identificação */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Portal Acadêmico do Aluno • SENAI CIMATEC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Olá, {user?.nome || 'Estudante'}!
            </h1>
            <p className="text-blue-100/90 text-sm mt-1 max-w-2xl">
              Matrícula: <strong>{user?.matricula || 'ALU-EC-001'}</strong> • Turma: <strong>{turmaData?.nome || 'Engenharia de Computação - 5º Semestre'}</strong> ({turmaData?.turno || 'Matutino'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Grade Homologada e Oficial (2026.1)</span>
            </div>
            <ExportPdfButton
              targetElementId="grade-aluno-container"
              filename={`grade-horaria-${(turmaData?.nome || 'minha-turma').toLowerCase().replace(/\s+/g, '-')}.pdf`}
            />
          </div>
        </div>

        {/* Notificação de Permissão Fundamental */}
        <div className="mt-4 pt-4 border-t border-white/15 flex items-center space-x-2 text-xs text-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
          <span>
            <strong>Regra Fundamental do Sistema:</strong> Perfil Aluno possui exclusivamente permissão de leitura. Alterações na grade só podem ser homologadas pela coordenação.
          </span>
        </div>
      </div>

      {/* Grade Semanal */}
      <div id="grade-aluno-container" className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Horário Semanal de Aulas</span>
            </h2>
            <p className="text-xs text-slate-500">
              Grade curricular oficial organizada por blocos com intervalos de convivência respeitados
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Turno: {turmaData?.turno === 'vespertino' ? 'Vespertino (13h às 17h)' : 'Matutino (08h às 12h)'}</span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            Carregando sua grade horária oficial...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        ) : (
          <TimetableGrid
            horarios={horarios}
            turno={turmaData?.turno || 'matutino'}
            isCoordinator={false}
          />
        )}
      </div>

      {/* Relação de Disciplinas e Docentes da Turma */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Disciplinas e Professores Atribuídos</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplinasUnicas.map(d => (
            <div key={d.disciplina_id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {d.disciplina_codigo || 'DISC'}
                </span>
                <span className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{d.sala_identificacao}</span>
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">{d.disciplina_nome}</h4>
              <p className="text-xs text-slate-600 mt-2 flex items-center space-x-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Prof. {d.professor_nome}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

