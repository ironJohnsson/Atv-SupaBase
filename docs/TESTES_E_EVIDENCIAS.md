# Roteiro de Testes e Evidências de Validação
## SUCELSO TECH - Sistema Inteligente de Horários Escolares
**Universidade Senai Cimatec | Engenharia de Computação | Prof. Celso Barreto**

Este documento descreve os casos de teste formais executados para validar o atendimento a 100% dos requisitos da Situação de Aprendizagem, incluindo o **Cenário Obrigatório de Validação** (Item 10) e os **Diferenciais de Excelência** (Item 14).

---

### 1. Dados de Teste Cadastrados (Atendimento ao Cenário Obrigatório)
- **Turmas (3 cadastradas)**:
  1. *Engenharia de Computação - 5º Semestre* (Matutino, 2026.1)
  2. *Análise e Desenv. de Sistemas (ADS) - 3º Semestre* (Matutino, 2026.1)
  3. *Redes de Computadores - 2º Semestre* (Vespertino, 2026.1)
- **Professores (6 cadastrados)**:
  1. **Prof. Roberto Lima** (`roberto@sucelso.tech`) - *Restrição estrita: disponibilidade APENAS Segundas e Quartas*.
  2. **Profa. Camila Duarte** (`camila@sucelso.tech`) - Segunda a Sexta Matutino.
  3. **Prof. Marcos Vinicius** (`marcos@sucelso.tech`) - Terças, Quintas e Sextas.
  4. **Profa. Juliana Santos** (`juliana@sucelso.tech`) - Segunda a Sexta Matutino e Vespertino.
  5. **Prof. André Silveira** (`andre@sucelso.tech`) - Segundas, Terças e Quintas.
  6. **Profa. Fernanda Rocha** (`fernanda@sucelso.tech`) - Quartas, Quintas e Sextas.
- **Disciplinas (8 cadastradas)**:
  1. Banco de Dados Avançado (BD01)
  2. Desenvolvimento Web Full Stack (DW02)
  3. Redes de Computadores (RC03)
  4. Inteligência Artificial e Heurísticas (IA04)
  5. Sistemas Distribuídos e Cloud (SD05)
  6. Engenharia de Software e UML (ES06)
  7. Segurança da Informação (SI07)
  8. Projeto Integrador de Computação (PI08)
- **Salas (5 cadastradas)**:
  1. Lab. Computação 101 (40 lugares)
  2. Lab. Redes & Hardware 102 (35 lugares)
  3. Lab. Inteligência Artificial 103 (30 lugares)
  4. Sala de Aula Teórica 201 (45 lugares)
  5. Sala Maker & Inovação 202 (30 lugares)

---

### 2. Matriz de Casos de Teste e Validação

| ID | Cenário / Ação | Perfil Testado | Resultado Esperado | Status |
| :---: | :--- | :---: | :--- | :---: |
| **CT01** | Autenticação no sistema com e-mail e senha válidos | Todos | Login efetuado com sucesso, redirecionamento para o dashboard do perfil correspondente com JWT emitido. | **PASSOU** |
| **CT02** | Tentativa de acesso de Aluno a endpoint de Coordenador (`POST /api/horarios/gerar`) | Aluno | Backend intercepta a requisição e retorna `HTTP 403 Forbidden` com mensagem de erro descritiva. | **PASSOU** |
| **CT03** | Visualização de grade horária por Aluno | Aluno | Visualiza a grade oficial de sua turma com salas e professores, sem qualquer botão de edição ou publicação. | **PASSOU** |
| **CT04** | Registro e atualização de disponibilidade do Professor | Professor | Professor visualiza seus horários e altera seus dias/turnos disponíveis. | **PASSOU** |
| **CT05** | Restrição do Prof. Roberto Lima (Apenas Seg/Qua) | Coordenador / Algoritmo | O algoritmo de geração automática só agenda aulas do Prof. Roberto nas segundas e quartas, respeitando rigorosamente a restrição. | **PASSOU** |
| **CT06** | Detecção de Conflitos de Sala e Docente | Coordenador | Ao forçar dois agendamentos no mesmo horário para o mesmo professor ou sala, o sistema identifica e aponta o conflito no painel. | **PASSOU** |
| **CT07** | Ajuste manual de slot de aula pelo Coordenador | Coordenador | Coordenador clica em um slot, altera sala/horário e salva. Registro é gravado na tabela `historico_alteracoes`. | **PASSOU** |
| **CT08** | Ciclo de vida da Versão (`rascunho` -> `em_revisao` -> `publicada`) | Coordenador | Grade em rascunho não é visível para os alunos. Somente após publicação o aluno tem acesso aos horários oficiais. | **PASSOU** |
| **CT09** | Alteração de disponibilidade docente após publicação | Professor | Registro entra com status pendente de aprovação, mantendo intacta a grade oficial já homologada. | **PASSOU** |
| **CT10** | Exportação da Grade em PDF (Diferencial) | Todos | Geração de documento PDF estilizado e pronto para download e impressão em um clique. | **PASSOU** |
| **CT11** | Painel de Taxa de Ocupação de Salas (Diferencial) | Coordenador | Gráficos e indicadores percentuais de ocupação semanal de cada laboratório e sala teórica. | **PASSOU** |

