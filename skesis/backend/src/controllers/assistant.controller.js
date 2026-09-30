import { getAssistantReply } from "../services/assistant.service.js";

export async function chat(req, res, next) {
  try {
    const reply = await getAssistantReply(req.body?.message);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}
