import { createClient } from '@supabase/supabase-js';

// As suas credenciais únicas do projeto Supabase.
// É seguro expor a chave 'anon' publicamente, pois as suas regras de RLS (Row Level Security) protegem os dados.
const supabaseUrl = 'https://niihozmtaqxfoavobqrr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paWhvem10YXF4Zm9hdm9icXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NzAzMDQsImV4cCI6MjA3MjM0NjMwNH0.q7izlsp6DVslaaOrlF8ejIOciZA_7XPuuFMhZCzxYFk';

// Cria e exporta o cliente Supabase, que será usado em toda a aplicação para interagir com o seu backend.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

