// ====================================================================
// SUCELSO TECH - Serviço de Análise de Taxa de Ocupação de Salas
// Diferencial de Excelência (Item 14)
// ====================================================================

const DIAS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
// 2 slots matutinos + 2 slots vespertinos = 4 blocos de aula por dia = 20 blocos por semana por sala
const SLOTS_TOTAIS_SEMANAIS_POR_SALA = 20;

function calculateRoomOccupancy(salas, horarios) {
  const relatorio = salas.map(sala => {
    const horariosDaSala = horarios.filter(h => h.sala_id === sala.id);
    const slotsOcupados = horariosDaSala.length;
    const taxaOcupacao = Math.min(100, Number(((slotsOcupados / SLOTS_TOTAIS_SEMANAIS_POR_SALA) * 100).toFixed(1)));

    // Distribuição por dia
    const ocupacaoPorDia = {};
    for (const dia of DIAS) {
      const aulasNoDia = horariosDaSala.filter(h => h.dia === dia).length;
      ocupacaoPorDia[dia] = {
        aulas: aulasNoDia,
        capacidade_dia: 4, // 4 blocos diários
        taxa: Number(((aulasNoDia / 4) * 100).toFixed(1))
      };
    }

    return {
      sala_id: sala.id,
      identificacao: sala.identificacao,
      capacidade: sala.capacidade,
      tipo: sala.tipo,
      slots_ocupados: slotsOcupados,
      capacidade_maxima_semanal: SLOTS_TOTAIS_SEMANAIS_POR_SALA,
      taxa_ocupacao_percentual: taxaOcupacao,
      status: taxaOcupacao >= 75 ? 'ALTA' : taxaOcupacao >= 40 ? 'MODERADA' : 'BAIXA',
      ocupacao_por_dia: ocupacaoPorDia
    };
  });

  const mediaGeral = relatorio.length > 0
    ? Number((relatorio.reduce((acc, curr) => acc + curr.taxa_ocupacao_percentual, 0) / relatorio.length).toFixed(1))
    : 0;

  return {
    media_ocupacao_geral_percentual: mediaGeral,
    total_salas_monitoradas: salas.length,
    salas: relatorio
  };
}

module.exports = {
  calculateRoomOccupancy
};

