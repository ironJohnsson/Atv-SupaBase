// ====================================================================
// SUCELSO TECH - Barra de Navegação Superior (Header)
// ====================================================================

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, GraduationCap, BookOpen, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, quickLogin } = useAuth();

  const roleBadgeColors = {
    coordenador: 'bg-purple-100 text-purple-800 border-purple-300',
    professor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    aluno: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const roleIcons = {
    coordenador: <Shield className="w-3.5 h-3.5" />,
    professor: <BookOpen className="w-3.5 h-3.5" />,
    aluno: <GraduationCap className="w-3.5 h-3.5" />
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Identidade do Projeto */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  SUCELSO<span className="text-blue-600">TECH</span>
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                  2026.1
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                SENAI CIMATEC • Engenharia de Computação • Prof. Celso Barreto
              </p>
            </div>
          </div>

          {/* Troca Rápida de Perfil (Banca Avaliadora) e Usuário */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Seletor rápido de perfil para demonstração */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="px-2 text-slate-500 font-medium">Trocar Perfil:</span>
              <button
                onClick={() => quickLogin('coordenador')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${user?.perfil === 'coordenador' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Coordenador
              </button>
              <button
                onClick={() => quickLogin('professor')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${user?.perfil === 'professor' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Professor (Seg/Qua)
              </button>
              <button
                onClick={() => quickLogin('aluno')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${user?.perfil === 'aluno' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Aluno
              </button>
            </div>

            {/* Dados do Usuário Logado */}
            {user && (
              <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-slate-800 leading-none">{user.nome}</p>
                  <p className="text-xs text-slate-500 leading-none mt-1">{user.email}</p>
                </div>
                <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeColors[user.perfil] || 'bg-slate-100 text-slate-700'}`}>
                  {roleIcons[user.perfil]}
                  <span className="capitalize">{user.perfil}</span>
                </div>
              </div>
            )}

            {/* Botão de Logout */}
            <button
              onClick={logout}
              title="Sair do sistema"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

