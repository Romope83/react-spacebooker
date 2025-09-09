import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function CalendarView({ reservations, onReservationClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const reservationsByDate = useMemo(() => {
    if (!reservations || reservations.length === 0) return {};
    return reservations.reduce((acc, res) => {
      if (res.date && typeof res.date === 'string') {
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
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-start-${i}`} className="border-t border-r border-slate-100 bg-slate-50"></div>);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayReservations = reservationsByDate[dateStr] || [];
      const hasReservations = dayReservations.length > 0;
      
      days.push(
        <div key={day} className="border-t border-r border-slate-100 p-2 h-32 text-sm relative transition-colors flex flex-col">
          <span className="font-semibold text-slate-700 self-start">{day}</span>
          {hasReservations && (
            <div className="mt-1 space-y-1 overflow-y-auto flex-grow">
              {dayReservations.map(r => (
                 <div 
                   key={r.id} 
                   className={`bg-indigo-100 text-indigo-800 p-1.5 rounded-md text-xs truncate ${onReservationClick ? 'cursor-pointer hover:bg-indigo-200' : ''}`} 
                   title={`${r.space_name} (${r.start_time}-${r.end_time})`}
                   onClick={() => onReservationClick && onReservationClick(r)}
                 >
                    <p className="font-bold">{r.space_name}</p>
                    <p>{r.start_time} - {r.end_time}</p>
                 </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return days;
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><ChevronLeftIcon /></button>
        <h2 className="text-xl font-bold text-slate-800 capitalize">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><ChevronRightIcon /></button>
      </div>
      <div className="grid grid-cols-7 gap-px text-center text-xs text-slate-500 font-bold mb-2 uppercase tracking-wider">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 gap-px border-l border-b border-slate-100">
        {renderCalendar()}
      </div>
    </div>
  )
}