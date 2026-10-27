# Documento de Requisitos e Regras de Negócio
## SUCELSO TECH - Sistema Inteligente de Horários Escolares
**Universidade Senai Cimatec | Engenharia de Computação**
**Docente Responsável:** Prof. Celso Barreto

---

### 1. Visão Geral do Produto
O **SUCELSO TECH** é um sistema web integrado Full Stack projetado para solucionar os problemas de gestão e publicação de horários acadêmicos. Centraliza as disponibilidades dos docentes, gera grades automáticas por meio de algoritmo heurístico de satisfação de restrições com minimização de janelas (gap reduction), previne conflitos de salas e turmas, e garante que apenas a coordenação possa validar e publicar a versão oficial.

---

### 2. Matriz de Perfis e Permissões (RBAC)

| Módulo / Funcionalidade | Aluno | Professor | Coordenador | Justificativa / Regra |
| :--- | :---: | :---: | :---: | :--- |
| **Login e Autenticação JWT** | Sim | Sim | Sim | Acesso individual com token seguro e identificação de perfil. |
| **Consultar Horário da Minha Turma** | Sim | Sim | Sim | Aluno vê somente sua turma; Coordenador vê todas. |
| **Consultar Horário do Próprio Docente** | Não | Sim | Sim | Professor vê turmas atribuídas e seus slots. |
| **Consultar Salas, Disciplinas e Turmas** | Sim | Sim | Sim | Leitura pública para usuários autenticados. |
| **Cadastrar Disponibilidade Própria** | Não | Sim | Sim | Professor cadastra dias e horários em que pode lecionar. |
| **Editar Disponibilidade Própria** | Não | Sim | Sim | Em período de coleta edita direto; após publicação entra em status pendente. |
| **Gerar Proposta de Grade Automática** | Não | Não | Sim | Execução do algoritmo de alocação por restrições (CSP). |
| **Ajustar Slots de Horários Manualmente** | Não | Não | Sim | Remanejamento de sala, horário, professor ou disciplina com auditoria. |
| **Aprovar e Publicar Grade Oficial** | Não | Não | Sim | Transição de estado de versão (`rascunho` -> `em_revisao` -> `publicada`). |
| **Cadastros Acadêmicos (CRUD)** | Não | Não | Sim | Gestão de turmas, docentes, alunos, disciplinas e salas. |
| **Relatório de Conflitos e Ocupação** | Não | Não | Sim | Diagnóstico de duplicidades, janelas e taxa de uso de laboratórios. |
| **Auditoria e Histórico de Alterações** | Não | Não | Sim | Registro com timestamp, usuário e delta JSONB de modificações. |

---

### 3. Requisitos Funcionais Obrigatórios

#### Módulo 1: Autenticação e Sessão
- **RF01.1**: O sistema deve permitir autenticação com e-mail e senha.
- **RF01.2**: O backend deve validar o token JWT e o perfil do usuário em todas as rotas protegidas contra acessos indevidos via API direta.
- **RF01.3**: Bloqueio de alunos e professores em rotas administrativas (HTTP 403 Forbidden).

#### Módulo 2: Gestão Acadêmica
- **RF02.1**: Cadastro completo de turmas com identificação de turno e período letivo.
- **RF02.2**: Cadastro de disciplinas com carga horária e código único.
- **RF02.3**: Cadastro de salas com capacidade física e tipo (Laboratório / Sala Teórica).
- **RF02.4**: Vínculo entre Turma, Disciplina, Professor e Carga Horária Semanal (`turma_disciplinas`).

#### Módulo 3: Disponibilidade Docente
- **RF03.1**: Professores registram janelas de disponibilidade por dia da semana e horários de início e término.
- **RF03.2**: A edição é livre antes da publicação oficial. Após a grade ser publicada, qualquer alteração docente gera solicitação/status pendente sem desestruturar a grade já vigente.

#### Módulo 4: Geração Inteligente e Detecção de Conflitos
- **RF04.1**: O coordenador aciona o algoritmo de satisfação de restrições (CSP).
- **RF04.2 (Restrição R1)**: Nenhum professor pode lecionar em duas salas/turmas no mesmo intervalo de tempo.
- **RF04.3 (Restrição R2)**: Nenhuma sala pode receber mais de uma turma no mesmo intervalo de tempo.
- **RF04.4 (Restrição R3)**: Nenhuma turma pode cursar duas disciplinas simultaneamente.
- **RF04.5 (Restrição R4)**: Toda alocação deve respeitar a janela de disponibilidade cadastrada pelo professor.
- **RF04.6 (Restrição R5)**: A carga horária semanal da disciplina deve ser satisfeita.
- **RF04.7 (Restrição R6)**: Relatório de conflitos deve evidenciar qualquer impossibilidade de alocação ou choque de horários.
- **RF04.8 (Diferencial de Excelência)**: Otimização para redução de janelas vazias (gaps) para turmas e docentes.

#### Módulo 5: Visualização Responsiva e Exportação
- **RF05.1**: Interface gráfica de grade semanal (Segunda a Sexta) com slots temporais claros, intervalos de recreio identificados, cores distintas por disciplina e exibição de sala e docente.
- **RF05.2 (Diferencial de Excelência)**: Botão de Exportação para documento PDF formatado e pronto para impressão/divulgação institucional.
- **RF05.3 (Diferencial de Excelência)**: Painel de Indicadores de Taxa de Ocupação das Salas (Analytics).

#### Módulo 6: Versionamento, Publicação e Auditoria
- **RF06.1**: Versões de grade com estados obrigatórios: `rascunho`, `em_revisao`, `publicada`.
- **RF06.2**: Alunos e professores têm visibilidade apenas de versões no status `publicada`.
- **RF06.3**: Toda operação de geração, ajuste de slot e publicação é registrada na tabela `historico_alteracoes`.

---

### 4. Requisitos Não Funcionais
- **RNF01 (Arquitetura)**: Backend Node.js/Express (Render), Frontend SPA React (Vercel), Banco PostgreSQL (Supabase).
- **RNF02 (Segurança)**: Credenciais e chaves em variáveis de ambiente (`.env`). Senhas protegidas com hash criptográfico (bcrypt).
- **RNF03 (Responsividade)**: Interface compatível com dispositivos móveis, tablets e desktops (Tailwind CSS).
- **RNF04 (Performance)**: Endpoints com índices de busca rápida e tempo de resposta < 500ms em condições normais.

