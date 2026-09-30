// Fuente única de las categorías de hábitos y sus metas diarias.
export const CATEGORIES = [
  { key: "sueno", label: "Sueño", unit: "horas", goal: 8, max: 16, emoji: "😴" },
  { key: "ejercicio", label: "Ejercicio", unit: "min", goal: 30, max: 300, emoji: "🏃" },
  { key: "agua", label: "Hidratación", unit: "vasos", goal: 8, max: 30, emoji: "💧" },
  { key: "alimentacion", label: "Alimentación", unit: "porciones", goal: 5, max: 20, emoji: "🥗" },
  { key: "descanso", label: "Descanso mental", unit: "min", goal: 15, max: 240, emoji: "🧘" },
];

export const getCategory = (key) => CATEGORIES.find((c) => c.key === key);
