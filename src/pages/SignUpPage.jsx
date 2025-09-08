import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';
import { Link } from 'react-router-dom'; // Para navegar de volta ao login

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, loading } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    await signUp(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600">Criar Conta</h1>
            <p className="text-gray-500">Junte-se ao SpaceBooker</p>
        </div>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex justify-center items-center disabled:bg-indigo-400">
              {loading ? <Spinner /> : 'Cadastrar'}
            </button>
          </div>
        </form>
         <div className="mt-6 text-center text-sm text-gray-600">
            <p>
                Já tem uma conta?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                    Faça o login
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};