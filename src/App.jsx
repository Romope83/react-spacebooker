import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';

// --- SEÇÃO DE ÍCONES SVG ---
// Para manter o projeto simples e contido em um único arquivo, os ícones são definidos
// como componentes de função que retornam SVG inline. Isso evita a necessidade de
// instalar e gerenciar bibliotecas de ícones externas.

function CalendarIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>; }
function UsersIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>; }
function PlusIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>; }
function LogoutIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>; }
function OfficeBuildingIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2H5a1 1 0 110-2V4zm3 1a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>; }
function TrashIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>; }
function PencilIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>; }
function ChevronLeftIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>; }
function ChevronRightIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>; }


// --- SEÇÃO DE SIMULAÇÃO DO CLIENTE SUPABASE ---
// Para agilizar o desenvolvimento do frontend, criamos um objeto 'mock' que simula
// a API do Supabase. Ele retorna dados pré-definidos e imita o comportamento assíncrono
// com `setTimeout`, permitindo que a interface seja construída e testada sem uma conexão real.

// Banco de dados em memória para a simulação
const mockDb = {
  spaces: [
    { id: 1, name: 'Sala de Reunião A', capacity: 10, resources: 'Projetor, Quadro Branco' },
    { id: 2, name: 'Escritório Privativo 1', capacity: 4, resources: 'Monitores, Dockstation' },
    { id: 3, name: 'Estúdio de Gravação', capacity: 3, resources: 'Microfone, Câmera' },
  ],
  reservations: [
      { id: 101, space_id: 1, user_id: 'user-uuid', user_email: 'user@spacebooker.com', date: '2025-09-15', start_time: '14:00', end_time: '15:00', space_name: 'Sala de Reunião A' },
      { id: 102, space_id: 2, user_id: 'admin-uuid', user_email: 'admin@spacebooker.com', date: '2025-09-16', start_time: '10:00', end_time: '12:00', space_name: 'Escritório Privativo 1' },
      { id: 103, space_id: 1, user_id: 'user-uuid', user_email: 'user@spacebooker.com', date: '2025-09-16', start_time: '16:00', end_time: '17:00', space_name: 'Sala de Reunião A' },
  ]
};

// Objeto que imita a estrutura e os métodos do cliente Supabase
const mockSupabaseClient = {
  auth: {
    async signInWithPassword({ email, password }) {
      await new Promise(res => setTimeout(res, 500)); // Simula a latência da rede
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
    onAuthStateChange(callback) { 
      // Esta função é mais complexa na vida real, mas aqui apenas retornamos um objeto de desinscrição vazio.
      return { data: { subscription: { unsubscribe: () => {} } } }; 
    },
  },
  from: (tableName) => {
    const table = mockDb[tableName] || [];
    
    // O padrão 'builder' é usado para encadear métodos como .select().eq() etc.
    const builder = (currentData) => ({
      select: () => builder(currentData),
      insert: (newData) => {
        const newItem = { id: Date.now(), ...newData }; // Gera um ID único simples
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
      // O método .then é o que finalmente resolve a 'Promise' e retorna os dados.
      then: (resolve) => {
        setTimeout(() => resolve({ data: JSON.parse(JSON.stringify(currentData)), error: null }), 300);
      }
    });

    return builder(table);
  },
};
// Em um projeto real, você inicializaria o cliente Supabase aqui. Para o desenvolvimento, usamos o mock.
const supabase = mockSupabaseClient;

// --- SEÇÃO DE CONTEXTO DE AUTENTICAÇÃO ---
// A Context API do React é usada para gerenciar o estado de autenticação globalmente,
// evitando a necessidade de passar props (prop drilling) por múltiplos níveis de componentes.

const AuthContext = createContext(null);

/**
 * Provedor de Autenticação
 * @param {{children: React.ReactNode}} props
 * Este componente envolve a aplicação e fornece o contexto de autenticação.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para realizar o login do usuário
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

  // Função para realizar o logout do usuário
  const logout = async () => {
    setUser(null);
    setRole(null);
    await supabase.auth.signOut();
  };

  // O `useMemo` otimiza o desempenho, garantindo que o objeto de contexto
  // só seja recriado quando um de seus valores (user, role, loading) mudar.
  const value = useMemo(() => ({ user, role, loading, login, logout }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook customizado para acessar facilmente o contexto de autenticação
 * @returns {{user: object, role: string, loading: boolean, login: Function, logout: Function}}
 */
export const useAuth = () => useContext(AuthContext);

// --- SEÇÃO DE COMPONENTES DE UI REUTILIZÁVEIS ---

/** Componente de spinner para botões e ações em andamento */
const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

/** Componente de spinner para carregamento de páginas inteiras */
const PageSpinner = () => <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div></div>;

/** Componente de Modal genérico para pop-ups */
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

// --- SEÇÃO DE PÁGINAS E COMPONENTES PRINCIPAIS ---

/** Componente da Página de Login */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  // Facilita os testes ao preencher automaticamente as credenciais de admin ou usuário
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
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


/** Componente do Calendário de Disponibilidade */
const CalendarView = ({ reservations }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // Setembro de 2025 para corresponder aos dados de exemplo

  // `useMemo` é usado aqui para otimizar o desempenho, recalculando as reservas por data
  // apenas quando a lista de 'reservations' mudar.
  const reservationsByDate = useMemo(() => {
    return reservations.reduce((acc, res) => {
      (acc[res.date] = acc[res.date] || []).push(res);
      return acc;
    }, {});
  }, [reservations]);

  // Funções para navegar entre os meses
  const changeMonth = (amount) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };
  
  // Lógica para renderizar a grade do calendário
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    // Adiciona células vazias para os dias da semana antes do dia 1
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.push(<div key={`empty-start-${i}`} className="border rounded-md p-2 h-24"></div>);
    }

    // Renderiza cada dia do mês
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayReservations = reservationsByDate[dateStr] || [];
      const hasReservations = dayReservations.length > 0;
      
      days.push(
        <div key={day} className={`border rounded-md p-2 h-24 text-sm relative transition-colors duration-200 ${hasReservations ? 'bg-blue-50' : 'bg-white'}`}>
          <span className="font-semibold">{day}</span>
          {hasReservations && (
            <div className="mt-1 space-y-1">
              {dayReservations.slice(0, 2).map(r => (
                 <div key={r.id} className="bg-blue-200 text-blue-800 p-1 rounded text-xs truncate" title={`${r.space_name} (${r.start_time}-${r.end_time})`}>
                    {r.space_name}
                 </div>
              ))}
               {dayReservations.length > 2 && <div className="text-xs text-gray-500">...mais</div>}
            </div>
          )}
        </div>
      );
    }
    return days;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ChevronLeftIcon /></button>
        <h2 className="text-xl font-semibold">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ChevronRightIcon /></button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-600 font-bold mb-2">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>
    </div>
  )
}

/** Componente do Painel do Administrador */
const AdminDashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(null); // Para edição ou criação

  // Função para buscar todos os dados necessários para o admin
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

  const handleEdit = (space) => { setCurrentSpace(space); setIsModalOpen(true); };
  const handleAddNew = () => { setCurrentSpace(null); setIsModalOpen(true); };

  const handleDelete = async (spaceId) => {
    if (window.confirm('Tem certeza que deseja apagar este espaço e todas as suas reservas associadas?')) {
      await supabase.from('spaces').delete().eq('id', spaceId);
      fetchData(); // Recarrega os dados para refletir a remoção
    }
  };
  
  const handleCancelReservation = async (reservationId) => {
     if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      await supabase.from('reservations').delete().eq('id', reservationId);
      fetchData();
    }
  }

  // Lida tanto com a criação de um novo espaço quanto com a atualização de um existente
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
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Painel do Administrador</h1>
      <CalendarView reservations={reservations} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card de Gerenciamento de Espaços */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Espaços</h2>
            <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"><PlusIcon /> Adicionar</button>
          </div>
          <ul className="space-y-3">
            {spaces.map(space => (
              <li key={space.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{space.name}</p>
                  <p className="text-sm text-gray-600">Capacidade: {space.capacity} | Recursos: {space.resources}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(space)} className="p-2 text-blue-600 hover:text-blue-800 transition-colors"><PencilIcon /></button>
                  <button onClick={() => handleDelete(space.id)} className="p-2 text-red-600 hover:text-red-800 transition-colors"><TrashIcon /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Card de Gerenciamento de Reservas */}
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
                <button onClick={() => handleCancelReservation(res.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors">Cancelar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
       <SpaceFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} space={currentSpace} />
    </div>
  );
};

/** Componente do Modal para Adicionar/Editar Espaços */
const SpaceFormModal = ({ isOpen, onClose, onSave, space }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [resources, setResources] = useState('');

  // `useEffect` para preencher o formulário quando um espaço é passado para edição
  useEffect(() => {
    if (space) {
      setName(space.name);
      setCapacity(space.capacity);
      setResources(space.resources);
    } else {
      // Limpa o formulário para adicionar um novo espaço
      setName('');
      setCapacity('');
      setResources('');
    }
  }, [space, isOpen]); // Roda o efeito quando `space` ou `isOpen` mudam

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, capacity: parseInt(capacity), resources });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={space ? "Editar Espaço" : "Adicionar Novo Espaço"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Espaço</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Capacidade Máxima</label>
          <input type="number" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Recursos Disponíveis</label>
          <input type="text" value={resources} onChange={e => setResources(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Projetor, Ar Condicionado" required />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors">Cancelar</button>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}

/** Componente do Painel do Usuário */
const UserDashboard = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  // Função para buscar todos os dados necessários para a visão do usuário
  const fetchData = async () => {
    setLoading(true);
    // Busca todos os espaços disponíveis para reserva
    const { data: spacesData } = await supabase.from('spaces').select();
    // Busca todas as reservas para popular o calendário de disponibilidade
    const { data: allReservationsData } = await supabase.from('reservations').select();
    // Filtra apenas as reservas do usuário que está logado
    const userReservations = allReservationsData.filter(r => r.user_id === user.id);
    
    setSpaces(spacesData);
    setAllReservations(allReservationsData);
    setMyReservations(userReservations);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
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
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Painel do Usuário</h1>
      <CalendarView reservations={allReservations} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card de Espaços Disponíveis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Espaços Disponíveis para Reservar</h2>
           <ul className="space-y-3">
            {spaces.map(space => (
              <li key={space.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{space.name}</p>
                  <p className="text-sm text-gray-600">Capacidade: {space.capacity}</p>
                  <p className="text-sm text-gray-600">Recursos: {space.resources}</p>
                </div>
                <button onClick={() => handleBookNow(space)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">Reservar</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Card de Minhas Reservas */}
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
                  <button onClick={() => handleCancelReservation(res.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors">Cancelar</button>
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

/** Componente do Modal para Fazer uma Reserva */
const ReservationFormModal = ({ isOpen, onClose, onSave, space }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Preenche o formulário com valores padrão para facilitar o teste
  useEffect(() => {
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Reservar o espaço: ${space.name}`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Data da Reserva</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Início</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Fim</label>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors">Cancelar</button>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">Confirmar Reserva</button>
        </div>
      </form>
    </Modal>
  )
};

/** Componente de Layout Principal da Aplicação */
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">SpaceBooker</div>
          <div className="flex items-center">
             <span className="text-gray-700 mr-4">Olá, {user.email}</span>
             <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full focus:outline-none focus:shadow-outline transition-colors" title="Sair"><LogoutIcon /></button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

// --- ESTRUTURA PRINCIPAL DO APP ---
// O App é o ponto de entrada. Ele envolve a lógica principal com o AuthProvider.
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

// O componente Main decide qual página renderizar com base no estado de autenticação.
const Main = () => {
    const { user, role, loading } = useAuth();
    
    // Mostra um spinner de página inteira enquanto a autenticação inicial pode estar a acontecer
    if (loading) {
        return <PageSpinner />;
    }

    // Se não houver usuário, mostra a página de login
    if (!user) {
        return <LoginPage />;
    }

    // Determina qual painel mostrar com base no papel do usuário
    let dashboardComponent;
    if (role === 'admin') {
        dashboardComponent = <AdminDashboard />;
    } else if (role === 'user') {
        dashboardComponent = <UserDashboard />;
    } else {
        // Fallback para um papel desconhecido
        dashboardComponent = <div>Papel de usuário desconhecido.</div>;
    }

    // Envolve o painel correto com o layout principal da aplicação
    return <AppLayout>{dashboardComponent}</AppLayout>;
}

