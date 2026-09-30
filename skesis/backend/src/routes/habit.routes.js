import { Router } from "express";
import { getCategories, getHabits, createHabit, deleteHabit } from "../controllers/habit.controller.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/habits", getHabits);
router.post("/habits", createHabit);
router.delete("/habits/:id", deleteHabit);

export default router;
