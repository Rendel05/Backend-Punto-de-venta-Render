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
    if (historico.length < 2) throw new Error('Muy pocos datos para predecir');

    let acumulado = 0;
    const serie = historico.map((row, i) => {
      acumulado += row.nuevos;
      return { mes: row.mes, t: i, N: acumulado };
    });

    const puntos = serie.filter(p => p.N > 0);
    const n = puntos.length;

    let sumT = 0, sumLnN = 0, sumT2 = 0, sumTLnN = 0;

    puntos.forEach(p => {
      const lnN = Math.log(p.N);
      sumT += p.t;
      sumLnN += lnN;
      sumT2 += p.t * p.t;
      sumTLnN += p.t * lnN;
    });

    const denom = (n * sumT2 - sumT * sumT);
    if (denom === 0) throw new Error('Error en cálculo');

    const k = (n * sumTLnN - sumT * sumLnN) / denom;
    const lnN0 = (sumLnN - k * sumT) / n;
    const N0 = Math.exp(lnN0);

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