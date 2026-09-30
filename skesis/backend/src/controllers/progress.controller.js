import { getProgress } from "../services/progress.service.js";

export async function progress(req, res, next) {
  try {
    res.json(await getProgress(req.query.days));
  } catch (err) {
    next(err);
  }
}
