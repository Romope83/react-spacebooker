import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { supabase } from '../../api/supabaseClient.js';
import CalendarView from '../../components/CalendarView.jsx';
import { PageSpinner } from '../../components/Spinner.jsx';
import ReservationFormModal from './ReservationFormModal.jsx';

export default function UserDashboard() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Busca todos os espaços disponíveis para reserva
      const { data: spacesData } = await supabase.from('spaces').select();
      // Busca todas as reservas para popular o calendário de disponibilidade
      const { data: allReservationsData } = await supabase.from('reservations').select();
      // Filtra apenas as reservas do usuário que está logado
      const userReservations = allReservationsData.filter(r => r.user_id === user.id);
      
      setSpaces(spacesData || []);
      setAllReservations(allReservationsData || []);
      setMyReservations(userReservations || []);
      setLoading(false);
    };

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
    // Recarrega os dados para mostrar a nova reserva
    const { data: allReservationsData } = await supabase.from('reservations').select();
    const userReservations = allReservationsData.filter(r => r.user_id === user.id);
    setAllReservations(allReservationsData || []);
    setMyReservations(userReservations || []);
  };

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Tem certeza que deseja cancelar sua reserva?')) {
      await supabase.from('reservations').delete().eq('id', reservationId);
      // Recarrega os dados para remover a reserva cancelada
      const { data: allReservationsData } = await supabase.from('reservations').select();
      const userReservations = allReservationsData.filter(r => r.user_id === user.id);
      setAllReservations(allReservationsData || []);
      setMyReservations(userReservations || []);
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
        allReservations={allReservations}
      />
    </div>
  );
}

