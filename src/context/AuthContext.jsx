import React, { useState, createContext, useContext, useMemo } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error.message);
      alert(error.message);
    } else if(data.user) {
      setUser(data.user);
      setRole(data.user.app_metadata.role);
    } else {
        alert('Credenciais inválidas');
    }
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({ user, role, loading, login, logout }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
