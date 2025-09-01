// --- SEÇÃO DE SIMULAÇÃO DO CLIENTE SUPABASE ---
// Para agilizar o desenvolvimento do frontend, criamos um objeto 'mock' que simula
// a API do Supabase. Ele retorna dados pré-definidos e imita o comportamento assíncrono
// com `setTimeout`, permitindo que a interface seja construída e testada sem uma conexão real.

// Banco de dados em memória para a simulação
const mockDb = {
  spaces: [
    { id: 1, name: 'Sala de Reunião A', capacity: 10, resources: 'Projetor, Quadro Branco' },
    { id: 2, name: 'Escritório Privativo 1', capacity: 4, resources: 'Monitores, Dockstation' },
    { id: 3, name: 'Estúdio de Gravação', capacity: 3, resources: 'Microfone, Câmera' },
  ],
  reservations: [
      { id: 101, space_id: 1, user_id: 'user-uuid', user_email: 'user@spacebooker.com', date: '2025-09-15', start_time: '14:00', end_time: '15:00', space_name: 'Sala de Reunião A' },
      { id: 102, space_id: 2, user_id: 'admin-uuid', user_email: 'admin@spacebooker.com', date: '2025-09-16', start_time: '10:00', end_time: '12:00', space_name: 'Escritório Privativo 1' },
      { id: 103, space_id: 1, user_id: 'user-uuid', user_email: 'user@spacebooker.com', date: '2025-09-16', start_time: '16:00', end_time: '17:00', space_name: 'Sala de Reunião A' },
  ]
};

// Objeto que imita a estrutura e os métodos do cliente Supabase
const mockSupabaseClient = {
  auth: {
    async signInWithPassword({ email, password }) {
      await new Promise(res => setTimeout(res, 500)); // Simula a latência da rede
      if (email === 'admin@spacebooker.com' && password === 'admin123') {
        return { data: { user: { id: 'admin-uuid', email, app_metadata: { role: 'admin' } } }, error: null };
      }
      if (email === 'user@spacebooker.com' && password === 'user123') {
        return { data: { user: { id: 'user-uuid', email, app_metadata: { role: 'user' } } }, error: null };
      }
      return { data: { user: null }, error: { message: 'Credenciais inválidas' } };
    },
    async signOut() {
      await new Promise(res => setTimeout(res, 300));
      return { error: null };
    },
    onAuthStateChange(callback) { 
      return { data: { subscription: { unsubscribe: () => {} } } }; 
    },
  },
  from: (tableName) => {
    const table = mockDb[tableName] || [];
    
    const builder = (currentData) => ({
      select: () => builder(currentData),
      insert: (newData) => {
        const newItem = { id: Date.now(), ...newData }; 
        mockDb[tableName].push(newItem);
        return builder([newItem]);
      },
      update: (updatedData) => ({
        eq: (column, value) => {
          mockDb[tableName] = mockDb[tableName].map(item => 
            item[column] === value ? { ...item, ...updatedData } : item
          );
          const updatedItems = mockDb[tableName].filter(item => item[column] === value);
          return builder(updatedItems);
        }
      }),
      delete: () => ({
        eq: (column, value) => {
          const deletedItems = mockDb[tableName].filter(item => item[column] === value);
          mockDb[tableName] = mockDb[tableName].filter(item => item[column] !== value);
          return builder(deletedItems);
        }
      }),
      eq: (column, value) => {
        const filteredData = currentData.filter(item => item[column] === value);
        return builder(filteredData);
      },
      then: (resolve) => {
        setTimeout(() => resolve({ data: JSON.parse(JSON.stringify(currentData)), error: null }), 300);
      }
    });

    return builder(table);
  },
};

export const supabase = mockSupabaseClient;
