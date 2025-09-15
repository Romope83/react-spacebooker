Spacebooker App

O Spacebooker é uma aplicação web completa para agendamento e reserva de espaços, como salas de reunião ou escritórios. Construído com React e Vite no frontend, e utilizando Supabase para backend, autenticação e banco de dados. O sistema possui controle de acesso baseado em funções (usuários e administradores) para garantir a segurança e a correta gestão dos dados.

✨ Funcionalidades
Autenticação de Usuários: Sistema completo de login e cadastro de usuários gerenciado pelo Supabase Auth.

Dashboard de Usuário: Painel onde os usuários podem visualizar e gerenciar suas próprias reservas.


Criação de Reservas: Usuários autenticados podem criar, atualizar e excluir suas próprias reservas.



Visualização de Espaços: Todos os usuários autenticados podem listar e visualizar os espaços disponíveis para reserva.

Painel de Administração: Uma área restrita onde administradores têm controle total sobre espaços e reservas.


Gerenciamento de Espaços: Administradores podem criar, editar e remover espaços (definindo nome, capacidade e recursos).


Controle de Acesso por Função (Admin/Usuário): A segurança a nível de linha (Row Level Security) do Supabase é utilizada para garantir que:

Usuários só possam acessar e modificar suas próprias reservas.

Administradores tenham acesso total para gerenciar todos os espaços e reservas.


🛠️ Tecnologias Utilizadas
Frontend:

React

React Router DOM

Tailwind CSS

Backend & Banco de Dados:

Supabase (Banco de Dados Postgres, Autenticação, Row Level Security)

Build Tool & Ambiente de Desenvolvimento:

Vite

ESLint

PostCSS & Autoprefixer

🗄️ Esquema do Banco de Dados
O banco de dados no Supabase é estruturado com duas tabelas principais:

spaces: Armazena os detalhes dos espaços disponíveis.


id, created_at, name, capacity, resources 

reservations: Registra as reservas feitas pelos usuários, relacionando um usuário a um espaço.


id, created_at, space_id, user_id, user_email, date, start_time, end_time, space_name 

A segurança é reforçada com políticas de 

Row Level Security (RLS) ativadas para ambas as tabelas.

🚀 Como Executar o Projeto
Siga os passos abaixo para configurar e executar o projeto localmente.

Pré-requisitos
Node.js (versão 18 ou superior)

npm ou yarn

Git

1. Configuração do Backend (Supabase)
Crie um novo projeto no Supabase.

Dentro do seu projeto Supabase, vá para o SQL Editor.

Copie e execute os scripts SQL do arquivo 

scripts.txt para criar as tabelas (spaces, reservations) e aplicar as políticas de segurança (Row Level Security).

Vá para Project Settings > API. Guarde a URL do Projeto e a chave anon public.

2. Configuração do Frontend (Local)
Clone o repositório:

Bash

git clone <URL_DO_SEU_REPOSITORIO>
cd spacebooker-app
Instale as dependências:

Bash

npm install
Crie um arquivo de ambiente:
Crie um arquivo chamado .env na raiz do projeto e adicione as chaves do Supabase que você copiou:

VITE_SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
VITE_SUPABASE_KEY=SUA_CHAVE_ANON_PUBLIC
Observação: O projeto utiliza o supabaseClient.js para inicializar a conexão com o Supabase usando essas variáveis de ambiente.

Execute o projeto:

Bash

npm run dev
A aplicação estará disponível em http://localhost:5173 (ou outra porta indicada no terminal).

📜 Scripts Disponíveis
npm run dev: Inicia o servidor de desenvolvimento com Vite.

npm run build: Compila o projeto para produção.

npm run lint: Executa o ESLint para verificar a qualidade do código.

npm run preview: Inicia um servidor local para visualizar a versão de produção.
