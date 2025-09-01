import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';

// --- ÍCONES SVG ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const OfficeBuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2H5a1 1 0 110-2V4zm3 1a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;

// --- SIMULAÇÃO DO CLIENTE SUPABASE (EXPANDIDO) ---
const mockDb = {
  spaces: [
    { id: 1, name: 'Sala de Reunião A', capacity: 10, resources: 'Projetor, Quadro Branco' },
    { id: 2, name: 'Escritório Privativo 1', capacity: 4, resources: 'Monitores, Dockstation' },
    { id: 3, name: 'Estúdio de Gravação', capacity: 3, resources: 'Microfone, Câmera' },
  ],
  reservations: [
      { id: 101, space_id: 1, user_id: 'user-uuid', user_email: 'user@spacebooker.com', date: '2025-09-15', start_time: '14:00', end_time: '15:00', space_name: 'Sala de Reunião A' },
      { id: 102, space_id: 2, user_id: 'admin-uuid', user_email: 'admin@spacebooker.com', date: '2025-09-16', start_time: '10:00', end_time: '12:00', space_name: 'Escritório Privativo 1' },
  ]
};

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
      return { data: { user: null }, error: { message: 'Credenciais inválidas' } };
    },
    async signOut() {
      await new Promise(res => setTimeout(res, 300));
      return { error: null };
    },
    onAuthStateChange(callback) { return { data: { subscription: { unsubscribe: () => {} } } }; },
  },
  from: (tableName) => {
    const table = mockDb[tableName] || [];
    
    const builder = (currentData) => ({
      select: () => builder(currentData),
      insert: (newData) => {
        const newItem = { id: Date.now(), ...newData };
        mockDb[tableName].push(newItem);
        return builder([newItem]);
      },
      update: (updatedData) => ({
        eq: (column, value) => {
          mockDb[tableName] = mockDb[tableName].map(item => 
            item[column] === value ? { ...item, ...updatedData } : item
          );
          const updatedItems = mockDb[tableName].filter(item => item[column] === value);
          return builder(updatedItems);
        }
      }),
      delete: () => ({
        eq: (column, value) => {
          const deletedItems = mockDb[tableName].filter(item => item[column] === value);
          mockDb[tableName] = mockDb[tableName].filter(item => item[column] !== value);
          return builder(deletedItems);
        }
      }),
      eq: (column, value) => {
        const filteredData = currentData.filter(item => item[column] === value);
        return builder(filteredData);
      },
      then: (resolve) => {
        setTimeout(() => resolve({ data: JSON.parse(JSON.stringify(currentData)), error: null }), 300);
      }
    });

    return builder(table);
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

// --- COMPONENTES DA UI ---

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const PageSpinner = () => <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div></div>;

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


const AdminDashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: spacesData } = await supabase.from('spaces').select();
    const { data: reservationsData } = await supabase.from('reservations').select();
    setSpaces(spacesData);
    setReservations(reservationsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (space) => {
    setCurrentSpace(space);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setCurrentSpace(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (spaceId) => {
    if (window.confirm('Tem certeza que deseja apagar este espaço?')) {
      await supabase.from('spaces').delete().eq('id', spaceId);
      fetchData();
    }
  };
  
  const handleCancelReservation = async (reservationId) => {
     if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      await supabase.from('reservations').delete().eq('id', reservationId);
      fetchData();
    }
  }

  const handleSave = async (spaceData) => {
    if (currentSpace) {
      await supabase.from('spaces').update(spaceData).eq('id', currentSpace.id);
    } else {
      await supabase.from('spaces').insert(spaceData);
    }
    fetchData();
    setIsModalOpen(false);
  };
  
  if (loading) return <PageSpinner />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Painel do Administrador</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gerenciamento de Espaços */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Espaços</h2>
            <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"><PlusIcon /> Adicionar</button>
          </div>
          <ul className="space-y-3">
            {spaces.map(space => (
              <li key={space.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{space.name}</p>
                  <p className="text-sm text-gray-600">Capacidade: {space.capacity} | Recursos: {space.resources}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(space)} className="p-2 text-blue-600 hover:text-blue-800"><PencilIcon /></button>
                  <button onClick={() => handleDelete(space.id)} className="p-2 text-red-600 hover:text-red-800"><TrashIcon /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Gerenciamento de Reservas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Todas as Reservas</h2>
          <ul className="space-y-3">
             {reservations.map(res => (
              <li key={res.id} className="border p-4 rounded-lg flex justify-between items-center">
                 <div>
                  <p className="font-bold">{res.space_name}</p>
                  <p className="text-sm text-gray-600">Usuário: {res.user_email}</p>
                  <p className="text-sm text-gray-600">Data: {res.date} | Horário: {res.start_time} - {res.end_time}</p>
                </div>
                <button onClick={() => handleCancelReservation(res.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Cancelar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
       <SpaceFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} space={currentSpace} />
    </div>
  );
};

const SpaceFormModal = ({ isOpen, onClose, onSave, space }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [resources, setResources] = useState('');

  useEffect(() => {
    if (space) {
      setName(space.name);
      setCapacity(space.capacity);
      setResources(space.resources);
    } else {
      setName('');
      setCapacity('');
      setResources('');
    }
  }, [space]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, capacity: parseInt(capacity), resources });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={space ? "Editar Espaço" : "Adicionar Novo Espaço"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Capacidade</label>
          <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Recursos</label>
          <input type="text" value={resources} onChange={e => setResources(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Ex: Projetor, Ar Condicionado" required />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancelar</button>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: spacesData } = await supabase.from('spaces').select();
    const { data: reservationsData } = await supabase.from('reservations').select().eq('user_id', user.id);
    setSpaces(spacesData);
    setMyReservations(reservationsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleBookNow = (space) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (bookingDetails) => {
    const newReservation = {
      space_id: selectedSpace.id,
      user_id: user.id,
      user_email: user.email,
      space_name: selectedSpace.name,
      ...bookingDetails
    };
    await supabase.from('reservations').insert(newReservation);
    setIsModalOpen(false);
    fetchData(); // Recarrega os dados para mostrar a nova reserva
  };

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Tem certeza que deseja cancelar sua reserva?')) {
      await supabase.from('reservations').delete().eq('id', reservationId);
      fetchData(); // Recarrega os dados para remover a reserva cancelada
    }
  };

  if (loading) return <PageSpinner />;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Painel do Usuário</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Espaços Disponíveis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Espaços Disponíveis</h2>
           <ul className="space-y-3">
            {spaces.map(space => (
              <li key={space.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{space.name}</p>
                  <p className="text-sm text-gray-600">Capacidade: {space.capacity}</p>
                  <p className="text-sm text-gray-600">Recursos: {space.resources}</p>
                </div>
                <button onClick={() => handleBookNow(space)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Reservar</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Minhas Reservas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Minhas Reservas</h2>
          {myReservations.length > 0 ? (
            <ul className="space-y-3">
              {myReservations.map(res => (
                <li key={res.id} className="border p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold">{res.space_name}</p>
                    <p className="text-sm text-gray-600">Data: {res.date} | Horário: {res.start_time} - {res.end_time}</p>
                  </div>
                  <button onClick={() => handleCancelReservation(res.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Cancelar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Você ainda não fez nenhuma reserva.</p>
          )}
        </div>
      </div>
      <ReservationFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleConfirmBooking}
        space={selectedSpace}
      />
    </div>
  );
};

const ReservationFormModal = ({ isOpen, onClose, onSave, space }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  useEffect(() => {
      // Gera uma data padrão para o dia seguinte para facilitar testes
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ date, start_time: startTime, end_time: endTime });
  };

  if (!space) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reservar: ${space.name}`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Data</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Início</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Fim</label>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancelar</button>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirmar Reserva</button>
        </div>
      </form>
    </Modal>
  )
};

const AppLayout = ({ children }) => {
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

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

const Main = () => {
    const { user, role } = useAuth();

    if (!user) {
        return <LoginPage />;
    }

    let dashboardComponent;
    if (role === 'admin') {
        dashboardComponent = <AdminDashboard />;
    } else if (role === 'user') {
        dashboardComponent = <UserDashboard />;
    } else {
        dashboardComponent = <div>Papel de usuário desconhecido.</div>;
    }

    return <AppLayout>{dashboardComponent}</AppLayout>;
}

