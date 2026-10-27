// ====================================================================
// SUCELSO TECH - Tela de Autenticação e Seleção de Perfis
// ====================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Shield, BookOpen, GraduationCap, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, quickLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, senha);
    } catch (err) {
      setError(err.message || 'Falha ao autenticar. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  }

  async function handleQuick(role) {
    setError('');
    setLoading(true);
    try {
      await quickLogin(role);
    } catch (err) {
      setError(err.message || 'Falha no acesso rápido.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/30 mb-4">
          <Layers className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SUCELSO<span className="text-blue-400">TECH</span>
        </h1>
        <p className="mt-1 text-sm text-blue-200/80 font-medium">
          Sistema Inteligente de Horários Escolares • SENAI CIMATEC
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Engenharia de Computação • Prof. Celso Barreto
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                E-mail Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu.email@sucelso.tech"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Entrando...' : 'Acessar Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                Acesso Rápido para Avaliação
              </span>
            </div>
          </div>

          {/* Botões de Acesso Rápido para a Banca */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleQuick('coordenador')}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-950">Entrar como Coordenador</h4>
                  <p className="text-[11px] text-purple-700">Prof. Celso Barreto (Controle total da grade)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-purple-700 transition transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => handleQuick('professor')}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Entrar como Professor</h4>
                  <p className="text-[11px] text-emerald-700">Prof. Roberto Lima (Restrição Seg/Qua)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-700 transition transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => handleQuick('aluno')}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950">Entrar como Aluno</h4>
                  <p className="text-[11px] text-blue-700">Lucas Silva (Eng. Computação - Somente Leitura)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-700 transition transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Rodapé Informativo */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Stack: Node.js • Express • PostgreSQL (Supabase) • React (Vercel) • JWT RBAC
        </p>
      </div>
    </div>
  );
}

