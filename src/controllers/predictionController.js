import { predictionModel } from '../models/predictionModel.js';
import { PredictionService } from '../services/predictionService.js';

export const getPrediction = async (req, res) => {
  const { fechaObjetivo } = req.body;

  try {
    const historicoRaw = await predictionModel.getResumenHistorico();
    
    const { N0, k, serie } = PredictionService.calcularModeloExponencial(historicoRaw);
    
    const ultimo = serie[serie.length - 1];
    const proyeccion = PredictionService.generarProyeccion(ultimo, N0, k, fechaObjetivo);

    res.json({
      modelo: {
        N0: Math.round(N0),
        k: k.toFixed(6),
        tasaMensual: ((Math.exp(k) - 1) * 100).toFixed(2) + '%'
      },
      historico: serie,
      proyeccion,
      totalActual: ultimo.N,
      totalProyectado: proyeccion.at(-1)?.Nt || ultimo.N
    });
  } catch (error) {
    console.error('Error en predicción:', error);
    res.status(422).json({ error: error.message });
  }
};