import express from "express";

import protect from "../middleware/authMiddleware.js";
import { logoutUser } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/logout", protect, logoutUser);

export default router;