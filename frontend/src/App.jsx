// ====================================================================
// SUCELSO TECH - Aplicação Principal React (Roteamento por Perfil)
// ====================================================================

import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-300">Carregando SUCELSO TECH...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pb-12">
        {user.perfil === 'coordenador' && <CoordinatorDashboard />}
        {user.perfil === 'professor' && <TeacherDashboard />}
        {user.perfil === 'aluno' && <StudentDashboard />}
      </main>

      {/* Rodapé Institucional */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="font-semibold text-slate-700">
            SUCELSO TECH • Sistema Inteligente de Horários Escolares
          </p>
          <p>
            Universidade SENAI CIMATEC • Curso de Engenharia de Computação • Prof. Celso Barreto
          </p>
          <p className="text-slate-400 text-[11px] pt-1">
            Backend: Node.js/Express (Render) • Banco: PostgreSQL (Supabase) • Frontend: React/Tailwind (Vercel)
          </p>
        </div>
      </footer>
    </div>
  );
}

