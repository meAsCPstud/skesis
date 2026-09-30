import { getRecommendations } from "../services/recommendation.service.js";

export async function recommendations(req, res, next) {
  try {
    res.json(await getRecommendations());
  } catch (err) {
    next(err);
  }
}
