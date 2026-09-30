import { getStore } from "../config/db.js";
import { getCategory } from "../config/categories.js";
import { isValidDate, toDateStr } from "./dates.js";

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

export async function listHabits({ date } = {}) {
  let items = await getStore().findAll();
  if (date) items = items.filter((h) => h.date === date);
  // Más recientes primero
  return items.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return String(b.createdAt || "") > String(a.createdAt || "") ? 1 : -1;
  });
}

export async function createHabit(body = {}) {
  const category = getCategory(body.category);
  if (!category) throw badRequest("Categoría no válida");

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw badRequest("La cantidad debe ser un número mayor que 0");
  if (amount > category.max) throw badRequest(`La cantidad máxima para ${category.label} es ${category.max} ${category.unit}`);

  const date = body.date || toDateStr();
  if (!isValidDate(date)) throw badRequest("Fecha no válida (use AAAA-MM-DD)");
  if (date > toDateStr()) throw badRequest("No puedes registrar hábitos en fechas futuras");

  const note = String(body.note || "").trim().slice(0, 200);

  return getStore().create({ category: category.key, amount, date, note });
}

export async function deleteHabit(id) {
  const ok = await getStore().remove(id);
  if (!ok) {
    const err = new Error("Registro no encontrado");
    err.status = 404;
    throw err;
  }
}
