import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

export default function SpaceFormModal({ isOpen, onClose, onSave, space }) {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [resources, setResources] = useState('');

  useEffect(() => {
    if (space) {
      setName(space.name);
      setCapacity(space.capacity);
      setResources(space.resources);
    } else {
      setName('');
      setCapacity('');
      setResources('');
    }
  }, [space, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, capacity: parseInt(capacity), resources });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={space ? "Editar Espaço" : "Adicionar Novo Espaço"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Capacidade</label>
          <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Recursos</label>
          <input type="text" value={resources} onChange={e => setResources(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Ex: Projetor, Ar Condicionado" required />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancelar</button>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
