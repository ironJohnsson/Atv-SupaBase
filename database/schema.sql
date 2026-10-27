-- ====================================================================
-- SUCELSO TECH - Sistema Inteligente de Horários Escolares
-- Senai Cimatec - Engenharia de Computação
-- Arquivo: schema.sql
-- ====================================================================

-- Habilitar extensão para geração de UUID caso necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Limpeza de tabelas caso já existam (ordem inversa de dependências)
DROP TABLE IF EXISTS historico_alteracoes CASCADE;
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS versoes_horario CASCADE;
DROP TABLE IF EXISTS turma_disciplinas CASCADE;
DROP TABLE IF EXISTS disponibilidades CASCADE;
DROP TABLE IF EXISTS salas CASCADE;
DROP TABLE IF EXISTS disciplinas CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;
DROP TABLE IF EXISTS professores CASCADE;
DROP TABLE IF EXISTS turmas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Tipos enumerados
DO $$ BEGIN
    CREATE TYPE tipo_perfil AS ENUM ('aluno', 'professor', 'coordenador');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_status_versao AS ENUM ('rascunho', 'em_revisao', 'publicada');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_dia_semana AS ENUM ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_turno AS ENUM ('matutino', 'vespertino', 'noturno');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 1. Tabela: usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil tipo_perfil NOT NULL DEFAULT 'aluno',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela: turmas
CREATE TABLE turmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    turno tipo_turno NOT NULL DEFAULT 'matutino',
    periodo_letivo VARCHAR(20) NOT NULL, -- Ex: '2026.1'
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela: professores
CREATE TABLE professores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    especialidade VARCHAR(100),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela: alunos
CREATE TABLE alunos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    turma_id UUID REFERENCES turmas(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela: disciplinas
CREATE TABLE disciplinas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    carga_horaria INT NOT NULL CHECK (carga_horaria > 0),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela: salas
CREATE TABLE salas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identificacao VARCHAR(50) NOT NULL UNIQUE, -- Ex: 'Lab. Computação 101'
    capacidade INT NOT NULL CHECK (capacidade > 0),
    tipo VARCHAR(50) DEFAULT 'Laboratório',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela: disponibilidades
CREATE TABLE disponibilidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id UUID NOT NULL REFERENCES professores(id) ON DELETE CASCADE,
    dia tipo_dia_semana NOT NULL,
    inicio TIME NOT NULL,
    fim TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'aprovado', -- 'aprovado', 'pendente_aprovacao' (quando alterado após publicação)
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_horario_disponibilidade CHECK (inicio < fim)
);

-- 8. Tabela: turma_disciplinas (Atribuição acadêmica)
CREATE TABLE turma_disciplinas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    disciplina_id UUID NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES professores(id) ON DELETE CASCADE,
    carga_semanal INT NOT NULL DEFAULT 4 CHECK (carga_semanal > 0), -- Aulas semanais
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_turma_disciplina UNIQUE (turma_id, disciplina_id)
);

-- 9. Tabela: versoes_horario
CREATE TABLE versoes_horario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    periodo VARCHAR(20) NOT NULL, -- Ex: '2026.1'
    status tipo_status_versao NOT NULL DEFAULT 'rascunho',
    data TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    responsavel UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    observacoes TEXT
);

-- 10. Tabela: horarios (Grade semanal individual de cada slot de aula)
CREATE TABLE horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    versao_id UUID NOT NULL REFERENCES versoes_horario(id) ON DELETE CASCADE,
    turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    disciplina_id UUID NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES professores(id) ON DELETE CASCADE,
    sala_id UUID NOT NULL REFERENCES salas(id) ON DELETE RESTRICT,
    dia tipo_dia_semana NOT NULL,
    inicio TIME NOT NULL,
    fim TIME NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_horario_aula CHECK (inicio < fim)
);

-- 11. Tabela: historico_alteracoes (Auditoria)
CREATE TABLE historico_alteracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    operacao VARCHAR(100) NOT NULL, -- Ex: 'GERAR_GRADE', 'ALTERAR_ALOCACAO', 'PUBLICAR_VERSAO', 'ATUALIZAR_DISPONIBILIDADE'
    data TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valores_alterados JSONB NOT NULL
);

-- Índices de Performance e Verificação de Conflitos Rápidos
CREATE INDEX idx_horarios_versao ON horarios(versao_id);
CREATE INDEX idx_horarios_turma ON horarios(turma_id, dia, inicio);
CREATE INDEX idx_horarios_professor ON horarios(professor_id, dia, inicio);
CREATE INDEX idx_horarios_sala ON horarios(sala_id, dia, inicio);
CREATE INDEX idx_disponibilidades_professor ON disponibilidades(professor_id, dia);
CREATE INDEX idx_historico_data ON historico_alteracoes(data DESC);

-- Trigger para atualização de timestamp
CREATE OR REPLACE FUNCTION atualiza_timestamp_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_atualizado_em
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION atualiza_timestamp_atualizacao();

