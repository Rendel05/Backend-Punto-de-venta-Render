import { predictionModel } from '../models/predictionModel.js';
import { PredictionService } from '../services/predictionService.js';

export const getSummary = async (req, res) => {
  try {
    const rawData = await predictionModel.getResumenHistorico();
    const total = await predictionModel.getTotalClientes();

    const history = PredictionService.formatHistoricalData(rawData);

    res.json({ total, historico: history });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPrediction = async (req, res) => {
  const { fechaObjetivo } = req.body;

  try {
    const rawData = await predictionModel.getResumenHistorico();

    const { N0, k, serie } =
      PredictionService.calcularModeloExponencial(rawData);

    const lastPoint = serie[serie.length - 1];

    const projection = PredictionService.generarProyeccion(
      lastPoint,
      N0,
      k,
      fechaObjetivo
    );

    res.json({
      modelo: {
        N0: Math.round(N0),
        k: k.toFixed(6),
        tasaMensual: ((Math.exp(k) - 1) * 100).toFixed(2) + '%'
      },
      historico: serie,
      proyeccion: projection,
      totalActual: lastPoint.N,
      totalProyectado: projection.at(-1)?.Nt || lastPoint.N
    });

  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};