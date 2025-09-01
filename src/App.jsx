import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import AppLayout from './components/AppLayout.jsx';
import { PageSpinner } from './components/Spinner.jsx';

// O componente Main usa o contexto de autenticação para decidir qual página mostrar.
const Main = () => {
    const { user, role, loading } = useAuth();
    
    // Mostra um spinner de carregamento enquanto a autenticação está a ser verificada.
    if (loading) {
        return <PageSpinner />;
    }

    // Se não houver utilizador logado, mostra a página de login.
    if (!user) {
        return <LoginPage />;
    }

    // Com base no papel ('role') do utilizador, decide qual painel mostrar.
    let dashboardComponent;
    if (role === 'admin') {
        dashboardComponent = <AdminDashboard />;
    } else if (role === 'user') {
        dashboardComponent = <UserDashboard />;
    } else {
        // Mostra uma mensagem de fallback se o papel não for reconhecido.
        dashboardComponent = <div>Papel de usuário desconhecido.</div>;
    }

    // Envolve o painel escolhido com o layout principal da aplicação (cabeçalho, etc.).
    return <AppLayout>{dashboardComponent}</AppLayout>;
}

// O componente App é o topo da nossa árvore de componentes.
// A sua única função é fornecer o AuthProvider para toda a aplicação.
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

