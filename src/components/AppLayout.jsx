import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogoutIcon } from './Icons';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">SpaceBooker</div>
          <div className="flex items-center">
             <span className="text-gray-700 mr-4">Olá, {user.email}</span>
             <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full focus:outline-none focus:shadow-outline" title="Sair"><LogoutIcon /></button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
