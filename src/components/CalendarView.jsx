import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function CalendarView({ reservations }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- LÓGICA DE AGRUPAMENTO DE RESERVAS CORRIGIDA ---
  const reservationsByDate = useMemo(() => {
    if (!reservations || reservations.length === 0) {
      return {};
    }

    return reservations.reduce((acc, res) => {
      // VERIFICA SE A DATA EXISTE E É UMA STRING
      if (res.date && typeof res.date === 'string') {
        // Pega apenas a parte da data (os primeiros 10 caracteres: 'AAAA-MM-DD')
        // Isso ignora a hora e o fuso horário, evitando o bug.
        const dateKey = res.date.substring(0, 10);
        
        (acc[dateKey] = acc[dateKey] || []).push(res);
      }
      return acc;
    }, {});
  }, [reservations]);

  const changeMonth = (amount) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    // Preenche os dias vazios no início do mês
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-start-${i}`} className="border rounded-md p-2 h-24 bg-gray-50"></div>);
    }

    // Renderiza cada dia do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayReservations = reservationsByDate[dateStr] || [];
      const hasReservations = dayReservations.length > 0;
      
      days.push(
        <div key={day} className={`border rounded-md p-2 h-24 text-sm relative transition-colors ${hasReservations ? 'bg-blue-50' : 'bg-white'}`}>
          <span className="font-semibold text-gray-800">{day}</span>
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
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeftIcon /></button>
        <h2 className="text-xl font-semibold capitalize">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronRightIcon /></button>
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