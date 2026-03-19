import { postReview,getAllReviews,deleteReview } from "../models/reviewModels.js";

export const createReview = async (req, res) => {

  try {

    const { producto_id, comentario, calificacion } = req.body;
    const cliente_id = req.user.id;

    if (!producto_id || !comentario || !calificacion) {
      return res.status(400).json({ message: "Error: datos incompletos" });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ message: "Calificación inválida" });
    }

    const result = await postReview(
      producto_id,
      cliente_id,
      comentario,
      calificacion
    );

    res.json({ message: "Reseña creada", result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }

}

export const removeReview = async (req, res) => {

  try {

    const review_id = req.params.id;
    const cliente_id = req.user.id;

    const result = await deleteReview(review_id, cliente_id);

    if (result === 0) {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.json({ message: "Reseña eliminada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }

}

export const getReviews = async (req, res) => {

  try {

    const producto_id = req.params.id;

    if (!producto_id) {
      return res.status(400).json({ message: "ID de producto requerido" });
    }

    const result = await getAllReviews(producto_id);

    res.json({
      reviews: result.data,
      total: result.total,
      average: result.average || 0
    });

  } catch (error) {
    console.error("Error obteniendo reseñas:", error);
    res.status(500).json({ message: "Error del servidor" });
  }

};