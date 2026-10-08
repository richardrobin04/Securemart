import express from "express";

import protect from "../middleware/authMiddleware.js";
import {
  createEvent,
  getMyOrders
} from "../controllers/eventController.js";
const router = express.Router();

router.post("/", protect, createEvent);
router.get("/orders", protect, getMyOrders);

export default router;