import { getStore } from "../config/db.js";
import { CATEGORIES } from "../config/categories.js";
import { lastNDays, toDateStr } from "./dates.js";

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const pct = (total, goal) => Math.min(100, Math.round((total / goal) * 100));

export async function getProgress(days = 7) {
  const n = Math.min(Math.max(parseInt(days, 10) || 7, 1), 30);
  const all = await getStore().findAll();
  const dates = lastNDays(n);

  // Totales por fecha y categoría
  const totals = {};
  for (const h of all) {
    totals[h.date] ??= {};
    totals[h.date][h.category] = (totals[h.date][h.category] || 0) + Number(h.amount);
  }

  const daily = dates.map((date) => {
    const byCategory = CATEGORIES.map((c) => {
      const total = totals[date]?.[c.key] || 0;
      return { key: c.key, total, percent: pct(total, c.goal) };
    });
    const percent = Math.round(byCategory.reduce((s, c) => s + c.percent, 0) / CATEGORIES.length);
    const d = new Date(`${date}T12:00:00`);
    return { date, label: DAY_LABELS[d.getDay()], percent, hasData: !!totals[date], byCategory };
  });

  const today = daily[daily.length - 1];
  const todayCategories = CATEGORIES.map((c) => {
    const total = today.byCategory.find((x) => x.key === c.key).total;
    return { ...c, total, percent: pct(total, c.goal) };
  });

  // Promedios: solo cuentan los días que tienen algún registro
  const activeDays = daily.filter((d) => d.hasData);
  const averages = CATEGORIES.map((c) => {
    const avg = activeDays.length
      ? Math.round(activeDays.reduce((s, d) => s + d.byCategory.find((x) => x.key === c.key).percent, 0) / activeDays.length)
      : 0;
    return { ...c, average: avg };
  });

  // Racha: días consecutivos con al menos un registro (hoy o desde ayer)
  const allDates = new Set(all.map((h) => h.date));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  if (!allDates.has(toDateStr(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (allDates.has(toDateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const periodAverage = activeDays.length ? Math.round(activeDays.reduce((s, d) => s + d.percent, 0) / activeDays.length) : 0;

  return {
    days: n,
    daily,
    today: { date: today.date, percent: today.percent, categories: todayCategories },
    averages,
    periodAverage,
    streak,
    totalRecords: all.length,
  };
}
