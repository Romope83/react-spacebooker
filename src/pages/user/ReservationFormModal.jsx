import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal.jsx';

export default function ReservationFormModal({ isOpen, onClose, onSave, space, allReservations, existingReservation }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!existingReservation;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setDate(existingReservation.date.substring(0, 10));
        setStartTime(existingReservation.start_time);
        setEndTime(existingReservation.end_time);
      } else {
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

    const hasConflict = allReservations.some(reservation => {
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

    try {
      await onSave({ date, start_time: startTime, end_time: endTime });
    } catch (error) {
       alert(`Ocorreu um erro: ${error.message}`);
    } finally {
       setLoading(false);
    }
  };
  
  const modalTitle = isEditMode ? `Editar Reserva` : `Reservar: ${space?.name}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-2">Data</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
        </div>
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-2">Hora de Início</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
        </div>
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-2">Hora de Fim</label>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
        </div>
        <div className="flex justify-end gap-4 pt-4 mt-2 border-t border-slate-200">
          <button type="button" onClick={onClose} className="bg-transparent hover:bg-slate-100 text-slate-800 font-bold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
            {loading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Confirmar Reserva')}
          </button>
        </div>
      </form>
    </Modal>
  )
};