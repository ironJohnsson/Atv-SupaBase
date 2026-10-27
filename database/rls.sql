-- ====================================================================
-- SUCELSO TECH - Sistema Inteligente de Horários Escolares
-- Senai Cimatec - Engenharia de Computação
-- Arquivo: rls.sql (Row Level Security no Supabase PostgreSQL)
-- ====================================================================

-- Ativar RLS nas tabelas principais
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE turma_disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE versoes_horario ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_alteracoes ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para extrair o perfil do usuário logado no Supabase Auth
CREATE OR REPLACE FUNCTION auth.get_user_profile()
RETURNS tipo_perfil AS $$
DECLARE
    v_perfil tipo_perfil;
BEGIN
    SELECT perfil INTO v_perfil FROM public.usuarios WHERE id = auth.uid();
    RETURN v_perfil;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Políticas para: usuarios
-- Leitura permitida para autenticados; Coordenadores podem gerenciar todos
CREATE POLICY "Leitura de usuarios autenticados" ON usuarios
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Coordenador gerencia usuarios" ON usuarios
    FOR ALL TO authenticated USING (auth.get_user_profile() = 'coordenador');

-- 2. Políticas para: turmas, disciplinas, salas
-- Leitura pública para todos os perfis autenticados
CREATE POLICY "Leitura autenticada turmas" ON turmas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coordenador altera turmas" ON turmas FOR ALL TO authenticated USING (auth.get_user_profile() = 'coordenador');

CREATE POLICY "Leitura autenticada disciplinas" ON disciplinas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coordenador altera disciplinas" ON disciplinas FOR ALL TO authenticated USING (auth.get_user_profile() = 'coordenador');

CREATE POLICY "Leitura autenticada salas" ON salas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coordenador altera salas" ON salas FOR ALL TO authenticated USING (auth.get_user_profile() = 'coordenador');

-- 3. Políticas para: professores e alunos
CREATE POLICY "Leitura autenticada professores" ON professores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coordenador altera professores" ON professores FOR ALL TO authenticated USING (auth.get_user_profile() = 'coordenador');

CREATE POLICY "Leitura autenticada alunos" ON alunos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coordenador altera alunos" ON alunos FOR ALL TO authenticated USING (auth.get_user_profile() = 'coordenador');

-- 4. Políticas para: disponibilidades
-- Alunos: SEM acesso de escrita.
-- Professores: Leitura e escrita exclusivamente de suas próprias disponibilidades.
-- Coordenadores: Leitura e gestão de todas as disponibilidades.
CREATE POLICY "Professor e coordenador leem disponibilidades" ON disponibilidades
    FOR SELECT TO authenticated
    USING (
        auth.get_user_profile() = 'coordenador' OR 
        professor_id IN (SELECT id FROM professores WHERE usuario_id = auth.uid())
    );

CREATE POLICY "Professor insere propria disponibilidade" ON disponibilidades
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.get_user_profile() = 'coordenador' OR 
        professor_id IN (SELECT id FROM professores WHERE usuario_id = auth.uid())
    );

CREATE POLICY "Professor atualiza propria disponibilidade" ON disponibilidades
    FOR UPDATE TO authenticated
    USING (
        auth.get_user_profile() = 'coordenador' OR 
        professor_id IN (SELECT id FROM professores WHERE usuario_id = auth.uid())
    );

-- 5. Políticas para: turma_disciplinas
CREATE POLICY "Leitura autenticada turma_disciplinas" ON turma_disciplinas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coordenador altera turma_disciplinas" ON turma_disciplinas FOR ALL TO authenticated USING (auth.get_user_profile() = 'coordenador');

-- 6. Políticas para: versoes_horario e horarios
-- Alunos e Professores só podem ler versões marcadas como 'publicada'
-- Coordenador pode visualizar e manipular 'rascunho', 'em_revisao' e 'publicada'
CREATE POLICY "Leitura de versoes" ON versoes_horario
    FOR SELECT TO authenticated
    USING (
        status = 'publicada' OR 
        auth.get_user_profile() = 'coordenador'
    );

CREATE POLICY "Coordenador gerencia versoes" ON versoes_horario
    FOR ALL TO authenticated
    USING (auth.get_user_profile() = 'coordenador');

CREATE POLICY "Leitura de horarios publicados ou coordenador" ON horarios
    FOR SELECT TO authenticated
    USING (
        versao_id IN (SELECT id FROM versoes_horario WHERE status = 'publicada') OR
        auth.get_user_profile() = 'coordenador'
    );

CREATE POLICY "Coordenador gerencia horarios" ON horarios
    FOR ALL TO authenticated
    USING (auth.get_user_profile() = 'coordenador');

-- 7. Políticas para: historico_alteracoes
-- Apenas coordenadores podem visualizar todo o histórico de auditoria
CREATE POLICY "Apenas coordenador consulta historico" ON historico_alteracoes
    FOR SELECT TO authenticated
    USING (auth.get_user_profile() = 'coordenador');

CREATE POLICY "Insercao de historico pelo sistema ou coordenador" ON historico_alteracoes
    FOR INSERT TO authenticated
    WITH CHECK (true);

