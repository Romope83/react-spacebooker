import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';
import { PageSpinner } from '../../components/Spinner';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/Icons';
import CalendarView from '../../components/CalendarView';
import SpaceFormModal from './SpaceFormModal';

export default function AdminDashboard() {
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

  const handleEdit = (space) => { setCurrentSpace(space); setIsModalOpen(true); };
  const handleAddNew = () => { setCurrentSpace(null); setIsModalOpen(true); };

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
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Painel do Administrador</h1>
      <CalendarView reservations={reservations} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
