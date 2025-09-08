import { createClient } from '@supabase/supabase-js';

// As suas credenciais únicas do projeto Supabase.
// É seguro expor a chave 'anon' publicamente, pois as suas regras de RLS (Row Level Security) protegem os dados.
const supabaseUrl = 'https://hfpfaxjoekbvctqwfsww.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcGZheGpvZWtidmN0cXdmc3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjgyODksImV4cCI6MjA3Mjk0NDI4OX0.HBxvq43GNawzS7rEADPOs-py5PcQWK6nIBZzF2VPfOU';

// Cria e exporta o cliente Supabase, que será usado em toda a aplicação para interagir com o seu backend.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

