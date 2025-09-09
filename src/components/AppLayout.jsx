import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogoutIcon } from './Icons';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">SpaceBooker</div>
          <div className="flex items-center gap-4">
             <span className="text-slate-600 hidden sm:block">
               Olá, <span className="font-medium text-slate-900">{user.email}</span>
             </span>
             <button 
               onClick={logout} 
               className="flex items-center gap-2 text-slate-600 hover:bg-slate-100 font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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