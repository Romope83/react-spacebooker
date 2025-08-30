import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';

// --- ÍCONES SVG ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const OfficeBuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2H5a1 1 0 110-2V4zm3 1a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;

// --- SIMULAÇÃO DO CLIENTE SUPABASE ---
const mockSupabaseClient = {
  auth: {
    async signInWithPassword({ email, password }) {
      await new Promise(res => setTimeout(res, 500));
      if (email === 'admin@spacebooker.com' && password === 'admin123') {
        return { data: { user: { id: 'admin-uuid', email, app_metadata: { role: 'admin' } } }, error: null };
      }
      if (email === 'user@spacebooker.com' && password === 'user123') {
        return { data: { user: { id: 'user-uuid', email, app_metadata: { role: 'user' } } }, error: null };
      }
      return { data: null, error: { message: 'Credenciais inválidas' } };
    },
    async signOut() {
      await new Promise(res => setTimeout(res, 300));
      return { error: null };
    },
    async onAuthStateChange(callback) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
  from: (tableName) => {
    if (!mockSupabaseClient._db) {
        mockSupabaseClient._db = {
          spaces: [ { id: 1, name: 'Sala de Reunião A', capacity: 10, resources: 'Projetor, Quadro Branco' }, { id: 2, name: 'Escritório Privativo 1', capacity: 4, resources: 'Monitores, Dockstation' }, { id: 3, name: 'Estúdio de Gravação', capacity: 3, resources: 'Microfone, Câmera' }, ],
          reservations: [ { id: 101, space_id: 1, user_id: 'user-uuid', user_email: 'user@spacebooker.com', date: '2025-09-15', start_time: '14:00', end_time: '15:00', space_name: 'Sala de Reunião A' }, { id: 102, space_id: 2, user_id: 'admin-uuid', user_email: 'admin@spacebooker.com', date: '2025-09-16', start_time: '10:00', end_time: '12:00', space_name: 'Escritório Privativo 1' }, ]
        };
    }
    let table = mockSupabaseClient._db[tableName] || [];
    return {
      select() { let queryData = JSON.parse(JSON.stringify(table)); const queryBuilder = { eq: (column, value) => { queryData = queryData.filter(item => item[column] === value); return queryBuilder; }, then: (resolve) => { setTimeout(() => resolve({ data: queryData, error: null }), 400); } }; return queryBuilder; },
    };
  },
};
const supabase = mockSupabaseClient;

// --- CONTEXTO DE AUTENTICAÇÃO ---
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
    } else {
      setUser(data.user);
      setRole(data.user.app_metadata.role);
    }
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({ user, role, loading, login, logout, }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// --- COMPONENTES DA UI ---

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
);

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  const setDemoCredentials = (type) => {
    if(type === 'admin') {
      setEmail('admin@spacebooker.com');
      setPassword('admin123');
    } else {
      setEmail('user@spacebooker.com');
      setPassword('user123');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600">SpaceBooker</h1>
            <p className="text-gray-500">Gestão de Reservas para Espaços Compartilhados</p>
        </div>
        <form onSubmit={handleLogin}>
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
              {loading ? <Spinner /> : 'Entrar'}
            </button>
          </div>
        </form>
         <div className="mt-4 text-center text-sm text-gray-600">
            <p>Use as credenciais de demonstração:</p>
            <div className="flex justify-center gap-2 mt-2">
                <button onClick={() => setDemoCredentials('admin')} className="text-indigo-600 hover:underline">Logar como Admin</button>
                <span>|</span>
                <button onClick={() => setDemoCredentials('user')} className="text-indigo-600 hover:underline">Logar como Usuário</button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

const Main = () => {
    const { user } = useAuth();
    // Por enquanto, o Dashboard é apenas um placeholder.
    const Dashboard = () => (
        <div className="p-8">
            <h1 className="text-2xl">Dashboard (Em breve)</h1>
            <p>Bem-vindo, {user.email}!</p>
        </div>
    );
    return user ? <Dashboard /> : <LoginPage />;
}

