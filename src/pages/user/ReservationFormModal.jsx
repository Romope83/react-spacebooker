import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal.jsx';
import { supabase } from '../../api/supabaseClient.js';

// O modal agora recebe 'existingReservation' para o modo de edição
export default function ReservationFormModal({ isOpen, onClose, onSave, space, allReservations, existingReservation }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!existingReservation;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // Se está editando, preenche o formulário com os dados existentes
        setDate(existingReservation.date.substring(0, 10));
        setStartTime(existingReservation.start_time);
        setEndTime(existingReservation.end_time);
      } else {
        // Se está criando, usa a lógica de "amanhã"
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
        setStartTime('09:00');
        setEndTime('10:00');
      }
    }
  }, [isOpen, isEditMode, existingReservation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Lógica para verificar conflitos (ignorando a própria reserva no modo de edição)
    const hasConflict = allReservations.some(reservation => {
      // Se estiver editando, não compare a reserva com ela mesma
      if (isEditMode && reservation.id === existingReservation.id) {
        return false;
      }
      const targetSpaceId = isEditMode ? existingReservation.space_id : space.id;
      if (reservation.space_id === targetSpaceId && reservation.date.substring(0, 10) === date) {
        if (startTime < reservation.end_time && reservation.start_time < endTime) {
          return true;
        }
      }
      return false;
    });

    if (hasConflict) {
      alert('Erro: Conflito de horário detectado. Por favor, escolha outro horário.');
      setLoading(false);
      return;
    }

    // A função onSave agora lida com a lógica de criar ou atualizar
    try {
      await onSave({ date, start_time: startTime, end_time: endTime });
    } catch (error) {
       alert(`Ocorreu um erro: ${error.message}`);
    } finally {
       setLoading(false);
    }
  };
  
  const modalTitle = isEditMode ? `Editar Reserva em: ${existingReservation.space_name}` : `Reservar o espaço: ${space?.name}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit}>
        {/* ... campos do formulário ... */}
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
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-green-400">
            {loading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Confirmar Reserva')}
          </button>
        </div>
      </form>
    </Modal>
  )
};