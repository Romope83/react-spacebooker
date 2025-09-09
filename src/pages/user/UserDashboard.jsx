import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { supabase } from '../../api/supabaseClient.js';
import CalendarView from '../../components/CalendarView.jsx';
import { PageSpinner } from '../../components/Spinner.jsx';
import ReservationFormModal from './ReservationFormModal.jsx';
import { PencilIcon } from '../../components/Icons.jsx';

export default function UserDashboard() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [reservationToEdit, setReservationToEdit] = useState(null); // State para edição

  const fetchData = async () => {
    // ... (função fetchData, sem alterações)
    try {
      const { data: spacesData, error: spacesError } = await supabase.from('spaces').select();
      if (spacesError) throw spacesError;
      const { data: allReservationsData, error: reservationsError } = await supabase.from('reservations').select();
      if (reservationsError) throw reservationsError;
      
      const userReservations = allReservationsData.filter(r => r.user_id === user.id);
      setSpaces(spacesData || []);
      setAllReservations(allReservationsData || []);
      setMyReservations(userReservations || []);
    } catch (error) {
      alert('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleBookNow = (space) => {
    setSelectedSpace(space);
    setReservationToEdit(null); // Garante que não está em modo de edição
    setIsModalOpen(true);
  };
  
  const handleEdit = (reservation) => {
    setReservationToEdit(reservation);
    setSelectedSpace(null); // Garante que não está em modo de criação
    setIsModalOpen(true);
  }

  const handleSave = async (bookingDetails) => {
    try {
      if (reservationToEdit) {
        // --- LÓGICA DE UPDATE ---
        const { error } = await supabase
          .from('reservations')
          .update(bookingDetails)
          .eq('id', reservationToEdit.id);
        if (error) throw error;
        alert('Reserva atualizada com sucesso!');
      } else {
        // --- LÓGICA DE INSERT ---
        const newReservation = { ...bookingDetails, space_id: selectedSpace.id, user_id: user.id, user_email: user.email, space_name: selectedSpace.name };
        const { error } = await supabase.from('reservations').insert(newReservation);
        if (error) throw error;
        alert('Reserva criada com sucesso!');
      }
      setIsModalOpen(false);
      fetchData(); // Recarrega os dados
    } catch (error) {
       throw error; // Propaga o erro para o modal mostrar o alerta
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Tem certeza que deseja cancelar sua reserva?')) {
      await supabase.from('reservations').delete().eq('id', reservationId);
      fetchData();
    }
  };

  if (loading) return <PageSpinner />;
  
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Painel do Usuário</h1>
      {/* Agora o calendário do usuário também mostra todas as reservas */}
      <CalendarView reservations={allReservations} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card de Espaços Disponíveis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Espaços para Reservar</h2>
           {/* ... (código dos espaços) ... */}
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

        {/* Card de Minhas Reservas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Minhas Reservas</h2>
          {myReservations.length > 0 ? (
            <ul className="space-y-3">
              {myReservations.map(res => (
                <li key={res.id} className="border p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold">{res.space_name}</p>
                    <p className="text-sm text-gray-600">Data: {res.date.substring(0,10)} | Horário: {res.start_time} - {res.end_time}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* --- BOTÃO DE EDITAR --- */}
                    <button onClick={() => handleEdit(res)} className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600"><PencilIcon /></button>
                    <button onClick={() => handleCancelReservation(res.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Cancelar</button>
                  </div>
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
        onSave={handleSave}
        space={selectedSpace}
        allReservations={allReservations}
        existingReservation={reservationToEdit}
      />
    </div>
  );
}