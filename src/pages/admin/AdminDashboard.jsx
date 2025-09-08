import React, { useState, useEffect } from 'react'; // Linha corrigida
import { supabase } from '../../api/supabaseClient';
import { PageSpinner } from '../../components/Spinner';
import CalendarView from '../../components/CalendarView';
import { PlusIcon, TrashIcon } from '../../components/Icons';

// --- Componente do Formulário ---
function CreateSpaceForm({ onSpaceCreated }) {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [resources, setResources] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('spaces')
        .insert([{ name, capacity: parseInt(capacity), resources }]);
      
      if (error) throw error;

      alert('Espaço criado com sucesso!');
      setName('');
      setCapacity('');
      setResources('');
      onSpaceCreated();
    } catch (error) {
      alert(`Erro ao criar espaço: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800"><PlusIcon /> Adicionar Novo Espaço</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700">Nome do Espaço</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">Capacidade</label>
          <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">Recursos (ex: Projetor, Wi-Fi)</label>
          <input type="text" value={resources} onChange={e => setResources(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
          {loading ? 'Salvando...' : 'Salvar Espaço'}
        </button>
      </form>
    </div>
  );
}

// --- Componente Principal do Painel ---
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [allReservations, setAllReservations] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: spacesData, error: spacesError } = await supabase.from('spaces').select('*').order('created_at', { ascending: false });
      if (spacesError) throw spacesError;
      setSpaces(spacesData || []);

      const { data: reservationsData, error: reservationsError } = await supabase.from('reservations').select('*');
      if (reservationsError) throw reservationsError;
      setAllReservations(reservationsData || []);

    } catch (error) {
      alert(`Erro ao buscar dados do painel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleDelete = async (spaceId) => {
    if (window.confirm('Tem certeza que deseja apagar este espaço?')) {
        try {
            const { error } = await supabase.from('spaces').delete().eq('id', spaceId);
            if (error) throw error;
            alert('Espaço apagado com sucesso!');
            fetchData();
        } catch(error) {
            alert(`Erro ao apagar espaço: ${error.message}`)
        }
    }
  }

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Painel do Administrador</h1>
              <div className="lg:col-span-2">
          <CalendarView reservations={allReservations} />
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-8">
          <CreateSpaceForm onSpaceCreated={fetchData} />
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Espaços Cadastrados</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {spaces.length > 0 ? spaces.map(space => (
                <div key={space.id} className="border p-4 rounded-lg flex justify-between items-center transition-shadow hover:shadow-md">
                  <div>
                    <p className="font-bold text-gray-800">{space.name}</p>
                    <p className="text-sm text-gray-600">Capacidade: {space.capacity}</p>
                    <p className="text-sm text-gray-600">Recursos: {space.resources}</p>
                  </div>
                  <button onClick={() => handleDelete(space.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"><TrashIcon /></button>
                </div>
              )) : (
                <p className="text-gray-500">Nenhum espaço cadastrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}