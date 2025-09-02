import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal.jsx';

// Este componente é o formulário que aparece dentro do Modal para o utilizador fazer uma reserva.
export default function ReservationFormModal({ isOpen, onClose, onSave, space, allReservations }) { // Recebe todas as reservas
  // Estados para controlar os campos do formulário
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Este `useEffect` preenche o formulário com valores padrão (o dia de amanhã)
  // sempre que o modal é aberto. Isto facilita os testes.
  useEffect(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
  }, [isOpen]);

  // Função chamada quando o formulário é submetido
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o recarregamento da página

    // --- LÓGICA DE VERIFICAÇÃO DE CONFLITO ---
    // Verifica se já existe uma reserva que se sobrepõe ao horário solicitado.
    const hasConflict = allReservations.some(reservation => {
      // Verifica se a reserva existente é para o mesmo espaço e na mesma data
      if (reservation.space_id === space.id && reservation.date === date) {
        // Converte os horários para facilitar a comparação
        const existingStart = reservation.start_time;
        const existingEnd = reservation.end_time;
        const newStart = startTime;
        const newEnd = endTime;

        // A sobreposição ocorre se a nova reserva começa antes do fim da existente
        // E a reserva existente começa antes do fim da nova.
        if (newStart < existingEnd && existingStart < newEnd) {
          return true; // Encontrou um conflito
        }
      }
      return false; // Nenhum conflito encontrado para esta reserva
    });

    if (hasConflict) {
      alert('Erro: Já existe uma reserva para este espaço neste horário. Por favor, escolha outro horário.');
      return; // Interrompe o processo de reserva
    }

    // Se não houver conflito, chama a função onSave.
    onSave({ date, start_time: startTime, end_time: endTime });
  };

  // Se não houver um espaço selecionado, não renderiza nada.
  if (!space) {
    return null;
  }

  return (
    // Usa o componente Modal genérico para a estrutura do pop-up
    <Modal isOpen={isOpen} onClose={onClose} title={`Reservar o espaço: ${space.name}`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Data da Reserva</label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Início</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Fim</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500" 
            required 
          />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors">
            Cancelar
          </button>
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Confirmar Reserva
          </button>
        </div>
      </form>
    </Modal>
  )
};

