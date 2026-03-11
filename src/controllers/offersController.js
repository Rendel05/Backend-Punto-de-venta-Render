import {
  getAllOffers,
  addNewOffer,
  getActiveOffers
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

export const getActiveOffersController = async (req, res) => {

  try {

    const offers = await getActiveOffers();

    res.json({
      data: offers
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error obteniendo ofertas activas"
    });

  }

};

import { updateOffer } from "../models/offersModel.js";

export const updateOfferController = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      product_id,
      offer_price,
      start_date,
      end_date,
      active
    } = req.body;

    const affectedRows = await updateOffer(
      id,
      product_id,
      offer_price,
      start_date,
      end_date,
      active
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Oferta no encontrada"
      });
    }

    res.json({
      message: "Oferta actualizada correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error actualizando oferta"
    });

  }

};