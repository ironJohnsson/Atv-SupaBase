// ====================================================================
// SUCELSO TECH - Contexto de Autenticação e Perfis
// ====================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sucelso_token') || null);
  const [loading, setLoading] = useState(true);

  // Inicializa sessão ao carregar a aplicação
  useEffect(() => {
    async function loadSession() {
      const savedToken = localStorage.getItem('sucelso_token');
      const savedUser = localStorage.getItem('sucelso_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Opcionalmente valida no backend
          const res = await apiRequest('/auth/me');
          if (res.usuario) {
            setUser(res.usuario);
            localStorage.setItem('sucelso_user', JSON.stringify(res.usuario));
          }
        } catch (err) {
          console.warn('Sessão expirada ou inválida, limpando...');
          logout();
        }
      }
      setLoading(false);
    }

    loadSession();
  }, []);

  async function login(email, senha) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, senha }
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.usuario);
      localStorage.setItem('sucelso_token', res.token);
      localStorage.setItem('sucelso_user', JSON.stringify(res.usuario));
      return res.usuario;
    }
    throw new Error(res.message || 'Falha ao autenticar.');
  }

  // Atalho de login rápido para testes da banca avaliadora
  async function quickLogin(role) {
    let email = 'coordenador@sucelso.tech';
    if (role === 'professor') {
      email = 'roberto@sucelso.tech'; // Prof. Roberto Lima (Restrição Seg/Qua)
    } else if (role === 'aluno') {
      email = 'lucas.aluno@sucelso.tech'; // Lucas Silva (Eng. Computação)
    }

    return await login(email, 'senha123');
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sucelso_token');
    localStorage.removeItem('sucelso_user');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

