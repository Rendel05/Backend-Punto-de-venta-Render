import express from "express";
import { mpWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/mercadopago", mpWebhook);

export default router;