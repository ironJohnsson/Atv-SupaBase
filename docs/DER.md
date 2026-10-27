# Diagrama Entidade-Relacionamento (DER)
## SUCELSO TECH - Sistema Inteligente de Horários Escolares
**Universidade Senai Cimatec | Engenharia de Computação | Prof. Celso Barreto**

Este documento detalha o modelo de dados relacional implementado no PostgreSQL via Supabase para atender a todos os requisitos e regras da situação de aprendizagem.

```mermaid
erDiagram
    USUARIOS ||--o| PROFESSORES : "possui vínculo"
    USUARIOS ||--o| ALUNOS : "possui vínculo"
    USUARIOS ||--o{ VERSOES_HORARIO : "cria/aprova"
    USUARIOS ||--o{ HISTORICO_ALTERACOES : "gera auditoria"

    TURMAS ||--o{ ALUNOS : "matriculados"
    TURMAS ||--o{ TURMA_DISCIPLINAS : "possui grade curricular"
    TURMAS ||--o{ HORARIOS : "possui aulas alocadas"

    DISCIPLINAS ||--o{ TURMA_DISCIPLINAS : "ofertada em"
    DISCIPLINAS ||--o{ HORARIOS : "lecionada em"

    PROFESSORES ||--o{ DISPONIBILIDADES : "informa horários"
    PROFESSORES ||--o{ TURMA_DISCIPLINAS : "ministra"
    PROFESSORES ||--o{ HORARIOS : "alocado em"

    SALAS ||--o{ HORARIOS : "alocada para"

    VERSOES_HORARIO ||--o{ HORARIOS : "contém alocações"

    USUARIOS {
        uuid id PK
        string nome
        string email UK
        string senha_hash
        enum perfil "aluno, professor, coordenador"
        timestamp criado_em
        timestamp atualizado_em
    }

    PROFESSORES {
        uuid id PK
        uuid usuario_id FK
        string matricula UK
        string especialidade
        timestamp criado_em
    }

    ALUNOS {
        uuid id PK
        uuid usuario_id FK
        string matricula UK
        uuid turma_id FK
        timestamp criado_em
    }

    TURMAS {
        uuid id PK
        string nome
        enum turno "matutino, vespertino, noturno"
        string periodo_letivo
        timestamp criado_em
    }

    DISCIPLINAS {
        uuid id PK
        string nome
        string codigo UK
        int carga_horaria
        timestamp criado_em
    }

    SALAS {
        uuid id PK
        string identificacao UK
        int capacidade
        string tipo
        timestamp criado_em
    }

    DISPONIBILIDADES {
        uuid id PK
        uuid professor_id FK
        enum dia "segunda, terca, quarta, quinta, sexta, sabado"
        time inicio
        time fim
        string status "aprovado, pendente_aprovacao"
        timestamp criado_em
    }

    TURMA_DISCIPLINAS {
        uuid id PK
        uuid turma_id FK
        uuid disciplina_id FK
        uuid professor_id FK
        int carga_semanal
        timestamp criado_em
    }

    VERSOES_HORARIO {
        uuid id PK
        string periodo
        enum status "rascunho, em_revisao, publicada"
        timestamp data
        uuid responsavel FK
        text observacoes
    }

    HORARIOS {
        uuid id PK
        uuid versao_id FK
        uuid turma_id FK
        uuid disciplina_id FK
        uuid professor_id FK
        uuid sala_id FK
        enum dia "segunda, terca, quarta, quinta, sexta"
        time inicio
        time fim
        timestamp criado_em
    }

    HISTORICO_ALTERACOES {
        uuid id PK
        uuid usuario_id FK
        string operacao
        timestamp data
        jsonb valores_alterados
    }
```

