import {
  getAllOffers,
  addNewOffer,
  getActiveOffers,
  updateOfferStatus,
  updateOffer,
  getOfferById
} from '../models/offersModel.js'


export const getOffers = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const offers = await getAllOffers(page, limit)

    res.json(offers)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener ofertas" })

  }

}

export const getOffer = async (req,res) => {
  const {id} = req.params;
  try{
    const offer = await getOfferById(id)
    res.json(offer)
  }
  catch{
    res.status(500).json({message:"Error al obtener oferta"})
  }
}

export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (activo !== 0 && activo !== 1) {
      return res.status(400).json({
        message: 'Estado inválido'
      });
    }

    const affectedRows = await updateOfferStatus(id, activo);

    if (affectedRows === 0) {
      return res.status(404).json({
        message: 'Oferta no encontrada'
      });
    }

    res.json({
      message: 'Estado actualizado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error en el servidor'
    });
  }
};


export const createOffer = async (req, res) => {
  try {
    const { product_id, offer_price, start_date, end_date } = req.body;

    const result = await addNewOffer(product_id, offer_price, start_date, end_date);

    if (result.success) {
      if (result.affectedRows > 0) {
        res.status(201).json({ message: "Oferta creada correctamente" });
      } else {
        res.status(400).json({ message: "No se pudo crear la oferta" });
      }
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al crear oferta" });
  }
}

export const getActiveOffersController = async (req, res) => {

  try {

    const offers = await getActiveOffers()

    res.json(offers)

  } catch (error) {

    res.status(500).json({ message: "Error obteniendo ofertas activas" })

  }

}


export const updateOfferController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, offer_price, start_date, end_date, active } = req.body;

    const result = await updateOffer(id, product_id, offer_price, start_date, end_date, active);

    if (result.success) {
      if (result.affectedRows > 0) {
        res.json({ message: "Oferta actualizada correctamente" });
      } else {
        res.status(404).json({ message: "Oferta no encontrada" });
      }
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Error actualizando oferta" });
  }
}