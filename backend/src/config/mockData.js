// ====================================================================
// SUCELSO TECH - Repositório de Dados em Memória (Fallback & Seed)
// Atende rigorosamente ao Cenário Obrigatório de Validação (Item 10)
// ====================================================================

const bcrypt = require('bcryptjs');

// Hash bcrypt para a senha padrão 'senha123'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('senha123', 10);

const mockStore = {
  usuarios: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      nome: 'Prof. Celso Barreto (Coordenador)',
      email: 'coordenador@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'coordenador'
    },
    {
      id: '22222222-2222-2222-2222-222222222201',
      nome: 'Prof. Roberto Lima (Restrição Estrita)',
      email: 'roberto@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'professor'
    },
    {
      id: '22222222-2222-2222-2222-222222222202',
      nome: 'Profa. Camila Duarte',
      email: 'camila@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'professor'
    },
    {
      id: '22222222-2222-2222-2222-222222222203',
      nome: 'Prof. Marcos Vinicius',
      email: 'marcos@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'professor'
    },
    {
      id: '22222222-2222-2222-2222-222222222204',
      nome: 'Profa. Juliana Santos',
      email: 'juliana@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'professor'
    },
    {
      id: '22222222-2222-2222-2222-222222222205',
      nome: 'Prof. André Silveira',
      email: 'andre@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'professor'
    },
    {
      id: '22222222-2222-2222-2222-222222222206',
      nome: 'Profa. Fernanda Rocha',
      email: 'fernanda@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'professor'
    },
    {
      id: '33333333-3333-3333-3333-333333333301',
      nome: 'Lucas Silva (Aluno Eng. Computação)',
      email: 'lucas.aluno@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'aluno'
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      nome: 'Mariana Souza (Aluna ADS)',
      email: 'mariana.aluno@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'aluno'
    },
    {
      id: '33333333-3333-3333-3333-333333333303',
      nome: 'Felipe Castro (Aluno Redes)',
      email: 'felipe.aluno@sucelso.tech',
      senha_hash: DEFAULT_PASSWORD_HASH,
      perfil: 'aluno'
    }
  ],

  // 3 Turmas Obrigatórias
  turmas: [
    {
      id: '44444444-4444-4444-4444-444444444401',
      nome: 'Engenharia de Computação - 5º Semestre',
      turno: 'matutino',
      periodo_letivo: '2026.1'
    },
    {
      id: '44444444-4444-4444-4444-444444444402',
      nome: 'Análise e Desenv. de Sistemas (ADS) - 3º Sem',
      turno: 'matutino',
      periodo_letivo: '2026.1'
    },
    {
      id: '44444444-4444-4444-4444-444444444403',
      nome: 'Redes de Computadores - 2º Semestre',
      turno: 'vespertino',
      periodo_letivo: '2026.1'
    }
  ],

  // 6 Professores Obrigatórios
  professores: [
    {
      id: '55555555-5555-5555-5555-555555555501',
      usuario_id: '22222222-2222-2222-2222-222222222201',
      matricula: 'MATR-P001',
      nome: 'Prof. Roberto Lima (Restrição Estrita)',
      email: 'roberto@sucelso.tech',
      especialidade: 'Banco de Dados e Big Data'
    },
    {
      id: '55555555-5555-5555-5555-555555555502',
      usuario_id: '22222222-2222-2222-2222-222222222202',
      matricula: 'MATR-P002',
      nome: 'Profa. Camila Duarte',
      email: 'camila@sucelso.tech',
      especialidade: 'Desenvolvimento Web e Mobile'
    },
    {
      id: '55555555-5555-5555-5555-555555555503',
      usuario_id: '22222222-2222-2222-2222-222222222203',
      matricula: 'MATR-P003',
      nome: 'Prof. Marcos Vinicius',
      email: 'marcos@sucelso.tech',
      especialidade: 'Redes e Infraestrutura'
    },
    {
      id: '55555555-5555-5555-5555-555555555504',
      usuario_id: '22222222-2222-2222-2222-222222222204',
      matricula: 'MATR-P004',
      nome: 'Profa. Juliana Santos',
      email: 'juliana@sucelso.tech',
      especialidade: 'Inteligência Artificial e Heurísticas'
    },
    {
      id: '55555555-5555-5555-5555-555555555505',
      usuario_id: '22222222-2222-2222-2222-222222222205',
      matricula: 'MATR-P005',
      nome: 'Prof. André Silveira',
      email: 'andre@sucelso.tech',
      especialidade: 'Sistemas Operacionais e Cloud'
    },
    {
      id: '55555555-5555-5555-5555-555555555506',
      usuario_id: '22222222-2222-2222-2222-222222222206',
      matricula: 'MATR-P006',
      nome: 'Profa. Fernanda Rocha',
      email: 'fernanda@sucelso.tech',
      especialidade: 'Engenharia de Software e Projetos'
    }
  ],

  // 3 Alunos de Teste
  alunos: [
    {
      id: '66666666-6666-6666-6666-666666666601',
      usuario_id: '33333333-3333-3333-3333-333333333301',
      matricula: 'ALU-EC-001',
      nome: 'Lucas Silva (Aluno Eng. Computação)',
      turma_id: '44444444-4444-4444-4444-444444444401'
    },
    {
      id: '66666666-6666-6666-6666-666666666602',
      usuario_id: '33333333-3333-3333-3333-333333333302',
      matricula: 'ALU-ADS-002',
      nome: 'Mariana Souza (Aluna ADS)',
      turma_id: '44444444-4444-4444-4444-444444444402'
    },
    {
      id: '66666666-6666-6666-6666-666666666603',
      usuario_id: '33333333-3333-3333-3333-333333333303',
      matricula: 'ALU-RC-003',
      nome: 'Felipe Castro (Aluno Redes)',
      turma_id: '44444444-4444-4444-4444-444444444403'
    }
  ],

  // 8 Disciplinas Obrigatórias
  disciplinas: [
    { id: '77777777-7777-7777-7777-777777777701', nome: 'Banco de Dados Avançado', codigo: 'BD01', carga_horaria: 80 },
    { id: '77777777-7777-7777-7777-777777777702', nome: 'Desenvolvimento Web Full Stack', codigo: 'DW02', carga_horaria: 80 },
    { id: '77777777-7777-7777-7777-777777777703', nome: 'Redes de Computadores', codigo: 'RC03', carga_horaria: 60 },
    { id: '77777777-7777-7777-7777-777777777704', nome: 'Inteligência Artificial e Heurísticas', codigo: 'IA04', carga_horaria: 80 },
    { id: '77777777-7777-7777-7777-777777777705', nome: 'Sistemas Distribuídos e Cloud', codigo: 'SD05', carga_horaria: 60 },
    { id: '77777777-7777-7777-7777-777777777706', nome: 'Engenharia de Software e UML', codigo: 'ES06', carga_horaria: 60 },
    { id: '77777777-7777-7777-7777-777777777707', nome: 'Segurança da Informação', codigo: 'SI07', carga_horaria: 60 },
    { id: '77777777-7777-7777-7777-777777777708', nome: 'Projeto Integrador de Computação', codigo: 'PI08', carga_horaria: 80 }
  ],

  // 5 Salas Obrigatórias
  salas: [
    { id: '88888888-8888-8888-8888-888888888801', identificacao: 'Lab. Computação 101', capacidade: 40, tipo: 'Laboratório de Informática' },
    { id: '88888888-8888-8888-8888-888888888802', identificacao: 'Lab. Redes & Hardware 102', capacidade: 35, tipo: 'Laboratório de Redes' },
    { id: '88888888-8888-8888-8888-888888888803', identificacao: 'Lab. Inteligência Artificial 103', capacidade: 30, tipo: 'Laboratório de IA' },
    { id: '88888888-8888-8888-8888-888888888804', identificacao: 'Sala de Aula Teórica 201', capacidade: 45, tipo: 'Sala Teórica com Projetor' },
    { id: '88888888-8888-8888-8888-888888888805', identificacao: 'Sala Maker & Inovação 202', capacidade: 30, tipo: 'Espaço Maker / Inovação' }
  ],

  // Disponibilidades
  // Prof. Roberto Lima (55555555-5555-5555-5555-555555555501): Restrição estrita - APENAS Segundas e Quartas!
  disponibilidades: [
    { id: 'disp-01', professor_id: '55555555-5555-5555-5555-555555555501', dia: 'segunda', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-02', professor_id: '55555555-5555-5555-5555-555555555501', dia: 'quarta', inicio: '08:00', fim: '12:00', status: 'aprovado' },

    // Profa. Camila Duarte: Segunda a Sexta Matutino
    { id: 'disp-03', professor_id: '55555555-5555-5555-5555-555555555502', dia: 'segunda', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-04', professor_id: '55555555-5555-5555-5555-555555555502', dia: 'terca', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-05', professor_id: '55555555-5555-5555-5555-555555555502', dia: 'quarta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-06', professor_id: '55555555-5555-5555-5555-555555555502', dia: 'quinta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-07', professor_id: '55555555-5555-5555-5555-555555555502', dia: 'sexta', inicio: '08:00', fim: '12:00', status: 'aprovado' },

    // Prof. Marcos Vinicius: Terças, Quintas e Sextas
    { id: 'disp-08', professor_id: '55555555-5555-5555-5555-555555555503', dia: 'terca', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-09', professor_id: '55555555-5555-5555-5555-555555555503', dia: 'quinta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-10', professor_id: '55555555-5555-5555-5555-555555555503', dia: 'sexta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-11', professor_id: '55555555-5555-5555-5555-555555555503', dia: 'terca', inicio: '13:00', fim: '17:00', status: 'aprovado' },
    { id: 'disp-12', professor_id: '55555555-5555-5555-5555-555555555503', dia: 'quinta', inicio: '13:00', fim: '17:00', status: 'aprovado' },

    // Profa. Juliana Santos: Segunda a Sexta Matutino e Vespertino
    { id: 'disp-13', professor_id: '55555555-5555-5555-5555-555555555504', dia: 'segunda', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-14', professor_id: '55555555-5555-5555-5555-555555555504', dia: 'terca', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-15', professor_id: '55555555-5555-5555-5555-555555555504', dia: 'quarta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-16', professor_id: '55555555-5555-5555-5555-555555555504', dia: 'quinta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-17', professor_id: '55555555-5555-5555-5555-555555555504', dia: 'sexta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-18', professor_id: '55555555-5555-5555-5555-555555555504', dia: 'segunda', inicio: '13:00', fim: '17:00', status: 'aprovado' },
    { id: 'disp-19', professor_id: '55555555-5555-5555-5555-555555555504', dia: 'quarta', inicio: '13:00', fim: '17:00', status: 'aprovado' },

    // Prof. André Silveira: Segundas, Terças e Quintas
    { id: 'disp-20', professor_id: '55555555-5555-5555-5555-555555555505', dia: 'segunda', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-21', professor_id: '55555555-5555-5555-5555-555555555505', dia: 'terca', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-22', professor_id: '55555555-5555-5555-5555-555555555505', dia: 'quinta', inicio: '08:00', fim: '12:00', status: 'aprovado' },

    // Profa. Fernanda Rocha: Quartas, Quintas e Sextas
    { id: 'disp-23', professor_id: '55555555-5555-5555-5555-555555555506', dia: 'quarta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-24', professor_id: '55555555-5555-5555-5555-555555555506', dia: 'quinta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-25', professor_id: '55555555-5555-5555-5555-555555555506', dia: 'sexta', inicio: '08:00', fim: '12:00', status: 'aprovado' },
    { id: 'disp-26', professor_id: '55555555-5555-5555-5555-555555555506', dia: 'quarta', inicio: '13:00', fim: '17:00', status: 'aprovado' },
    { id: 'disp-27', professor_id: '55555555-5555-5555-5555-555555555506', dia: 'sexta', inicio: '13:00', fim: '17:00', status: 'aprovado' }
  ],

  // Atribuições: turma_disciplinas
  turma_disciplinas: [
    // Turma 1 - Eng. Computação (Matutino)
    { id: 'td-01', turma_id: '44444444-4444-4444-4444-444444444401', disciplina_id: '77777777-7777-7777-7777-777777777701', professor_id: '55555555-5555-5555-5555-555555555501', carga_semanal: 4 },
    { id: 'td-02', turma_id: '44444444-4444-4444-4444-444444444401', disciplina_id: '77777777-7777-7777-7777-777777777702', professor_id: '55555555-5555-5555-5555-555555555502', carga_semanal: 4 },
    { id: 'td-03', turma_id: '44444444-4444-4444-4444-444444444401', disciplina_id: '77777777-7777-7777-7777-777777777704', professor_id: '55555555-5555-5555-5555-555555555504', carga_semanal: 4 },
    { id: 'td-04', turma_id: '44444444-4444-4444-4444-444444444401', disciplina_id: '77777777-7777-7777-7777-777777777705', professor_id: '55555555-5555-5555-5555-555555555505', carga_semanal: 4 },
    { id: 'td-05', turma_id: '44444444-4444-4444-4444-444444444401', disciplina_id: '77777777-7777-7777-7777-777777777708', professor_id: '55555555-5555-5555-5555-555555555506', carga_semanal: 4 },

    // Turma 2 - ADS (Matutino)
    { id: 'td-06', turma_id: '44444444-4444-4444-4444-444444444402', disciplina_id: '77777777-7777-7777-7777-777777777701', professor_id: '55555555-5555-5555-5555-555555555501', carga_semanal: 4 },
    { id: 'td-07', turma_id: '44444444-4444-4444-4444-444444444402', disciplina_id: '77777777-7777-7777-7777-777777777702', professor_id: '55555555-5555-5555-5555-555555555502', carga_semanal: 4 },
    { id: 'td-08', turma_id: '44444444-4444-4444-4444-444444444402', disciplina_id: '77777777-7777-7777-7777-777777777706', professor_id: '55555555-5555-5555-5555-555555555506', carga_semanal: 4 },
    { id: 'td-09', turma_id: '44444444-4444-4444-4444-444444444402', disciplina_id: '77777777-7777-7777-7777-777777777703', professor_id: '55555555-5555-5555-5555-555555555503', carga_semanal: 4 },

    // Turma 3 - Redes (Vespertino)
    { id: 'td-10', turma_id: '44444444-4444-4444-4444-444444444403', disciplina_id: '77777777-7777-7777-7777-777777777703', professor_id: '55555555-5555-5555-5555-555555555503', carga_semanal: 4 },
    { id: 'td-11', turma_id: '44444444-4444-4444-4444-444444444403', disciplina_id: '77777777-7777-7777-7777-777777777707', professor_id: '55555555-5555-5555-5555-555555555504', carga_semanal: 4 },
    { id: 'td-12', turma_id: '44444444-4444-4444-4444-444444444403', disciplina_id: '77777777-7777-7777-7777-777777777705', professor_id: '55555555-5555-5555-5555-555555555506', carga_semanal: 4 }
  ],

  // Versões de Horário
  versoes_horario: [
    {
      id: '99999999-9999-9999-9999-999999999901',
      periodo: '2026.1',
      status: 'publicada', // oficial
      data: new Date().toISOString(),
      responsavel: '11111111-1111-1111-1111-111111111111',
      observacoes: 'Grade oficial do 1º semestre de 2026 homologada pela coordenação'
    }
  ],

  // Horários Alocados para Turma 1 (Engenharia de Computação)
  horarios: [
    // Segunda-feira (Prof. Roberto Lima alocado em Segunda, respeitando restrição)
    {
      id: 'h-01',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777701', // BD01
      professor_id: '55555555-5555-5555-5555-555555555501', // Roberto Lima
      sala_id: '88888888-8888-8888-8888-888888888801',      // Lab 101
      dia: 'segunda',
      inicio: '08:00',
      fim: '10:00'
    },
    {
      id: 'h-02',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777702', // DW02
      professor_id: '55555555-5555-5555-5555-555555555502', // Camila
      sala_id: '88888888-8888-8888-8888-888888888801',      // Lab 101
      dia: 'segunda',
      inicio: '10:20',
      fim: '12:00'
    },
    // Terça-feira
    {
      id: 'h-03',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777705', // SD05
      professor_id: '55555555-5555-5555-5555-555555555505', // André
      sala_id: '88888888-8888-8888-8888-888888888804',      // Sala 201
      dia: 'terca',
      inicio: '08:00',
      fim: '10:00'
    },
    {
      id: 'h-04',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777704', // IA04
      professor_id: '55555555-5555-5555-5555-555555555504', // Juliana
      sala_id: '88888888-8888-8888-8888-888888888803',      // Lab IA 103
      dia: 'terca',
      inicio: '10:20',
      fim: '12:00'
    },
    // Quarta-feira (Prof. Roberto Lima alocado em Quarta, respeitando restrição)
    {
      id: 'h-05',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777701', // BD01
      professor_id: '55555555-5555-5555-5555-555555555501', // Roberto Lima
      sala_id: '88888888-8888-8888-8888-888888888801',      // Lab 101
      dia: 'quarta',
      inicio: '08:00',
      fim: '10:00'
    },
    {
      id: 'h-06',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777708', // PI08
      professor_id: '55555555-5555-5555-5555-555555555506', // Fernanda
      sala_id: '88888888-8888-8888-8888-888888888805',      // Sala Maker 202
      dia: 'quarta',
      inicio: '10:20',
      fim: '12:00'
    },
    // Quinta-feira
    {
      id: 'h-07',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777704', // IA04
      professor_id: '55555555-5555-5555-5555-555555555504', // Juliana
      sala_id: '88888888-8888-8888-8888-888888888803',      // Lab IA 103
      dia: 'quinta',
      inicio: '08:00',
      fim: '10:00'
    },
    {
      id: 'h-08',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777705', // SD05
      professor_id: '55555555-5555-5555-5555-555555555505', // André
      sala_id: '88888888-8888-8888-8888-888888888804',      // Sala 201
      dia: 'quinta',
      inicio: '10:20',
      fim: '12:00'
    },
    // Sexta-feira
    {
      id: 'h-09',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777702', // DW02
      professor_id: '55555555-5555-5555-5555-555555555502', // Camila
      sala_id: '88888888-8888-8888-8888-888888888801',      // Lab 101
      dia: 'sexta',
      inicio: '08:00',
      fim: '10:00'
    },
    {
      id: 'h-10',
      versao_id: '99999999-9999-9999-9999-999999999901',
      turma_id: '44444444-4444-4444-4444-444444444401',
      disciplina_id: '77777777-7777-7777-7777-777777777708', // PI08
      professor_id: '55555555-5555-5555-5555-555555555506', // Fernanda
      sala_id: '88888888-8888-8888-8888-888888888805',      // Sala Maker 202
      dia: 'sexta',
      inicio: '10:20',
      fim: '12:00'
    }
  ],

  // Histórico de Alterações (Auditoria)
  historico_alteracoes: [
    {
      id: 'hist-01',
      usuario_id: '11111111-1111-1111-1111-111111111111',
      operacao: 'PUBLICAR_VERSAO',
      data: new Date(Date.now() - 86400000).toISOString(),
      valores_alterados: {
        versao_id: '99999999-9999-9999-9999-999999999901',
        periodo: '2026.1',
        status_anterior: 'em_revisao',
        novo_status: 'publicada'
      }
    },
    {
      id: 'hist-02',
      usuario_id: '11111111-1111-1111-1111-111111111111',
      operacao: 'GERAR_GRADE_AUTOMATICA',
      data: new Date(Date.now() - 172800000).toISOString(),
      valores_alterados: {
        periodo: '2026.1',
        turmas_alocadas: 3,
        conflitos_detectados: 0,
        status: 'sucesso'
      }
    }
  ]
};

module.exports = mockStore;

