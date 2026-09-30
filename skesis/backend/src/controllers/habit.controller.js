import { CATEGORIES } from "../config/categories.js";
import * as habitService from "../services/habit.service.js";

export const getCategories = (req, res) => res.json(CATEGORIES);

export async function getHabits(req, res, next) {
  try {
    res.json(await habitService.listHabits({ date: req.query.date }));
  } catch (err) {
    next(err);
  }
}

export async function createHabit(req, res, next) {
  try {
    res.status(201).json(await habitService.createHabit(req.body));
  } catch (err) {
    next(err);
  }
}

export async function deleteHabit(req, res, next) {
  try {
    await habitService.deleteHabit(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
