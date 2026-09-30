import { Router } from "express";
import { recommendations } from "../controllers/recommendation.controller.js";

const router = Router();
router.get("/recommendations", recommendations);

export default router;
