import { Router } from "express";
import habitRoutes from "./habit.routes.js";
import progressRoutes from "./progress.routes.js";
import recommendationRoutes from "./recommendation.routes.js";
import assistantRoutes from "./assistant.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", app: "skesis", time: new Date().toISOString() });
});

router.use(habitRoutes);
router.use(progressRoutes);
router.use(recommendationRoutes);
router.use(assistantRoutes);

export default router;
