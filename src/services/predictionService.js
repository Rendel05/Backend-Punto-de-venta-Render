export const PredictionService = {

  formatHistoricalData(rawRows) {
    let cumulative = 0;
    return rawRows.map(row => {
      cumulative += row.nuevos;
      return {
        month: row.mes,
        newClients: row.nuevos,
        total: cumulative
      };
    });
  },

  calcularModeloExponencial(historico) {
    if (historico.length < 1) throw new Error('No hay datos históricos');

    const parseYM = mes => {
      const [y, m] = mes.split('-').map(Number);
      return y * 12 + (m - 1);
    };

    let acumulado = 0;
    const rawSerie = historico.map(row => {
      acumulado += row.nuevos;
      return { mes: row.mes, absT: parseYM(row.mes), N: acumulado };
    });

    const t0 = rawSerie[0].absT;
    const serie = rawSerie.map(p => ({
      mes: p.mes,
      t: p.absT - t0,
      N: p.N
    }));

    const first = serie[0];
    const last = serie[serie.length - 1];

    let N0 = first.N;
    let k = last.t > 0 ? Math.log(last.N / N0) / last.t : 0;

    return { N0, k, serie };
  },

  generarProyeccion(ultimoPunto, N0, k, fechaObjetivo) {
    const [fyear, fmonth] = fechaObjetivo.split('-').map(Number);
    const fechaFin = new Date(fyear, fmonth - 1, 1);

    const [y, m] = ultimoPunto.mes.split('-').map(Number);
    const base = new Date(y, m - 1, 1);

    const proyeccion = [];
    let cursor = new Date(base);
    cursor.setMonth(cursor.getMonth() + 1);

    let paso = 1;
    while (cursor <= fechaFin) {
      const t = ultimoPunto.t + paso;
      const Nt = Math.round(N0 * Math.exp(k * t));

      proyeccion.push({
        mes: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`,
        t,
        Nt
      });

      cursor.setMonth(cursor.getMonth() + 1);
      paso++;
    }

    return proyeccion;
  }
};