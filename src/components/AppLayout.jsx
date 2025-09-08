import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogoutIcon } from './Icons';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  // Se o usuário for nulo (durante o logout), o componente não tenta renderizar nada,
  // evitando o erro "Cannot read properties of null".
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">SpaceBooker</div>
          <div className="flex items-center gap-4">
             <span className="text-gray-700 hidden sm:block">Olá, {user.email}</span>
             <button 
               onClick={logout} 
               className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:shadow-outline"
             >
               <LogoutIcon />
               <span>Sair</span>
             </button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}