-- ====================================================================
-- SUCELSO TECH - Sistema Inteligente de Horários Escolares
-- Senai Cimatec - Engenharia de Computação
-- Arquivo: seed.sql (Dados Fictícios de Validação Oficial)
-- ====================================================================

-- Senha padrão para todos os usuários de teste: 'senha123'
-- Hash bcrypt correspondente gerado com salt 10:
-- $2b$10$w8.dYkK96qEwF4k4KkPge.OQY63uR7Kz2pTf3l6Q24gS.y7oZ7Gce (ou verificação direta via backend)

-- Limpar dados existentes preservando estrutura
TRUNCATE historico_alteracoes, horarios, versoes_horario, turma_disciplinas, 
         disponibilidades, salas, disciplinas, alunos, professores, turmas, usuarios CASCADE;

-- 1. Inserção de Usuários
-- Coordenador
INSERT INTO usuarios (id, nome, email, senha_hash, perfil) VALUES
('11111111-1111-1111-1111-111111111111', 'Prof. Celso Barreto (Coordenador)', 'coordenador@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'coordenador');

-- 6 Professores (Cenário Obrigatório: 6 professores)
INSERT INTO usuarios (id, nome, email, senha_hash, perfil) VALUES
('22222222-2222-2222-2222-222222222201', 'Prof. Roberto Lima (Restrição Estrita)', 'roberto@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'professor'),
('22222222-2222-2222-2222-222222222202', 'Profa. Camila Duarte', 'camila@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'professor'),
('22222222-2222-2222-2222-222222222203', 'Prof. Marcos Vinicius', 'marcos@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'professor'),
('22222222-2222-2222-2222-222222222204', 'Profa. Juliana Santos', 'juliana@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'professor'),
('22222222-2222-2222-2222-222222222205', 'Prof. André Silveira', 'andre@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'professor'),
('22222222-2222-2222-2222-222222222206', 'Profa. Fernanda Rocha', 'fernanda@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'professor');

-- Alunos de Teste
INSERT INTO usuarios (id, nome, email, senha_hash, perfil) VALUES
('33333333-3333-3333-3333-333333333301', 'Lucas Silva (Aluno Eng. Computação)', 'lucas.aluno@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'aluno'),
('33333333-3333-3333-3333-333333333302', 'Mariana Souza (Aluna ADS)', 'mariana.aluno@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'aluno'),
('33333333-3333-3333-3333-333333333303', 'Felipe Castro (Aluno Redes)', 'felipe.aluno@sucelso.tech', '$2a$10$zD98N3.3zG1W0eY7Gg7YreW1RqmR0k8Yx2Zk4S0P7mI6G0C1F8yOq', 'aluno');

-- 2. Inserção de Turmas (Cenário Obrigatório: mínimo 3 turmas)
INSERT INTO turmas (id, nome, turno, periodo_letivo) VALUES
('44444444-4444-4444-4444-444444444401', 'Engenharia de Computação - 5º Semestre', 'matutino', '2026.1'),
('44444444-4444-4444-4444-444444444402', 'Análise e Desenv. de Sistemas (ADS) - 3º Sem', 'matutino', '2026.1'),
('44444444-4444-4444-4444-444444444403', 'Redes de Computadores - 2º Semestre', 'vespertino', '2026.1');

-- 3. Inserção de Professores
INSERT INTO professores (id, usuario_id, matricula, especialidade) VALUES
('55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222201', 'MATR-P001', 'Banco de Dados e Big Data'),
('55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222202', 'MATR-P002', 'Desenvolvimento Web e Mobile'),
('55555555-5555-5555-5555-555555555503', '22222222-2222-2222-2222-222222222203', 'MATR-P003', 'Redes e Infraestrutura'),
('55555555-5555-5555-5555-555555555504', '22222222-2222-2222-2222-222222222204', 'MATR-P004', 'Inteligência Artificial e Heurísticas'),
('55555555-5555-5555-5555-555555555505', '22222222-2222-2222-2222-222222222205', 'MATR-P005', 'Sistemas Operacionais e Cloud'),
('55555555-5555-5555-5555-555555555506', '22222222-2222-2222-2222-222222222206', 'MATR-P006', 'Engenharia de Software e Projetos');

-- 4. Inserção de Alunos vinculados às turmas
INSERT INTO alunos (id, usuario_id, matricula, turma_id) VALUES
('66666666-6666-6666-6666-666666666601', '33333333-3333-3333-3333-333333333301', 'ALU-EC-001', '44444444-4444-4444-4444-444444444401'),
('66666666-6666-6666-6666-666666666602', '33333333-3333-3333-3333-333333333302', 'ALU-ADS-002', '44444444-4444-4444-4444-444444444402'),
('66666666-6666-6666-6666-666666666603', '33333333-3333-3333-3333-333333333303', 'ALU-RC-003', '44444444-4444-4444-4444-444444444403');

-- 5. Inserção de Disciplinas (Cenário Obrigatório: mínimo 8 disciplinas)
INSERT INTO disciplinas (id, nome, codigo, carga_horaria) VALUES
('77777777-7777-7777-7777-777777777701', 'Banco de Dados Avançado', 'BD01', 80),
('77777777-7777-7777-7777-777777777702', 'Desenvolvimento Web Full Stack', 'DW02', 80),
('77777777-7777-7777-7777-777777777703', 'Redes de Computadores', 'RC03', 60),
('77777777-7777-7777-7777-777777777704', 'Inteligência Artificial e Heurísticas', 'IA04', 80),
('77777777-7777-7777-7777-777777777705', 'Sistemas Distribuídos e Cloud', 'SD05', 60),
('77777777-7777-7777-7777-777777777706', 'Engenharia de Software e UML', 'ES06', 60),
('77777777-7777-7777-7777-777777777707', 'Segurança da Informação', 'SI07', 60),
('77777777-7777-7777-7777-777777777708', 'Projeto Integrador de Computação', 'PI08', 80);

-- 6. Inserção de Salas (Cenário Obrigatório: mínimo 5 salas)
INSERT INTO salas (id, identificacao, capacidade, tipo) VALUES
('88888888-8888-8888-8888-888888888801', 'Lab. Computação 101', 40, 'Laboratório de Informática'),
('88888888-8888-8888-8888-888888888802', 'Lab. Redes & Hardware 102', 35, 'Laboratório de Redes'),
('88888888-8888-8888-8888-888888888803', 'Lab. Inteligência Artificial 103', 30, 'Laboratório de IA'),
('88888888-8888-8888-8888-888888888804', 'Sala de Aula Teórica 201', 45, 'Sala Teórica com Projetor'),
('88888888-8888-8888-8888-888888888805', 'Sala Maker & Inovação 202', 30, 'Espaço Maker / Metodologias Ativas');

-- 7. Inserção de Disponibilidades
-- CENÁRIO OBRIGATÓRIO: "Professor registra disponibilidade apenas às segundas e quartas."
-- Prof. Roberto Lima (55555555-5555-5555-5555-555555555501): SOMENTE SEGUNDAS E QUARTAS!
INSERT INTO disponibilidades (professor_id, dia, inicio, fim, status) VALUES
('55555555-5555-5555-5555-555555555501', 'segunda', '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555501', 'quarta',  '08:00', '12:00', 'aprovado');

-- Profa. Camila Duarte: Segunda a Sexta (Matutino)
INSERT INTO disponibilidades (professor_id, dia, inicio, fim, status) VALUES
('55555555-5555-5555-5555-555555555502', 'segunda', '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555502', 'terca',   '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555502', 'quarta',  '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555502', 'quinta',  '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555502', 'sexta',   '08:00', '12:00', 'aprovado');

-- Prof. Marcos Vinicius: Terças, Quintas e Sextas
INSERT INTO disponibilidades (professor_id, dia, inicio, fim, status) VALUES
('55555555-5555-5555-5555-555555555503', 'terca',   '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555503', 'quinta',  '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555503', 'sexta',   '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555503', 'terca',   '13:00', '17:00', 'aprovado'),
('55555555-5555-5555-5555-555555555503', 'quinta',  '13:00', '17:00', 'aprovado');

-- Profa. Juliana Santos: Segunda a Sexta (Matutino e Vespertino)
INSERT INTO disponibilidades (professor_id, dia, inicio, fim, status) VALUES
('55555555-5555-5555-5555-555555555504', 'segunda', '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555504', 'terca',   '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555504', 'quarta',  '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555504', 'quinta',  '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555504', 'sexta',   '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555504', 'segunda', '13:00', '17:00', 'aprovado'),
('55555555-5555-5555-5555-555555555504', 'quarta',  '13:00', '17:00', 'aprovado');

-- Prof. André Silveira: Segundas, Terças e Quintas
INSERT INTO disponibilidades (professor_id, dia, inicio, fim, status) VALUES
('55555555-5555-5555-5555-555555555505', 'segunda', '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555505', 'terca',   '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555505', 'quinta',  '08:00', '12:00', 'aprovado');

-- Profa. Fernanda Rocha: Quartas, Quintas e Sextas
INSERT INTO disponibilidades (professor_id, dia, inicio, fim, status) VALUES
('55555555-5555-5555-5555-555555555506', 'quarta',  '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555506', 'quinta',  '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555506', 'sexta',   '08:00', '12:00', 'aprovado'),
('55555555-5555-5555-5555-555555555506', 'quarta',  '13:00', '17:00', 'aprovado'),
('55555555-5555-5555-5555-555555555506', 'sexta',   '13:00', '17:00', 'aprovado');

-- 8. Atribuição de Disciplinas às Turmas (turma_disciplinas)
-- Turma 1: Eng. Computação (5º Semestre - Matutino)
-- BD01 (Prof. Roberto), DW02 (Profa. Camila), IA04 (Profa. Juliana), SD05 (Prof. André)
INSERT INTO turma_disciplinas (turma_id, disciplina_id, professor_id, carga_semanal) VALUES
('44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', 4), -- BD01 c/ Roberto
('44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555502', 4), -- DW02 c/ Camila
('44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777704', '55555555-5555-5555-5555-555555555504', 4), -- IA04 c/ Juliana
('44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777705', '55555555-5555-5555-5555-555555555505', 4), -- SD05 c/ André
('44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777708', '55555555-5555-5555-5555-555555555506', 4); -- PI08 c/ Fernanda

-- Turma 2: ADS - 3º Semestre (Matutino)
-- BD01 (Prof. Roberto), DW02 (Profa. Camila), ES06 (Profa. Fernanda), RC03 (Prof. Marcos)
INSERT INTO turma_disciplinas (turma_id, disciplina_id, professor_id, carga_semanal) VALUES
('44444444-4444-4444-4444-444444444402', '77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', 4), -- BD01 c/ Roberto
('44444444-4444-4444-4444-444444444402', '77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555502', 4), -- DW02 c/ Camila
('44444444-4444-4444-4444-444444444402', '77777777-7777-7777-7777-777777777706', '55555555-5555-5555-5555-555555555506', 4), -- ES06 c/ Fernanda
('44444444-4444-4444-4444-444444444402', '77777777-7777-7777-7777-777777777703', '55555555-5555-5555-5555-555555555503', 4); -- RC03 c/ Marcos

-- Turma 3: Redes - 2º Semestre (Vespertino)
-- RC03 (Prof. Marcos), SI07 (Profa. Juliana), SD05 (Profa. Fernanda)
INSERT INTO turma_disciplinas (turma_id, disciplina_id, professor_id, carga_semanal) VALUES
('44444444-4444-4444-4444-444444444403', '77777777-7777-7777-7777-777777777703', '55555555-5555-5555-5555-555555555503', 4), -- RC03 c/ Marcos
('44444444-4444-4444-4444-444444444403', '77777777-7777-7777-7777-777777777707', '55555555-5555-5555-5555-555555555504', 4), -- SI07 c/ Juliana
('44444444-4444-4444-4444-444444444403', '77777777-7777-7777-7777-777777777705', '55555555-5555-5555-5555-555555555506', 4); -- SD05 c/ Fernanda

-- 9. Versão Inicial da Grade Horária (Publicada e Oficial)
INSERT INTO versoes_horario (id, periodo, status, data, responsavel, observacoes) VALUES
('99999999-9999-9999-9999-999999999901', '2026.1', 'publicada', CURRENT_TIMESTAMP, '11111111-1111-1111-1111-111111111111', 'Grade oficial do 1º semestre de 2026 publicada pela coordenação');

-- 10. Grade Horária Alocada Oficialmente para Turma 1 (Engenharia de Computação - Matutino)
-- Note: O Prof. Roberto Lima ministra BD01 APENAS na Segunda e Quarta (respeitando sua restrição)
INSERT INTO horarios (versao_id, turma_id, disciplina_id, professor_id, sala_id, dia, inicio, fim) VALUES
-- Segunda-feira: BD01 com Prof. Roberto Lima no Lab 101
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', '88888888-8888-8888-8888-888888888801', 'segunda', '08:00', '10:00'),
-- Segunda-feira: DW02 com Profa. Camila no Lab 101
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555502', '88888888-8888-8888-8888-888888888801', 'segunda', '10:20', '12:00'),

-- Terça-feira: SD05 com Prof. André Silveira na Sala 201
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777705', '55555555-5555-5555-5555-555555555505', '88888888-8888-8888-8888-888888888804', 'terca', '08:00', '10:00'),
-- Terça-feira: IA04 com Profa. Juliana no Lab IA 103
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777704', '55555555-5555-5555-5555-555555555504', '88888888-8888-8888-8888-888888888803', 'terca', '10:20', '12:00'),

-- Quarta-feira: BD01 com Prof. Roberto Lima no Lab 101 (respeitando disponibilidade)
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', '88888888-8888-8888-8888-888888888801', 'quarta', '08:00', '10:00'),
-- Quarta-feira: PI08 com Profa. Fernanda na Sala Maker 202
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777708', '55555555-5555-5555-5555-555555555506', '88888888-8888-8888-8888-888888888805', 'quarta', '10:20', '12:00'),

-- Quinta-feira: IA04 com Profa. Juliana no Lab IA 103
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777704', '55555555-5555-5555-5555-555555555504', '88888888-8888-8888-8888-888888888803', 'quinta', '08:00', '10:00'),
-- Quinta-feira: SD05 com Prof. André na Sala 201
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777705', '55555555-5555-5555-5555-555555555505', '88888888-8888-8888-8888-888888888804', 'quinta', '10:20', '12:00'),

-- Sexta-feira: DW02 com Profa. Camila no Lab 101
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555502', '88888888-8888-8888-8888-888888888801', 'sexta', '08:00', '10:00'),
-- Sexta-feira: PI08 com Profa. Fernanda na Sala Maker 202
('99999999-9999-9999-9999-999999999901', '44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777708', '55555555-5555-5555-5555-555555555506', '88888888-8888-8888-8888-888888888805', 'sexta', '10:20', '12:00');

-- 11. Inserção de Histórico de Alterações (Auditoria Inicial)
INSERT INTO historico_alteracoes (usuario_id, operacao, data, valores_alterados) VALUES
('11111111-1111-1111-1111-111111111111', 'PUBLICAR_VERSAO', CURRENT_TIMESTAMP - INTERVAL '1 day', '{"versao_id": "99999999-9999-9999-9999-999999999901", "periodo": "2026.1", "status_anterior": "em_revisao", "novo_status": "publicada"}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'GERAR_GRADE_AUTOMATICA', CURRENT_TIMESTAMP - INTERVAL '2 days', '{"periodo": "2026.1", "turmas_alocadas": 3, "conflitos_detectados": 0, "status": "sucesso"}'::jsonb);

