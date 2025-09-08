import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx'; // Importe a nova página
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import AppLayout from './components/AppLayout.jsx';
import { PageSpinner } from './components/Spinner.jsx';

// Componente para proteger rotas que exigem autenticação
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageSpinner />;
  }

  if (!user) {
    // Se não estiver logado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, mostra o conteúdo da rota protegida
  return children;
}

// O componente principal agora gerencia as rotas
function AppContent() {
    const { user, role, loading } = useAuth();
    
    if (loading) {
        return <PageSpinner />;
    }

    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />

            {/* Rota Raiz e Protegida */}
            <Route 
                path="/*"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
                        </AppLayout>
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
}

// O App raiz continua o mesmo
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}