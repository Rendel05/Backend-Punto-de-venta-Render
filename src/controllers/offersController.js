import {
  getAllOffers,
  addNewOffer
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


export const createOffer = async (req, res) => {

  try {

    const {
      product_id,
      offer_price,
      start_date,
      end_date
    } = req.body

    const result = await addNewOffer(
      product_id,
      offer_price,
      start_date,
      end_date
    )

    if (result > 0) {
      res.status(201).json({ message: "Oferta creada correctamente" })
    } else {
      res.status(400).json({ message: "No se pudo crear la oferta" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al crear oferta" })

  }

}