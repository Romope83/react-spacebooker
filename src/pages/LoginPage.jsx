import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-indigo-600">SpaceBooker</h1>
            <p className="text-slate-500 mt-2">Gestão de Reservas para Espaços Compartilhados</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
              required 
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="password">Senha</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
              required 
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex justify-center items-center disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Spinner /> : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-200 pt-6">
            <p>
                Não tem uma conta?{' '}
                <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                    Cadastre-se
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};