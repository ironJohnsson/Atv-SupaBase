# Guia Completo de Implantação (Deploy)
## SUCELSO TECH - Sistema Inteligente de Horários Escolares
**Universidade Senai Cimatec | Engenharia de Computação | Prof. Celso Barreto**

Este guia descreve o procedimento passo a passo para hospedar o banco de dados PostgreSQL no **Supabase**, a API REST no **Render** e a aplicação frontend no **Vercel**.

---

### 1. Banco de Dados: Supabase (PostgreSQL)

1. Crie uma conta gratuita em [https://supabase.com](https://supabase.com) e crie um novo projeto (ex: `sucelso-tech-db`).
2. Acesse o **SQL Editor** no painel lateral do Supabase.
3. Copie e execute o conteúdo do arquivo `database/schema.sql` para criar todas as tabelas, tipos e índices.
4. Execute o conteúdo do arquivo `database/rls.sql` para habilitar as políticas de Row Level Security.
5. Execute o conteúdo do arquivo `database/seed.sql` para povoar o banco com as 3 turmas, 6 professores, 8 disciplinas, 5 salas e disponibilidades obrigatórias.
6. Em **Project Settings -> API**, copie:
   - `Project URL` (ex: `https://xyzcompany.supabase.co`)
   - `anon public key`
   - `service_role secret key` (necessária no backend para operações administrativas seguras).

---

### 2. Backend: Render (Node.js + Express)

1. Acesse [https://render.com](https://render.com) e conecte sua conta GitHub.
2. Clique em **New +** -> **Web Service**.
3. Selecione o repositório `ironJohnsson/Atv-SupaBase`.
4. Configure os parâmetros do serviço:
   - **Name**: `sucelso-tech-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Na seção **Environment Variables**, adicione:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `sucelso_super_secret_jwt_key_2026`
   - `SUPABASE_URL`: `https://seu-projeto.supabase.co`
   - `SUPABASE_SERVICE_KEY`: `sua-service-role-key-aqui`
   - `FRONTEND_URL`: `https://seu-app-vercel.vercel.app` (ou `*` para liberar CORS)
6. Clique em **Create Web Service**. Aguarde a finalização do build e copie a URL gerada (ex: `https://sucelso-tech-api.onrender.com`).

> **Nota sobre o plano gratuito do Render**: Serviços inativos entram em modo de suspensão após 15 minutos sem requisições. A primeira requisição pode levar de 30 a 50 segundos para despertar a instância.

---

### 3. Frontend: Vercel (React + Vite)

1. Acesse [https://vercel.com](https://vercel.com) e vincule seu repositório GitHub.
2. Clique em **Add New...** -> **Project** e selecione `Atv-SupaBase`.
3. Configure as propriedades do projeto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Na seção **Environment Variables**, configure:
   - `VITE_API_URL`: `https://sucelso-tech-api.onrender.com/api` (ou use a URL do seu backend local/remoto).
5. Clique em **Deploy**. O Vercel fará a compilação e disponibilizará a URL pública (ex: `https://sucelso-tech.vercel.app`).

