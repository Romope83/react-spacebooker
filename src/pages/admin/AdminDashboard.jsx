import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';
import { PageSpinner } from '../../components/Spinner';
import CalendarView from '../../components/CalendarView';
import ReservationFormModal from '../user/ReservationFormModal';
import { PlusIcon, TrashIcon, BuildingOffice2Icon } from '../../components/Icons';

// Componente de formulário com estilo atualizado
function CreateSpaceForm({ onSpaceCreated }) {
  // ... (código interno do formulário permanece o mesmo)
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
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800"><PlusIcon /> Adicionar Novo Espaço</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Nome do Espaço</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">Capacidade</label>
          <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="mt-1 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">Recursos (ex: Projetor, Wi-Fi)</label>
          <input type="text" value={resources} onChange={e => setResources(e.target.value)} className="mt-1 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white px-4 py-2.5 font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed active:scale-[.98] transition">
          {loading ? 'Salvando...' : 'Salvar Espaço'}
        </button>
      </form>
    </div>
  );
}


// Ilustração para quando a lista de espaços estiver vazia
const EmptySpacesState = () => (
  <div className="text-center py-10 px-4">
    <BuildingOffice2Icon />
    <h3 className="mt-4 text-lg font-semibold text-slate-800">Nenhum Espaço Cadastrado</h3>
    <p className="mt-1 text-sm text-slate-500">Adicione seu primeiro espaço usando o formulário acima.</p>
  </div>
);


// Painel principal do Admin
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState(null);

  // ... (toda a lógica de fetchData, handleDelete, etc. continua a mesma)
  const fetchData = async () => {
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
  
  const handleDeleteSpace = async (spaceId) => {
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

  const handleReservationClick = (reservation) => {
    setReservationToEdit(reservation);
    setIsModalOpen(true);
  }

  const handleSaveReservation = async (bookingDetails) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update(bookingDetails)
        .eq('id', reservationToEdit.id);
      if (error) throw error;
      
      alert('Reserva atualizada com sucesso!');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      throw error;
    }
  };


  if (loading) {
    return <PageSpinner />;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Painel do Administrador</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <CreateSpaceForm onSpaceCreated={fetchData} />
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Espaços Cadastrados</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 divide-y divide-slate-100">
              {spaces.length > 0 ? spaces.map((space, index) => (
                <div key={space.id} className={`pt-${index === 0 ? '0' : '4'} pb-2 flex justify-between items-center group`}>
                  <div>
                    <p className="font-bold text-slate-800">{space.name}</p>
                    <p className="text-sm text-slate-500">Capacidade: {space.capacity}</p>
                    <p className="text-sm text-slate-500">Recursos: {space.resources}</p>
                  </div>
                  <button onClick={() => handleDeleteSpace(space.id)} className="text-slate-400 hover:text-rose-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity active:scale-90">
                    <TrashIcon />
                  </button>
                </div>
              )) : (
                <EmptySpacesState />
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <CalendarView reservations={allReservations} onReservationClick={handleReservationClick} />
        </div>
      </div>

      <ReservationFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveReservation}
        allReservations={allReservations}
        existingReservation={reservationToEdit}
      />
    </div>
  );
}