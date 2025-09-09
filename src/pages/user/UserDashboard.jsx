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
  const [reservationToEdit, setReservationToEdit] = useState(null);

  const fetchData = async () => {
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
    setReservationToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (reservation) => {
    setReservationToEdit(reservation);
    setSelectedSpace(null);
    setIsModalOpen(true);
  }

  const handleSave = async (bookingDetails) => {
    try {
      if (reservationToEdit) {
        const { error } = await supabase
          .from('reservations')
          .update(bookingDetails)
          .eq('id', reservationToEdit.id);
        if (error) throw error;
        alert('Reserva atualizada com sucesso!');
      } else {
        const newReservation = { ...bookingDetails, space_id: selectedSpace.id, user_id: user.id, user_email: user.email, space_name: selectedSpace.name };
        const { error } = await supabase.from('reservations').insert(newReservation);
        if (error) throw error;
        alert('Reserva criada com sucesso!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
       throw error;
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
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Painel do Usuário</h1>
      <CalendarView reservations={allReservations} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Espaços para Reservar</h2>
           <div className="divide-y divide-slate-100">
            {spaces.map((space, index) => (
              <div key={space.id} className={`py-4 flex justify-between items-center ${index === 0 ? 'pt-0' : ''}`}>
                <div>
                  <p className="font-bold text-slate-800">{space.name}</p>
                  <p className="text-sm text-slate-500">Capacidade: {space.capacity}</p>
                  <p className="text-sm text-slate-500">Recursos: {space.resources}</p>
                </div>
                <button onClick={() => handleBookNow(space)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold transition-colors shrink-0">Reservar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Minhas Reservas</h2>
          {myReservations.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {myReservations.map((res, index) => (
                <div key={res.id} className={`py-4 flex justify-between items-center ${index === 0 ? 'pt-0' : ''}`}>
                  <div>
                    <p className="font-bold">{res.space_name}</p>
                    <p className="text-sm text-slate-500">Data: {new Date(res.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} | Horário: {res.start_time} - {res.end_time}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEdit(res)} title="Editar Reserva" className="bg-slate-200 text-slate-700 p-2 rounded-full hover:bg-slate-300 transition-colors"><PencilIcon /></button>
                    <button onClick={() => handleCancelReservation(res.id)} className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 text-sm font-semibold transition-colors">Cancelar</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">Você ainda não fez nenhuma reserva.</p>
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