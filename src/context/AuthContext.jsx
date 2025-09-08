import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { supabase } from '../api/supabaseClient.js';

// 1. Criação do Contexto
// Este é o objeto que será compartilhado com todos os componentes descendentes.
const AuthContext = createContext(null);

/**
 * 2. Provedor do Contexto (AuthProvider)
 * Este componente envolve a aplicação e gerencia todo o estado de autenticação.
 * É a fonte única de verdade sobre o usuário estar logado ou não.
 */
export const AuthProvider = ({ children }) => {
  // --- STATES ---
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  // Inicia como 'true' para mostrar um spinner na primeira carga da página.
  const [loading, setLoading] = useState(true);

  // --- EFEITO PARA GERENCIAR A SESSÃO ---
  // Este useEffect é o coração da autenticação. Ele roda uma vez quando o app carrega.
  useEffect(() => {
    // Pega a sessão ativa do Supabase, caso o usuário já estivesse logado.
    const getActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Atualiza o estado com os dados da sessão encontrada.
      setUser(session?.user ?? null);
      setRole(session?.user?.app_metadata?.role || 'user');
      
      // Finaliza o carregamento inicial.
      setLoading(false);
    };

    getActiveSession();

    // `onAuthStateChange` é um "ouvinte" que reage a eventos de autenticação
    // (LOGIN, LOGOUT, etc.) em tempo real. Esta é a forma correta de manter
    // a UI sincronizada com o estado de autenticação do Supabase.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setRole(session?.user?.app_metadata?.role || 'user');
    });

    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado
    // para evitar vazamentos de memória.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- FUNÇÕES DE AUTENTICAÇÃO ---

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Erro no login:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;

      if (data.user?.identities?.length === 0) {
        alert('Este email já está cadastrado, mas não foi confirmado. Verifique sua caixa de entrada.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // --- VALOR DO CONTEXTO ---
  // `useMemo` otimiza o desempenho, garantindo que o objeto de valor
  // só seja recriado quando os dados de autenticação realmente mudarem.
  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      login,
      signUp,
      logout,
    }),
    [user, role, loading]
  );

  // O Provedor disponibiliza o objeto 'value' para todos os componentes filhos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 3. Hook Customizado (useAuth)
 * Facilita o acesso ao contexto nos componentes, tornando o código mais limpo.
 * Em vez de importar `useContext` e `AuthContext` em todo lugar,
 * apenas importamos e usamos `useAuth()`.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};