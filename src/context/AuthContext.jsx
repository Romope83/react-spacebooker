import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { supabase } from '../api/supabaseClient.js';

// Cria o contexto que irá partilhar os dados de autenticação
const AuthContext = createContext(null);

/**
 * Provedor de Autenticação
 * Este componente envolve a aplicação e fornece o contexto de autenticação a todos os
 * componentes descendentes. Ele gere o estado do utilizador (logado/deslogado), o seu papel
 * e o estado de carregamento.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  // Inicia como `true` para mostrar um spinner enquanto verifica a sessão inicial.
  const [loading, setLoading] = useState(true);

  // O `useEffect` é a forma correta de lidar com a sessão do Supabase.
  // Ele corre uma vez quando o componente é montado.
  useEffect(() => {
    // Pega a sessão atual do utilizador, se existir (ex: se ele não fez logout da última vez)
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // O `app_metadata` contém o nosso 'role' personalizado.
        setRole(session.user.app_metadata?.role || null);
      }
      setLoading(false);
    };

    getSession();

    // `onAuthStateChange` é um "ouvinte" que reage a eventos de login, logout, etc.
    // Esta é a forma mais robusta de manter o estado da UI sincronizado com o Supabase.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true);
      if (session) {
        setUser(session.user);
        setRole(session.user.app_metadata?.role || null);
      } else {
        // Se a sessão for nula (após um logout), limpa o estado.
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado para evitar leaks de memória.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função para realizar o login do utilizador.
  const login = async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error.message);
      alert(error.message);
    }
    // Não precisamos de definir o utilizador/papel aqui, pois o `onAuthStateChange` irá tratar disso automaticamente.
    setLoading(false);
  };

  // Função para realizar o logout do utilizador.
  const logout = async () => {
    await supabase.auth.signOut();
    // O `onAuthStateChange` também irá detetar o logout e limpar o estado.
  };

  // `useMemo` otimiza o desempenho, recriando o objeto de contexto apenas quando necessário.
  const value = useMemo(
    () => ({ user, role, loading, login, logout }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook customizado para aceder facilmente ao contexto de autenticação de qualquer componente.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

